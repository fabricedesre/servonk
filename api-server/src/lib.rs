/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

extern crate actix;
extern crate actix_web;
#[macro_use]
extern crate log;

use actix_web::*;
use std::thread;

/// Starts the local server.
/// TODO: add parameters.
pub fn start_api_server() {
    thread::spawn(move || {
        let sys = actix::System::new("api-server");

        let _addr = HttpServer::new(
        || Application::new()
            // enable logger
            .middleware(middleware::Logger::default())
            .handler("/", fs::StaticFiles::new("./ui/", true))
            )

        .bind("127.0.0.1:8000").expect("Can not bind to 127.0.0.1:8000")
        .shutdown_timeout(0)    // <- Set shutdown timeout to 0 seconds (default 60s)
        .start();

        info!("Starting http server on 127.0.0.1:8000");
        let _ = sys.run();

        info!("Http server stopped.");
    });
}
