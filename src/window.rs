/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//! A windowing implementation using Gonk interfaces.

use servo::compositing::windowing::{WindowEvent, WindowMethods};
use egl::{self, EGLContext, EGLDisplay, EGLSurface};
use servo::euclid::{Point2D, ScaleFactor, Size2D, TypedPoint2D, TypedRect, TypedSize2D};
use gleam::gl::{self, Gl};
use servo::webrender_api::DevicePixel;
use servo::msg::constellation_msg::{Key, KeyModifiers, TopLevelBrowsingContextId};
use servo::net_traits::net_error_list::NetError;
use std::ffi::CString;
use std::mem::transmute;
use std::ptr;
use std::rc::Rc;
use std::sync::mpsc::{channel, Receiver, Sender};
use servo::style_traits::cursor::Cursor;
use servo::servo_url::ServoUrl;
use servo::servo_geometry::DeviceIndependentPixel;
use servo::compositing::compositor_thread::EventLoopWaker;
use servo::ipc_channel::ipc::IpcSender;
use servo::script_traits::LoadData;
use gonk_gfx::*;

/// The type of a window.
pub struct Window {
    event_recv: Receiver<WindowEvent>,
    pub event_send: Sender<WindowEvent>,
    width: u32,
    height: u32,
    native_window: *mut GonkNativeWindow,
    dpy: EGLDisplay,
    ctx: EGLContext,
    surf: EGLSurface,
    gl: Rc<Gl>,
    waker: Box<EventLoopWaker>,
}

