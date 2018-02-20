/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use errno::errno;
use events_loop::Event;
use libc::{c_int, c_long, time_t};
use mio::*;
use mio::unix::EventedFd;
use servo::compositing::windowing::{MouseWindowEvent, WindowEvent};
use servo::euclid::{TypedPoint2D, TypedVector2D};
use servo::msg::constellation_msg::{Key, KeyModifiers, KeyState};
use servo::script_traits::{MouseButton, TouchEventType};
use servo::webrender_api::ScrollLocation;
use std::fs::File;
use std::io::Read;
use std::mem::{size_of, transmute, zeroed};
use std::os::unix::io::AsRawFd;
use std::path::Path;
use std::sync::mpsc::Sender;
use std::thread;

// extern "C" {
//     // XXX: no variadic form in std libs?
//     fn ioctl(fd: c_int, req: c_int, ...) -> c_int;
// }

#[derive(Debug)]
#[repr(C)]
struct linux_input_event {
    sec: time_t,
    msec: c_long,
    evt_type: u16,
    code: u16,
    value: i32,
}

// #[repr(C)]
// struct linux_input_absinfo {
//     value: i32,
//     minimum: i32,
//     maximum: i32,
//     fuzz: i32,
//     flat: i32,
//     resolution: i32,
// }

// const IOC_NONE: c_int = 0;
// const IOC_WRITE: c_int = 1;
// const IOC_READ: c_int = 2;

// fn ioc(dir: c_int, ioctype: c_int, nr: c_int, size: c_int) -> c_int {
//     dir << 30 | size << 16 | ioctype << 8 | nr
// }

// #define EVIOCGABS(abs) _IOR('E', 0x40 + (abs), struct input_absinfo)
// fn ev_ioc_g_abs(abs: u16) -> c_int {
//     ioc(
//         IOC_READ,
//         'E' as c_int,
//         (0x40 + abs) as i32,
//         size_of::<linux_input_absinfo>() as i32,
//     )
// }

const EV_SYN: u16 = 0;
const EV_KEY: u16 = 1;
const EV_ABS: u16 = 3;

const EV_REPORT: u16 = 0;

const ABS_MT_SLOT: u16 = 0x2F;
const ABS_MT_TOUCH_MAJOR: u16 = 0x30;
const ABS_MT_TOUCH_MINOR: u16 = 0x31;
const ABS_MT_WIDTH_MAJOR: u16 = 0x32;
const ABS_MT_WIDTH_MINOR: u16 = 0x33;
const ABS_MT_ORIENTATION: u16 = 0x34;
const ABS_MT_POSITION_X: u16 = 0x35;
const ABS_MT_POSITION_Y: u16 = 0x36;
const ABS_MT_TRACKING_ID: u16 = 0x39;

struct InputSlot {
    tracking_id: i32,
    x: i32,
    y: i32,
}

impl Default for InputSlot {
    fn default() -> Self {
        InputSlot {
            tracking_id: -1,
            x: 0,
            y: 0,
        }
    }
}

#[derive(Default)]
struct TouchInputContext {
    slots: [InputSlot; 10],
    last_x: i32,
    last_y: i32,
    first_x: i32,
    first_y: i32,
    last_dist: f32,
    touch_count: i32,
    current_slot: usize,
    tracking_updated: bool,
    screen_dist: f32,
}

impl TouchInputContext {
    pub fn new(width: i32, height: i32) -> Self {
        TouchInputContext {
            screen_dist: dist(0, width, 0, height),
            tracking_updated: false,
            ..Default::default()
        }
    }
}

fn dist(x1: i32, x2: i32, y1: i32, y2: i32) -> f32 {
    let delta_x = (x2 - x1) as f32;
    let delta_y = (y2 - y1) as f32;
    (delta_x * delta_x + delta_y * delta_y).sqrt()
}

// fn read_input_device(device_path: &Path, sender: &Sender<Event>) {
//     let mut device = match File::open(device_path) {
//         Ok(dev) => dev,
//         Err(e) => {
//             println!("Couldn't open device! {}", e);
//             return;
//         }
//     };
//     let fd = device.as_raw_fd();

