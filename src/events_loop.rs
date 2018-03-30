/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// The event loop that orchestrates waking up Servo and dispatching
/// input events from the device.

use servo::compositing::windowing::WindowEvent;
use std::sync::mpsc::*;

#[derive(Debug)]
pub enum Event {
    WindowEvent(WindowEvent),
    WakeUpEvent,
    ShutdownEvent,
}

pub enum ControlFlow {
    Continue,
    Break,
}

pub struct EventLoop {
    receiver: Receiver<Event>,
    sender: Sender<Event>,
}

impl EventLoop {
    pub fn new() -> EventLoop {
        let (sender, receiver) = channel();
        EventLoop { receiver, sender }
    }

    pub fn get_sender(&self) -> Sender<Event> {
        self.sender.clone()
    }

    pub fn run<F>(&self, mut callback: F)
    where
        F: FnMut(Event) -> ControlFlow,
    {
        loop {
            let event = self.receiver.recv().unwrap();
            debug!("Got event {:?}", event);
            let res = callback(event);
            match res {
                ControlFlow::Break => {
                    info!("Aborting event loop");
                    break;
                }
                ControlFlow::Continue => {}
            }
        }
    }
}