impl Window {
    /// Creates a new window.
    pub fn new() -> Rc<Window> {
        let mut hwc_mod = ptr::null();
        unsafe {
            let cstr = CString::new("hwcomposer").unwrap();
            let ret = hw_get_module(cstr.as_ptr(), &mut hwc_mod);
            assert!(ret == 0, "Failed to get HWC module!");
        }

        let hwc_device: *mut hwc_composer_device;
        unsafe {
            let mut device = ptr::null();
            let cstr = CString::new("composer").unwrap();
            let ret = ((*(*hwc_mod).methods).open)(hwc_mod, cstr.as_ptr(), &mut device);
            assert!(ret == 0, "Failed to get HWC device!");
            hwc_device = transmute(device);
            // Require HWC 1.1 or newer
            // XXX add HAL version function/macro
            assert!((*hwc_device).common.version > (1 << 8), "HWC too old!");
        }

        let attrs: [u32; 4] = [
            HWC_DISPLAY_WIDTH,
            HWC_DISPLAY_HEIGHT,
            HWC_DISPLAY_DPI_X,
            HWC_DISPLAY_NO_ATTRIBUTE,
        ];
        let mut values: [i32; 4] = [0, 0, 0, 0];
        unsafe {
            // In theory, we should check the return code.
            // However, there are HALs which implement this wrong.
            let _ = ((*hwc_device).get_display_attributes)(
                hwc_device,
                0,
                0,
                attrs.as_ptr(),
                values.as_mut_ptr(),
            );
        }

        let mut gralloc_mod = ptr::null();
        let alloc_dev: *mut alloc_device;
        unsafe {
            let mut device = ptr::null();
            let cstr = CString::new("gralloc").unwrap();
            let ret1 = hw_get_module(cstr.as_ptr(), &mut gralloc_mod);
            assert!(ret1 == 0, "Failed to get gralloc moudle!");
            let cstr2 = CString::new("gpu0").unwrap();
            let ret2 = ((*(*gralloc_mod).methods).open)(gralloc_mod, cstr2.as_ptr(), &mut device);
            assert!(ret2 == 0, "Failed to get gralloc moudle!");
            alloc_dev = transmute(device);
        }

        let width = values[0];
        let height = values[1];
        let dpy = egl::get_display(egl::EGL_DEFAULT_DISPLAY).unwrap();

        let ret = {
            let mut major: i32 = 0;
            let mut minor: i32 = 0;
            egl::initialize(dpy, &mut major, &mut minor)
        };

        assert!(ret, "Failed to initialize EGL!");

        let conf_attr = [
            egl::EGL_SURFACE_TYPE,
            egl::EGL_WINDOW_BIT,
            egl::EGL_RENDERABLE_TYPE,
            egl::EGL_OPENGL_ES2_BIT,
            egl::EGL_RED_SIZE,
            8,
            egl::EGL_GREEN_SIZE,
            8,
            egl::EGL_BLUE_SIZE,
            8,
            egl::EGL_ALPHA_SIZE,
            0,
            egl::EGL_NONE,
            0,
        ];

        let config = egl::choose_config(dpy, &conf_attr, 1);

        assert!(config.is_some(), "Failed to choose a config");
        let config = config.unwrap();

        let usage = GRALLOC_USAGE_HW_FB | GRALLOC_USAGE_HW_RENDER | GRALLOC_USAGE_HW_COMPOSER;
        let native_window = GonkNativeWindow::new(alloc_dev, hwc_device, width, height, usage);
        let eglwindow = unsafe {
            egl::create_window_surface(dpy, config, transmute(native_window), &[])
        }.unwrap();

        let ctx_attr = [egl::EGL_CONTEXT_CLIENT_VERSION, 2, egl::EGL_NONE, 0];

        let ctx =
            unsafe { egl::create_context(dpy, config, transmute(egl::EGL_NO_CONTEXT), &ctx_attr) };

        assert!(ctx.is_some(), "Failed to create a context!");
        let ctx = ctx.unwrap();

        unsafe {
            autosuspend_disable();
            ((*hwc_device).blank)(hwc_device, 0, 0);
        }

        let ret = egl::make_current(dpy, eglwindow, eglwindow, ctx);

        assert!(ret, "Failed to make current!");

        unsafe {
            autosuspend_disable();
            ((*hwc_device).blank)(hwc_device, 0, 0);
        }

        let gl = unsafe { gl::GlFns::load_with(|s| egl::get_proc_address(s) as *const _) };

        gl.clear_color(1f32, 1f32, 1f32, 1f32);
        gl.clear(gl::COLOR_BUFFER_BIT);

        egl::swap_buffers(dpy, eglwindow);

        let (tx, rx) = channel();

        // Create our window object.
        let window = Window {
            event_recv: rx,
            event_send: tx,
            width: width as u32,
            height: height as u32,
            native_window: native_window,
            dpy: dpy,
            ctx: ctx,
            surf: eglwindow,
            gl: gl,
            waker: Box::new(GonkEventLoopWaker {}),
        };

        Rc::new(window)
    }

    pub fn wait_events(&self) -> Vec<WindowEvent> {
        vec![self.event_recv.recv().unwrap()]
    }
}

impl Drop for Window {
    fn drop(&mut self) {
        unsafe {
            ((*self.native_window).window.common.dec_ref)(&mut (*self.native_window).window.common);
        }
    }
}

impl WindowMethods for Window {
    /// Returns the size of the window in hardware pixels.
    fn framebuffer_size(&self) -> TypedSize2D<u32, DevicePixel> {
        TypedSize2D::new(self.width as u32, self.height as u32)
    }

    fn window_rect(&self) -> TypedRect<u32, DevicePixel> {
        TypedRect::new(
            TypedPoint2D::new(0, 0),
            TypedSize2D::new(self.width as u32, self.height as u32),
        )
    }

    /// Returns the size of the window in density-independent "px" units.
    fn size(&self) -> TypedSize2D<f32, DeviceIndependentPixel> {
        TypedSize2D::new(self.width as f32, self.height as f32)
    }

    fn screen_size(&self, _ctx: TopLevelBrowsingContextId) -> Size2D<u32> {
        Size2D::new(self.width, self.height)
    }

