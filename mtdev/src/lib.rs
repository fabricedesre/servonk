/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

extern crate libc;

#[allow(non_camel_case_types)]
mod generated;

use generated::ffi::*;
use libc::{fcntl, F_GETFL, F_SETFL, O_NONBLOCK};
use std::os::raw::c_int;
use std::os::unix::io::RawFd;
use std::ptr::null_mut;

pub use generated::ffi::input_event;

/// Safe wrapper around a mtdev

const ABS_MT_POSITION_X: i32 = 0x35;
const ABS_MT_POSITION_Y: i32 = 0x36;

pub struct MtDev {
    mtdev: *mut mtdev,
    fd: RawFd,
}

impl MtDev {
    /// Creates a new mtdev manager if possible.
    pub fn new(fd: RawFd) -> Option<Self> {
        let dev = unsafe {
            // Set the fd to non blocking mode so that mtdev will not
            // block on the full event buffer.
            let flags = fcntl(fd, F_GETFL, 0);
            fcntl(fd, F_SETFL, flags | O_NONBLOCK);

            mtdev_new_open(fd)
        };
        if dev != null_mut() {
            return Some(MtDev { mtdev: dev, fd });
        }
        None
    }

    /// Returns events if they are available.
    pub fn get_events(&mut self) -> Result<Vec<input_event>, ()> {
        let mut events: [input_event; 16] = unsafe { ::std::mem::zeroed() };
        let res = unsafe { mtdev_get(self.mtdev, self.fd, events.as_mut_ptr(), 16) };
        if res < 0 {
            Err(())
        } else {
            Ok(events[0..(res as usize)].to_vec())
        }
    }

    /// Returns the (xmin, ymin) abs_info if available.
    pub fn xmin_ymin(&self) -> Option<(c_int, c_int)> {
        unsafe {
            if mtdev_has_mt_event(self.mtdev, ABS_MT_POSITION_X) == 0
                || mtdev_has_mt_event(self.mtdev, ABS_MT_POSITION_Y) == 0
            {
                None
            } else {
                Some((
                    mtdev_get_abs_minimum(self.mtdev, ABS_MT_POSITION_X),
                    mtdev_get_abs_minimum(self.mtdev, ABS_MT_POSITION_Y),
                ))
            }
        }
    }
}

impl Drop for MtDev {
    fn drop(&mut self) {
        unsafe {
            mtdev_close_delete(self.mtdev);
        }
    }
}
