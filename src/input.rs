/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use events_loop::Event;
use mio::*;
use mio::unix::EventedFd;
use mtdev::{input_event, MtDev};
use servo::compositing::windowing::WindowEvent;
use servo::euclid::TypedPoint2D;
use servo::msg::constellation_msg::{Key, KeyModifiers, KeyState};
use servo::script_traits::{TouchEventType, TouchId};
use std::fs::File;
use std::os::unix::io::AsRawFd;
use std::path::Path;
use std::sync::mpsc::Sender;
use std::thread;

const EV_SYN: u16 = 0;
const EV_KEY: u16 = 1;
// const EV_REL: u16 = 2;
const EV_ABS: u16 = 3;

const SYN_REPORT: u16 = 0;

const ABS_MT_SLOT: u16 = 0x2f;
const ABS_MT_TOUCH_MAJOR: u16 = 0x30;
const ABS_MT_TOUCH_MINOR: u16 = 0x31;
const ABS_MT_WIDTH_MAJOR: u16 = 0x32;
const ABS_MT_WIDTH_MINOR: u16 = 0x33;
const ABS_MT_ORIENTATION: u16 = 0x34;
const ABS_MT_POSITION_X: u16 = 0x35;
const ABS_MT_POSITION_Y: u16 = 0x36;
const ABS_MT_TOOL_TYPE: u16 = 0x37;
const ABS_MT_TRACKING_ID: u16 = 0x39;
const ABS_MT_PRESSURE: u16 = 0x3a;

enum SlotStatus {
    Tracked,
    Untracked,
    WillTrack,
    WillUntrack,
}

struct InputSlot {
    status: SlotStatus,
    tracking_id: i32,
    x: i32,
    y: i32,
}

impl Default for InputSlot {
    fn default() -> Self {
        InputSlot {
            status: SlotStatus::Untracked,
            tracking_id: -1,
            x: 0,
            y: 0,
        }
    }
}

// Matches what mtdev uses.
const SLOT_COUNT: usize = 11;

#[derive(Default)]
struct TouchInputContext {
    slots: [InputSlot; SLOT_COUNT],
    current_slot: usize,
    x_min: i32,
    y_min: i32,
}

impl TouchInputContext {
    pub fn new(x_min: i32, y_min: i32) -> Self {
        TouchInputContext {
            x_min,
            y_min,
            ..Default::default()
        }
    }
}

// Processes a Type B protocol event.
// See https://github.com/torvalds/linux/blob/master/Documentation/input/multi-touch-protocol.rst
fn process_touch_event(
    event: &input_event,
    context: &mut TouchInputContext,
    sender: &Sender<Event>,
) {
    match (event.type_, event.code) {
        (EV_SYN, SYN_REPORT) => {
            // Report the state of all tracked touches.
            // println!("SYN_REPORT");
            for i in 0..SLOT_COUNT {
                let slot = &mut context.slots[i];
                let position = TypedPoint2D::new(slot.x as f32, slot.y as f32);

                match slot.status {
                    SlotStatus::Tracked => {
                        // We moved.
                        // println!("Slot tracking #{} moved", slot.tracking_id);
                        // Send touchmove event.
                        sender
                            .send(Event::WindowEvent(WindowEvent::Touch(
                                TouchEventType::Move,
                                TouchId(slot.tracking_id),
                                position,
                            )))
                            .ok()
                            .unwrap();
                    }
                    SlotStatus::WillUntrack => {
                        // We just released this slot.
                        println!("Touch up for #{}", slot.tracking_id);
                        // Send a touchup event.
                        sender
                            .send(Event::WindowEvent(WindowEvent::Touch(
                                TouchEventType::Up,
                                TouchId(slot.tracking_id),
                                position,
                            )))
                            .ok()
                            .unwrap();
                        // sender
                        //     .send(Event::WindowEvent(WindowEvent::Touch(
                        //         TouchEventType::Cancel,
                        //         TouchId(slot.tracking_id),
                        //         position,
                        //     )))
                        //     .ok()
                        //     .unwrap();
                        slot.status = SlotStatus::Untracked;
                    }
                    SlotStatus::WillTrack => {
                        // We start tracking this touch.
                        println!("Touch down for #{}", slot.tracking_id);
                        // Send a touchdown event.
                        sender
                            .send(Event::WindowEvent(WindowEvent::Touch(
                                TouchEventType::Down,
                                TouchId(slot.tracking_id),
                                position,
                            )))
                            .ok()
                            .unwrap();
                        slot.status = SlotStatus::Tracked;
                    }
                    SlotStatus::Untracked => {}
                }
            }
        }
        (EV_SYN, _) => println!("Unknown SYN code={}, value={}", event.code, event.value),
        (EV_ABS, ABS_MT_SLOT) => if (event.value as usize) < context.slots.len() {
            // println!("ABS_MT_SLOT {}", event.value);
            context.current_slot = event.value as usize;
        } else {
            println!("Invalid slot! {}", event.value);
        },
        (EV_ABS, ABS_MT_TOUCH_MAJOR) => (),
        (EV_ABS, ABS_MT_TOUCH_MINOR) => (),
        (EV_ABS, ABS_MT_WIDTH_MAJOR) => (),
        (EV_ABS, ABS_MT_WIDTH_MINOR) => (),
        (EV_ABS, ABS_MT_ORIENTATION) => (),
        (EV_ABS, ABS_MT_TOOL_TYPE) => (),
        (EV_ABS, ABS_MT_PRESSURE) => (),
        (EV_ABS, ABS_MT_POSITION_X) => {
            context.slots[context.current_slot].x = event.value - context.x_min;
        }
        (EV_ABS, ABS_MT_POSITION_Y) => {
            context.slots[context.current_slot].y = event.value - context.y_min;
        }
        (EV_ABS, ABS_MT_TRACKING_ID) => {
            // println!(
            //     "ABS_MT_TRACKING_ID current={} value={}",
            //     context.slots[context.current_slot].tracking_id, event.value
            // );
            let slot = &mut context.slots[context.current_slot];
            if event.value == -1 {
                slot.status = SlotStatus::WillUntrack;
            } else {
                slot.tracking_id = event.value;
                slot.status = SlotStatus::WillTrack;
            }
        }
        (EV_ABS, _) => println!("Unknown ABS code {:x}", event.code),
        (_, _) => println!(
            "Unexpected event: type={} code={} value={}",
            event.type_, event.code, event.value
        ),
    }
}

