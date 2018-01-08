/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// For size_of::<linux_input_event>() in input.rs
#![feature(const_size_of)]

extern crate egl;
extern crate errno;
extern crate gleam;
extern crate libc;
extern crate servo;

mod gonk_gfx;
mod input;
mod window;

use servo::servo_config::resource_files::set_resources_path;
use servo::servo_config::opts;
use std::env;
use std::sync::mpsc::channel;

// WIP: will not work because we don't implement the event loop walker
// yet among other things...

fn main() {
    println!(
        "Servonk starting, Servo version: {}",
        servo::config::servo_version()
    );

    let path = env::current_dir().unwrap().join("resources");
    let path = path.to_str().unwrap().to_string();
    set_resources_path(Some(path));

    let opts = opts::default_opts();
    opts::set_defaults(opts);

    let window = window::Window::new();

    let mut servo = servo::Servo::new(window);

    let (sender, receiver) = channel();
    input::run_input_loop(&sender);
    loop {
        let event = receiver.recv().unwrap();
        println!("Got {:?}", event);
    }
}
