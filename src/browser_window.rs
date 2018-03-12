/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//! A Browser Window implementation, backed by a native gonk window.

use egl;
use events_loop::Event;
use gleam::gl::Gl;
use gonk_gfx::window::Window;
use servo::compositing::compositor_thread::EventLoopWaker;
use servo::compositing::windowing::WindowMethods;
use servo::euclid::{Point2D, Size2D, TypedPoint2D, TypedRect, TypedScale, TypedSize2D};
use servo::ipc_channel::ipc::IpcSender;
use servo::msg::constellation_msg::{Key, KeyModifiers, TopLevelBrowsingContextId};
use servo::net_traits::net_error_list::NetError;
use servo::script_traits::LoadData;
use servo::servo_geometry::DeviceIndependentPixel;
use servo::servo_url::ServoUrl;
use servo::style_traits::cursor::CursorKind;
use servo::webrender_api::DevicePixel;
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
    /// Returns the size of the window in hardware pixels.
    fn framebuffer_size(&self) -> TypedSize2D<u32, DevicePixel> {
        info!(
            "framebuffer_size {}x{}",
            self.native_window.width, self.native_window.height
        );
        TypedSize2D::new(
            self.native_window.width as u32,
            self.native_window.height as u32,
        )
    }

    fn window_rect(&self) -> TypedRect<u32, DevicePixel> {
        info!("window_rect");
        TypedRect::new(
            TypedPoint2D::new(0, 0),
            TypedSize2D::new(
                self.native_window.width as u32,
                self.native_window.height as u32,
            ),
        )
    }

    /// Returns the size of the window in density-independent "px" units.
    fn size(&self) -> TypedSize2D<f32, DeviceIndependentPixel> {
        info!("size");
        TypedSize2D::new(
            self.native_window.width as f32,
            self.native_window.height as f32,
        )
    }

    fn screen_size(&self, _ctx: TopLevelBrowsingContextId) -> Size2D<u32> {
        info!("screen_size");
        Size2D::new(
            self.native_window.width as u32,
            self.native_window.height as u32,
        )
    }

    fn screen_avail_size(&self, _ctx: TopLevelBrowsingContextId) -> Size2D<u32> {
        info!("screen_avail_size");
        Size2D::new(
            self.native_window.width as u32,
            self.native_window.height as u32,
        )
    }

    fn set_fullscreen_state(&self, _ctx: TopLevelBrowsingContextId, _state: bool) {
        info!("set_fullscreen_state");
    }

    fn client_window(&self, _ctx: TopLevelBrowsingContextId) -> (Size2D<u32>, Point2D<i32>) {
        info!("client_window");
        let width = self.native_window.width as u32;
        let height = self.native_window.height as u32;
        (Size2D::new(width, height), Point2D::zero())
    }

    fn set_inner_size(&self, _ctx: TopLevelBrowsingContextId, _: Size2D<u32>) {
        info!("set_inner_size");
    }

    fn set_position(&self, _ctx: TopLevelBrowsingContextId, _: Point2D<i32>) {
        info!("set_position");
    }

    fn allow_navigation(
        &self,
        _ctx: TopLevelBrowsingContextId,
        _url: ServoUrl,
        _: IpcSender<bool>,
    ) {
        info!("allow_navigation");
    }

    fn history_changed(&self, _ctx: TopLevelBrowsingContextId, _: Vec<LoadData>, _: usize) {
        info!("history_changed");
    }

    fn gl(&self) -> Rc<Gl> {
        info!("gl");
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

    fn set_page_title(&self, _id: TopLevelBrowsingContextId, _title: Option<String>) {
        info!("set_page_title");
    }

    fn status(&self, _id: TopLevelBrowsingContextId, _msg: Option<String>) {
        info!("status");
    }

    fn load_start(&self, _id: TopLevelBrowsingContextId) {
        info!("load_start");
    }

    fn load_end(&self, _id: TopLevelBrowsingContextId) {
        info!("load_end");
    }

    fn load_error(&self, _id: TopLevelBrowsingContextId, _code: NetError, _url: String) {
        info!("load_error");
    }

    fn head_parsed(&self, _id: TopLevelBrowsingContextId) {
        info!("load_parsed");
    }

    fn hidpi_factor(&self) -> TypedScale<f32, DeviceIndependentPixel, DevicePixel> {
        info!("hidpi_factor");
        // TODO: adjust based on the display's dpi.
        TypedScale::new(1.0)
    }

    fn handle_key(
        &self,
        _id: Option<TopLevelBrowsingContextId>,
        _: Option<char>,
        _: Key,
        _: KeyModifiers,
    ) {
        info!("handle_key");
    }

    fn set_cursor(&self, _: CursorKind) {
        info!("set_cursor");
    }

    fn set_favicon(&self, _id: TopLevelBrowsingContextId, _: ServoUrl) {
        info!("set_favicon");
    }

    fn prepare_for_composite(&self, _width: usize, _height: usize) -> bool {
        debug!("prepare_for_composite");
        true
    }

    fn supports_clipboard(&self) -> bool {
        info!("supports_clipboard");
        false
    }

    fn handle_panic(
        &self,
        _id: TopLevelBrowsingContextId,
        _reason: String,
        _backtrace: Option<String>,
    ) {
        info!("handle_panic");
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