    fn screen_avail_size(&self, _ctx: TopLevelBrowsingContextId) -> Size2D<u32> {
        Size2D::new(self.width, self.height)
    }

    fn set_fullscreen_state(&self, _ctx: TopLevelBrowsingContextId, _state: bool) {}

    fn client_window(&self, _ctx: TopLevelBrowsingContextId) -> (Size2D<u32>, Point2D<i32>) {
        let width = self.width as u32;
        let height = self.height as u32;
        (Size2D::new(width, height), Point2D::zero())
    }

    fn set_inner_size(&self, _ctx: TopLevelBrowsingContextId, _: Size2D<u32>) {}

    fn set_position(&self, _ctx: TopLevelBrowsingContextId, _: Point2D<i32>) {}

    fn allow_navigation(
        &self,
        _ctx: TopLevelBrowsingContextId,
        _url: ServoUrl,
        _: IpcSender<bool>,
    ) {

    }

    fn history_changed(&self, _ctx: TopLevelBrowsingContextId, _: Vec<LoadData>, _: usize) {}

    fn gl(&self) -> Rc<Gl> {
        self.gl.clone()
    }

    fn create_event_loop_waker(&self) -> Box<EventLoopWaker> {
        self.waker.clone()
    }

    /// Presents the window to the screen (perhaps by page flipping).
    fn present(&self) {
        let _ = egl::swap_buffers(self.dpy, self.surf);
    }

    fn set_page_title(&self, _id: TopLevelBrowsingContextId, _: Option<String>) {}

    fn status(&self, _id: TopLevelBrowsingContextId, _: Option<String>) {}

    fn load_start(&self, _id: TopLevelBrowsingContextId) {}

    fn load_end(&self, _id: TopLevelBrowsingContextId) {}

    fn load_error(&self, _id: TopLevelBrowsingContextId, _: NetError, _: String) {}

    fn head_parsed(&self, _id: TopLevelBrowsingContextId) {}

    fn hidpi_factor(&self) -> ScaleFactor<f32, DeviceIndependentPixel, DevicePixel> {
        ScaleFactor::new(1.0)
    }

    fn handle_key(
        &self,
        _id: Option<TopLevelBrowsingContextId>,
        _: Option<char>,
        _: Key,
        _: KeyModifiers,
    ) {
    }

    fn set_cursor(&self, _: Cursor) {}

    fn set_favicon(&self, _id: TopLevelBrowsingContextId, _: ServoUrl) {}

    fn prepare_for_composite(&self, _width: usize, _height: usize) -> bool {
        true
    }

    fn supports_clipboard(&self) -> bool {
        true
    }
}

pub struct GonkEventLoopWaker {
    // pub proxy: Arc<glutin::EventsLoopProxy>
}

impl EventLoopWaker for GonkEventLoopWaker {
    // Use by servo to share the "event loop waker" across threads
    fn clone(&self) -> Box<EventLoopWaker + Send> {
        Box::new(GonkEventLoopWaker { /*proxy: self.proxy.clone()*/ })
    }
    // Called by servo when the main thread needs to wake up
    fn wake(&self) {
        // self.proxy.wakeup().expect("wakeup eventloop failed");
    }
}

// struct GonkCompositorProxy {
//     sender: Sender<compositor_thread::Msg>,
//     event_sender: Sender<WindowEvent>,
// }

// impl CompositorProxy for GonkCompositorProxy {
//     fn send(&self, msg: compositor_thread::Msg) {
//         // Send a message and kick the OS event loop awake.
//         self.sender.send(msg).ok().unwrap();
//         self.event_sender.send(WindowEvent::Idle).ok().unwrap();
//     }
//     fn clone_compositor_proxy(&self) -> Box<CompositorProxy + Send> {
//         Box::new(GonkCompositorProxy {
//             sender: self.sender.clone(),
//             event_sender: self.event_sender.clone(),
//         }) as Box<CompositorProxy + Send>
//     }
// }