fn process_key_event(event: &input_event, sender: &Sender<Event>) {
    let key_state = if event.value == 1 {
        KeyState::Pressed
    } else {
        KeyState::Released
    };

    // Map key codes to the Key enum.
    let key = match event.code {
        0x02 => Key::Kp1,
        0x03 => Key::Kp2,
        0x04 => Key::Kp3,
        0x05 => Key::Kp4,
        0x06 => Key::Kp5,
        0x07 => Key::Kp6,
        0x08 => Key::Kp7,
        0x09 => Key::Kp8,
        0x0a => Key::Kp9,
        0x0b => Key::Kp0,
        0x67 => Key::Up,
        0x69 => Key::Left,
        0x6a => Key::Right,
        0x6c => Key::Down,
        0x74 => Key::Backspace,   // Hang up
        0x8b => Key::Home,        // LSK
        0x9e => Key::End,         // RSK
        0xe7 => Key::Insert,      // Pick up
        0x160 => Key::KpEnter,    // CSK
        0x20a => Key::KpMultiply, // *
        0x20b => Key::KpEqual,    // #
        _ => {
            println!("Unknown key: {} 0x{:x}", event.code, event.code);
            return;
        }
    };

    let event = WindowEvent::KeyEvent(None, key, key_state, KeyModifiers::empty());
    sender.send(Event::WindowEvent(event)).ok().unwrap();
}

fn process_events(device: &mut MtDev, context: &mut TouchInputContext, sender: &Sender<Event>) {
    if let Ok(events) = device.get_events() {
        for event in events {
            if event.type_ == EV_KEY {
                process_key_event(&event, sender);
            } else {
                process_touch_event(&event, context, sender);
            }
        }
    } else {
        error!("get_events() failed.");
    }
}

pub fn run_input_loop(event_sender: &Sender<Event>) {
    let sender = event_sender.clone();
    thread::spawn(move || {
        let poll = Poll::new().unwrap();
        let mut mio_events = Events::with_capacity(1024);

        let mut xmin = 0;
        let mut ymin = 0;

        // Register input devices with the mio event loop.
        // We keep the File alive to prevent closing of the device.
        let mut inputs: Vec<(File, MtDev)> = Vec::new();
        let mut i = 0;
        loop {
            let path = format!("/dev/input/event{}", i);
            if let Ok(file) = File::open(Path::new(&path)) {
                let fd = file.as_raw_fd();
                if let Some(mtdev) = MtDev::new(fd) {
                    // This fails on devices that don't provide touch events,
                    // but that's fine.
                    if let Some((x, y)) = mtdev.xmin_ymin() {
                        xmin = x;
                        ymin = y;
                    }
                    inputs.push((file, mtdev));
                    poll.register(
                        &EventedFd(&fd),
                        Token(i),
                        Ready::readable(),
                        PollOpt::edge(),
                    ).unwrap();
                    println!("Registered input device {} {}", path, fd);
                } else {
                    error!("Failed to create MtDev for {}", path);
                }
                i += 1;
            } else {
                break;
            }
        }

        let mut context = TouchInputContext::new(xmin, ymin);

        loop {
            poll.poll(&mut mio_events, None).unwrap();

            for mio_event in mio_events.iter() {
                let num: usize = mio_event.token().into();
                process_events(&mut inputs[num].1, &mut context, &sender);
            }
        }
    });
}
