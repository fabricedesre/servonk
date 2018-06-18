/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// For size_of::<linux_input_event>() in input.rs
#![feature(const_size_of)]

extern crate android_logger;
extern crate api_server;
extern crate egl;
extern crate errno;
extern crate gleam;
extern crate gonk_gfx;
#[macro_use]
extern crate lazy_static;
extern crate libc;
#[macro_use]
extern crate log;
extern crate mio;
extern crate mtdev;
extern crate servo;

mod browser;
mod browser_window;
mod events_loop;
mod input;
mod resources;

use android_logger::Filter;
use api_server::server::MessageToSystemApp;
use events_loop::*;
use servo::compositing::windowing::{WindowEvent, WindowMethods};
use servo::euclid::{TypedPoint2D, TypedSize2D, TypedVector2D};
use servo::ipc_channel::ipc;
use servo::msg::constellation_msg::{Key, KeyState};
use servo::script_traits::TouchEventType;
use servo::servo_config::opts;
use servo::servo_url::ServoUrl;
use servo::webrender_api::ScrollLocation;
use std::env;
use std::sync::mpsc;

// This should vary by zoom level and maybe actual text size (focused or under cursor)
const LINE_HEIGHT: f32 = 38.0;

// Customize the UA to not show the Android Token.
const USER_AGENT: &'static str = "Mozilla/5.0 (Mobile; rv:60.0) Servo/1.0 Firefox/60.0";

fn main() {
    let mut log_level = log::Level::Info;

    let mut init_size = None;
    let mut next_is_multiprocess_token = false;
    for arg in ::std::env::args() {
        // Parse the --resolution=wxh argument.
        if arg.starts_with("--resolution=") {
            let res_string = arg.split("=").nth(1).unwrap();
            let res: Vec<u32> = res_string
                .split('x')
                .map(|r| r.parse().unwrap_or(400))
                .collect();
            init_size = Some(TypedSize2D::new(res[0], res[1]));
        } else if arg == "--debug" {
            log_level = log::Level::Debug;
        } else if arg == "--content-process" {
            next_is_multiprocess_token = true;
        } else if next_is_multiprocess_token {
            println!("-> multiprocess token is {}", arg);
            return servo::run_content_process(arg);
        }
    }

    android_logger::init_once(Filter::default().with_min_level(log_level));

    let start_url = env::args().nth(1).unwrap_or_else(|| "index.html".into());
    info!(
        "Servo version {}, loading {}",
        servo::config::servo_version(),
        start_url
    );

    resources::init();

    let mut opts = opts::default_opts();
    // Set the window size.
    if let Some(size) = init_size {
        opts.initial_window_size = size;
    }
    opts.user_agent = USER_AGENT.into();
    opts.config_dir = Some(env::current_dir().unwrap_or("/data/local/servonk".into()));

    // opts.certificate_path = Some(certificate_path.to_str().unwrap().into());

    // TODO: figure out failure to start child process.
    opts.multiprocess = false;

    // Setup the event loop and create the main objects.
    let looper = EventLoop::new();
    let window = browser_window::BrowserWindow::new(&looper.get_sender());

    let (_width, _height, dpi) = window.info();

    // Choose the devive pixels ratio based on the real dpi.
    opts.device_pixels_per_px = Some(if dpi < 200 {
        1.0
    } else if dpi < 280 {
        2.0
    } else {
        dpi as f32 / 150.0 + 0.5
    });
    // Hardcode for now...
    opts.device_pixels_per_px = Some(1.0);

    opts::set_defaults(opts);

    let actual_opts = opts::get();
    println!(
        "Options configured as {:?} {:?} {:?}",
        actual_opts.certificate_path,
        actual_opts.device_pixels_per_px,
        opts::multiprocess()
    );

    let (ws_sender, ws_receiver) = mpsc::channel();
    api_server::start_api_server(ws_sender);
    let api_server = ws_receiver
        .recv()
        .expect("Failed to get the api server address");

    let mut browser = browser::Browser::new(&looper.get_sender());

    let mut servo = servo::Servo::new(window.clone());

    // Load the initial url in a new browser and select it.
    info!("About to load {}", start_url);
    let url = ServoUrl::parse(&start_url).unwrap();
    let (sender, receiver) = ipc::channel().unwrap();
    servo.handle_events(vec![WindowEvent::NewBrowser(url.clone(), sender)]);
    let browser_id = receiver.recv().unwrap();
    servo.handle_events(vec![WindowEvent::SelectBrowser(browser_id)]);

    input::run_input_loop(&looper.get_sender());

    let waker = window.create_event_loop_waker();
    let (sender, api_receiver) = mpsc::channel();
    api_server.do_send(api_server::server::SetServoSender { waker, sender });

    // Process events by reinjecting them into Servo's event loop.
    looper.run(|event| {
        let servo_events = servo.get_events();

        // Filter the events that will be sent out to the system app.
        let mut final_servo_events = vec![];
        for event in servo_events {
            if let Some(system_event) = MessageToSystemApp::from_embedder_msg(&event) {
                api_server.do_send(system_event);
            } else {
                final_servo_events.push(event);
            }
        }
        browser.handle_servo_events(final_servo_events);

        let mut res = ControlFlow::Continue;
        match event {
            Event::WakeUpEvent => {
                // When getting an Idle event, check if we have pending messages from
                // the WebSocket connection since the WebSocket side wakes up the event loop.
                let mut events = Vec::new();
                while let Ok(msg) = api_receiver.try_recv() {
                    println!("Frontend message: {:?}", msg);
                    // Build a Servo event and queue it.
                    events.push(msg.into());
                }
                if !events.is_empty() {
                    servo.handle_events(events);
                }

                // Wake up servo.
                servo.handle_events(vec![]);
            }
            Event::WindowEvent(WindowEvent::KeyEvent(char_, key, state, modifier)) => {
                // Special processing for some key events.
                println!("Key event: {:?} {:?}", state, key);
                if key == Key::Home {
                    // Zoom out.
                    if state == KeyState::Released {
                        servo.handle_events(vec![WindowEvent::Zoom(1.0 / 1.1)]);
                    }
                } else if key == Key::End {
                    // Zoom in.
                    if state == KeyState::Released {
                        servo.handle_events(vec![WindowEvent::Zoom(1.1)]);
                    }
                } else if key == Key::Up {
                    if state == KeyState::Pressed {
                        servo.handle_events(vec![WindowEvent::Scroll(
                            ScrollLocation::Delta(TypedVector2D::new(0.0, 2.0 * LINE_HEIGHT)),
                            TypedPoint2D::new(0, 0),
                            TouchEventType::Move,
                        )]);
                    }
                } else if key == Key::Down {
                    if state == KeyState::Pressed {
                        servo.handle_events(vec![WindowEvent::Scroll(
                            ScrollLocation::Delta(TypedVector2D::new(0.0, -2.0 * LINE_HEIGHT)),
                            TypedPoint2D::new(0, 0),
                            TouchEventType::Move,
                        )]);
                    }
                } else {
                    servo.handle_events(vec![WindowEvent::KeyEvent(char_, key, state, modifier)]);
                }
            }
            Event::WindowEvent(event) => {
                // Relay other window events directly.
                servo.handle_events(vec![event]);
            }
            Event::ShutdownEvent => {
                res = ControlFlow::Break;
            }
        }
        res
    });
}
