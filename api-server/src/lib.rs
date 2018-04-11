/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

extern crate actix;
extern crate actix_web;
#[macro_use]
extern crate log;
extern crate rand;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
extern crate servo;

use actix::prelude::*;
use actix::{fut, Actor, StreamHandler};
use actix_web::{fs, middleware, ws, Application, Error, HttpRequest, HttpResponse, HttpServer,
                Method};
use std::env;
use std::sync::mpsc::Sender;
use std::thread;

pub mod server;

use server::*;

struct WsSessionState {
    addr: Addr<Syn, server::ApiServer>,
}

// Do the websocket handshake and start an actor to manage this connection.
fn ws_index(req: HttpRequest<WsSessionState>) -> Result<HttpResponse, Error> {
    println!("Got WS connection!");
    ws::start(req, WsSession { id: 0 })
}

struct WsSession {
    /// unique session id
    id: usize,
}

/// Handle messages from the api server, we simply send it to the peer websocket.
impl Handler<ServiceMessage> for WsSession {
    type Result = ();

    fn handle(&mut self, msg: ServiceMessage, ctx: &mut Self::Context) {
        // Turn the msg into JSON and send it.
        let json = serde_json::to_string(&msg).unwrap_or("ouch".into());
        info!("Sending {}", json);
        ctx.text(json);
    }
}

impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self, WsSessionState>;

    /// Method is called on actor start.
    /// We register ws session with ChatServer
    fn started(&mut self, ctx: &mut Self::Context) {
        info!("Starting WsSession");

        // register self in the api server. `AsyncContext::wait` register
        // future within context, but context waits until this future resolves
        // before processing any other events.
        // HttpContext::state() is instance of WsSessionState, state is shared across all
        // routes within application.
        let addr: Addr<Syn, _> = ctx.address();
        ctx.state()
            .addr
            .send(server::Connect {
                addr: addr.recipient(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                match res {
                    Ok(res) => act.id = res,
                    // Something is wrong with the api server actor.
                    _ => ctx.stop(),
                }
                fut::ok(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        // Notify the api server.
        ctx.state().addr.do_send(server::Disconnect { id: self.id });
        Running::Stop
    }
}

// Handler for ws::Message messages.
impl StreamHandler<ws::Message, ws::ProtocolError> for WsSession {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Self::Context) {
        match msg {
            ws::Message::Ping(msg) => ctx.pong(&msg),
            ws::Message::Text(text) => ctx.text(text),
            ws::Message::Binary(bin) => ctx.binary(bin),
            ws::Message::Close(_) => {
                ctx.stop();
            }
            _ => (),
        }
    }
}

/// Starts the local server.
pub fn start_api_server(sender: Sender<Addr<Syn, ApiServer>>) {
    // let sys = actix::System::new("api-server");
    // let server: Addr<Syn, _> = Arbiter::start(|_| ApiServer::default());

    thread::spawn(move || {
        let sys = actix::System::new("api-ws-server");

        let server: Addr<Syn, _> = Arbiter::start(|_| ApiServer::default());

        sender.send(server.clone()).expect("Failed to send back server address!");

        HttpServer::new(move || {
            let state = WsSessionState { addr: server.clone() };

            // Serve the ui from $UI_ROOT if set or `./ui/` by default.
            let ui_root = match env::var("UI_ROOT") {
                Ok(path) => path,
                Err(_) => "./ui/".to_owned()
            };
            
            Application::with_state(state)
                // enable logger
                .middleware(middleware::Logger::default())
                // websocket route
                .resource("/api/v1/", |r| r.method(Method::GET).f(ws_index))
                // static files
                .handler("/", fs::StaticFiles::new(ui_root, true))
            })
        .disable_signals() // TODO: figure out why this is actually preventing shutdown.
        .bind("127.0.0.1:8000").expect("Can not bind to 127.0.0.1:8000")
        .shutdown_timeout(0) // <- Set shutdown timeout to 0 seconds (default 60s)
        .start();

        info!("Starting http server on 127.0.0.1:8000");
        let _ = sys.run();

        info!("Http server stopped.");
    });
}
