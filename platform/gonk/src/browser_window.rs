/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//! A Browser Window implementation, backed by a native gonk window.

use egl;
use events_loop::Event;
use gleam::gl::Gl;
use gonk_gfx::window::Window;
use servo::compositing::compositor_thread::EventLoopWaker;
use servo::compositing::windowing::{AnimationState, EmbedderCoordinates, WindowMethods};
use servo::euclid::{Length, TypedPoint2D, TypedRect, TypedScale, TypedSize2D};
use servo::webrender_api::{DeviceIntPoint, DevicePixel, DeviceUintSize};
use std::rc::Rc;
use std::sync::mpsc::Sender;

/// The type of a window.
pub struct BrowserWindow {
    native_window: Rc<Window>,
    waker: Box<EventLoopWaker>,
}

impl BrowserWindow {
    /// Creates a new window.
    pub fn new(event_sender: &Sender<Event>) -> Rc<BrowserWindow> {
        let native_window = Window::new();
        native_window.fill_color(0.0, 1.0, 1.0, 1.0);

        Rc::new(BrowserWindow {
            native_window: native_window,
            waker: Box::new(GonkEventLoopWaker::new(event_sender)),
        })
    }

    /// Returns the (width, height) of the window.
    pub fn info(&self) -> (i32, i32, i32) {
        (
            self.native_window.width,
            self.native_window.height,
            self.native_window.dpi,
        )
    }
}

impl WindowMethods for BrowserWindow {
    fn get_coordinates(&self) -> EmbedderCoordinates {
        let width = self.native_window.width as u32;
        let height = self.native_window.height as u32;

        EmbedderCoordinates {
            hidpi_factor: TypedScale::new(1.0), // TODO: adjust based on the display's dpi.
            screen: DeviceUintSize::new(width, height),
            screen_avail: DeviceUintSize::new(width, height),
            window: (DeviceUintSize::new(width, height), DeviceIntPoint::zero()),
            framebuffer: DeviceUintSize::new(width, height),
            viewport: TypedRect::new(TypedPoint2D::new(0, 0), TypedSize2D::new(width, height)),
        }
    }

    fn gl(&self) -> Rc<Gl> {
        debug!("gl");
        self.native_window.gl.clone()
    }

    fn create_event_loop_waker(&self) -> Box<EventLoopWaker> {
        info!("create_event_loop_waker");
        self.waker.clone()
    }

    /// Presents the window to the screen (perhaps by page flipping).
    fn present(&self) {
        debug!("present");
        let _ = egl::swap_buffers(self.native_window.dpy, self.native_window.surf);
    }

    fn prepare_for_composite(
        &self,
        _width: Length<u32, DevicePixel>,
        _height: Length<u32, DevicePixel>,
    ) -> bool {
        debug!("prepare_for_composite");
        true
    }

    fn supports_clipboard(&self) -> bool {
        debug!("supports_clipboard");
        false
    }

    fn set_animation_state(&self, state: AnimationState) {
        debug!("set_animation_state {:?}", state);
    }
}

pub struct GonkEventLoopWaker {
    sender: Sender<Event>,
}

impl GonkEventLoopWaker {
    pub fn new(sender: &Sender<Event>) -> GonkEventLoopWaker {
        GonkEventLoopWaker {
            sender: sender.clone(),
        }
    }
}

impl EventLoopWaker for GonkEventLoopWaker {
    // Use by servo to share the "event loop waker" across threads
    fn clone(&self) -> Box<EventLoopWaker + Send> {
        debug!("EventLoopWaker::clone");
        Box::new(GonkEventLoopWaker::new(&self.sender.clone()))
    }
    // Called by servo when the main thread needs to wake up
    fn wake(&self) {
        debug!("EventLoopWaker::wake");
        self.sender.send(Event::WakeUpEvent).ok().unwrap();
    }
}