//     let mut x_info: linux_input_absinfo = unsafe { zeroed() };
//     let mut y_info: linux_input_absinfo = unsafe { zeroed() };
//     unsafe {
//         let ret = ioctl(fd, ev_ioc_g_abs(ABS_MT_POSITION_X), &mut x_info);
//         if ret < 0 {
//             println!("Couldn't get ABS_MT_POSITION_X info {} {}", ret, errno());
//         }
//     }
//     unsafe {
//         let ret = ioctl(fd, ev_ioc_g_abs(ABS_MT_POSITION_Y), &mut y_info);
//         if ret < 0 {
//             println!("Couldn't get ABS_MT_POSITION_Y info {} {}", ret, errno());
//         }
//     }
// }

fn process_touch_event(
    event: &linux_input_event,
    context: &mut TouchInputContext,
    sender: &Sender<Event>,
) {
    match (event.evt_type, event.code) {
        (EV_SYN, EV_REPORT) => {
            let slot_a = &context.slots[0];
            if context.tracking_updated {
                context.tracking_updated = false;
                if slot_a.tracking_id == -1 {
                    println!("Touch up");
                    let delta_x = slot_a.x - context.first_x;
                    let delta_y = slot_a.y - context.first_y;
                    let dist = delta_x * delta_x + delta_y * delta_y;
                    if dist < 16 {
                        let click_pt = TypedPoint2D::new(slot_a.x as f32, slot_a.y as f32);
                        println!("Dispatching click!");
                        sender
                            .send(Event::WindowEvent(WindowEvent::MouseWindowEventClass(
                                MouseWindowEvent::MouseDown(MouseButton::Left, click_pt),
                            )))
                            .ok()
                            .unwrap();
                        sender
                            .send(Event::WindowEvent(WindowEvent::MouseWindowEventClass(
                                MouseWindowEvent::MouseUp(MouseButton::Left, click_pt),
                            )))
                            .ok()
                            .unwrap();
                        sender
                            .send(Event::WindowEvent(WindowEvent::MouseWindowEventClass(
                                MouseWindowEvent::Click(MouseButton::Left, click_pt),
                            )))
                            .ok()
                            .unwrap();
                    }
                } else {
                    println!("Touch down");
                    context.last_x = slot_a.x;
                    context.last_y = slot_a.y;
                    context.first_x = slot_a.x;
                    context.first_y = slot_a.y;
                    if context.touch_count >= 2 {
                        let slot_b = &context.slots[1];
                        context.last_dist = dist(slot_a.x, slot_b.x, slot_a.y, slot_b.y);
                    }
                }
            } else {
                println!("Touch move x: {}, y: {}", slot_a.x, slot_a.y);
                sender
                    .send(Event::WindowEvent(WindowEvent::Scroll(
                        ScrollLocation::Delta(TypedVector2D::new(
                            (slot_a.x - context.last_x) as f32,
                            (slot_a.y - context.last_y) as f32,
                        )),
                        TypedPoint2D::new(slot_a.x, slot_a.y),
                        TouchEventType::Move,
                    )))
                    .ok()
                    .unwrap();
                context.last_x = slot_a.x;
                context.last_y = slot_a.y;
                if context.touch_count >= 2 {
                    let slot_b = &context.slots[1];
                    let cur_dist = dist(slot_a.x, slot_b.x, slot_a.y, slot_b.y);
                    println!(
                        "Zooming {} {} {} {}",
                        cur_dist,
                        context.last_dist,
                        context.screen_dist,
                        ((context.screen_dist + (cur_dist - context.last_dist))
                            / context.screen_dist)
                    );
                    sender
                        .send(Event::WindowEvent(WindowEvent::Zoom(
                            (context.screen_dist + (cur_dist - context.last_dist))
                                / context.screen_dist,
                        )))
                        .ok()
                        .unwrap();
                    context.last_dist = cur_dist;
                }
            }
        }
        (EV_SYN, _) => error!("Unknown SYN code {}", event.code),
        (EV_ABS, ABS_MT_SLOT) => if (event.value as usize) < context.slots.len() {
            context.current_slot = event.value as usize;
        } else {
            error!("Invalid slot! {}", event.value);
        },
        (EV_ABS, ABS_MT_TOUCH_MAJOR) => (),
        (EV_ABS, ABS_MT_TOUCH_MINOR) => (),
        (EV_ABS, ABS_MT_WIDTH_MAJOR) => (),
        (EV_ABS, ABS_MT_WIDTH_MINOR) => (),
        (EV_ABS, ABS_MT_ORIENTATION) => (),
        (EV_ABS, ABS_MT_POSITION_X) => {
            context.slots[context.current_slot].x = event.value - 0; // x_info.minimum;
        }
        (EV_ABS, ABS_MT_POSITION_Y) => {
            context.slots[context.current_slot].y = event.value - 0; // y_info.minimum;
        }
        (EV_ABS, ABS_MT_TRACKING_ID) => {
            let current_id = context.slots[context.current_slot].tracking_id;
            if current_id != event.value && (current_id == -1 || event.value == -1) {
                context.tracking_updated = true;
                if event.value == -1 {
                    context.touch_count -= 1;
                } else {
                    context.touch_count += 1;
                }
            }
            context.slots[context.current_slot].tracking_id = event.value;
        }
        (EV_ABS, _) => error!("Unknown ABS code {}", event.code),
        (_, _) => error!("Unknown event: type={} code={}", event.evt_type, event.code),
    }
}

fn process_key_event(event: &linux_input_event, sender: &Sender<Event>) {
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
            error!("Unknown key: {} 0x{:x}", event.code, event.code);
            return;
        }
    };

    let event = WindowEvent::KeyEvent(None, key, key_state, KeyModifiers::empty());
    sender.send(Event::WindowEvent(event)).ok().unwrap();
}

fn process_events(device: &mut File, context: &mut TouchInputContext, sender: &Sender<Event>) {
    let mut buf: [u8; (16 * size_of::<linux_input_event>())] = unsafe { zeroed() };

    let read = match device.read(&mut buf) {
        Ok(count) => {
            assert!(
                count % size_of::<linux_input_event>() == 0,
                "Unexpected input device read length!"
            );
            count
        }
        Err(e) => {
            error!("Couldn't read device {:?} : {}", device, e);
            return;
        }
    };

    let count = read / size_of::<linux_input_event>();
    let events: *mut linux_input_event = unsafe { transmute(buf.as_mut_ptr()) };
    for idx in 0..(count as isize) {
        let event: &linux_input_event = unsafe { transmute(events.offset(idx)) };
        if event.evt_type == EV_KEY {
            process_key_event(event, sender);
        } else {
            process_touch_event(event, context, sender);
        }
    }
}

const DEV_INPUT_EVENT_COUNT: usize = 3;

pub fn run_input_loop(width: i32, height: i32, event_sender: &Sender<Event>) {
    let sender = event_sender.clone();
    thread::spawn(move || {
        let poll = Poll::new().unwrap();
        let mut mio_events = Events::with_capacity(1024);

        // Register input devices with the mio event loop.
        let mut inputs: Vec<File> = Vec::new();
        for i in 0..DEV_INPUT_EVENT_COUNT {
            let path = format!("/dev/input/event{}", i);
            if let Ok(file) = File::open(Path::new(&path)) {
                let fd = file.as_raw_fd();
                inputs.push(file);
                poll.register(
                    &EventedFd(&fd),
                    Token(i),
                    Ready::readable(),
                    PollOpt::edge(),
                ).unwrap();
                info!("Registered input device {}", path);
            }
        }

        let mut context = TouchInputContext::new(width, height);

        loop {
            poll.poll(&mut mio_events, None).unwrap();

            for mio_event in mio_events.iter() {
                let num: usize = mio_event.token().into();
                process_events(&mut inputs[num], &mut context, &sender);
            }
        }
    });
}
