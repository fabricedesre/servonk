// The window manager.

// The top-level component, which manages switching from a full-screen frame
// to another, and the exposé/carrousel display.
class WindowManager extends HTMLElement {
    constructor() {
        super();
        // The set of full size frames. This array contains the ids of the frames,
        // not the DOM elements.
        this.frames = [];
        this.pos = 0;
        this.wm_id = 0;
        this.expose = false;

        this.calc_dimensions();

        console.log(`Full frame size is ${this.width}x${this.height}`);

        window.addEventListener("resize", () => {
            this.calc_dimensions();
            this.remove_overlays();
            this.update_expose();
        });
    }

    calc_dimensions() {
        let statusbar_height = getComputedStyle(document.body).getPropertyValue("--statusbar-height")
            .trim().split("px")[0];
        let navbar_height = getComputedStyle(document.body).getPropertyValue("--navbar-height")
            .trim().split("px")[0];

        this.width = window.innerWidth;
        this.height = window.innerHeight - statusbar_height - navbar_height;
    }

    state() {
        return { size: this.frames.length, pos: this.pos };
    }

    current_frame() {
        return this.querySelector(`#${this.frames[this.pos]}`);
    }

    set_pos(new_pos) {
        if (this.expose) {
            return;
        }

        // Desactivate the previous active frame.
        this.current_frame().set_active(false);

        this.pos = new_pos;

        // Clamp the pos values in [0..frames.length - 1]
        if (this.pos < 0) {
            this.pos = 0;
        }
        if (this.pos >= this.frames.length) {
            this.pos = this.frames.length - 1;
        }

        // Activate the new active frame.
        let active_frame = this.current_frame();
        active_frame.set_active(true);
        MessageRouter.dispatch({ name: "set-active-frame", frame: active_frame });

        this.setAttribute("style", `transform: translateX(${- this.pos * this.width}px);`);
    }

    select_frame(id) {
        let index = this.frames.indexOf(id);
        if (index === -1) {
            return;
        }
        if (this.expose) {
            this.toggle_expose();
        }
        this.set_pos(index);
    }

    add_frame(src, options_arg) {
        console.log(`WindowManager::add_frame : ${src}`);

        let options = options_arg || { closable: true };

        // We manage the DOM manually when adding frames since hyper recreates existing siblings when
        // we add new ones.
        let frame = document.createElement("web-view");
        let wm_id_s = `wm_frame_${this.wm_id}`;
        let style = `transform: translateX(${this.width * this.frames.length}px)`
        frame.setAttribute("style", style);
        frame.setAttribute("id", wm_id_s);
        frame.setAttribute("closable", !!options.closable);
        frame.setAttribute("src", src);
        this.appendChild(frame);
        frame.set_active(true);

        this.frames.push(wm_id_s);

        this.wm_id = this.wm_id + 1;

        console.log(`WindowManager::add_frame : Added frame ${wm_id_s}`);

        return wm_id_s;
    }

    is_in_expose() {
        return this.expose;
    }
    
    enter_expose() {
        if (!this.expose) {
            this.toggle_expose();
        }
    }

    exit_expose() {
        if (this.expose) {
            this.toggle_expose();
        }
    }

    toggle_expose() {
        this.expose = !this.expose;
        this.update_expose();
    }

    remove_overlays() {
        let frame = this.firstElementChild;
        while (frame) {
            let next = frame.nextElementSibling;
            if (frame.localName === "frame-overlay") {
                this.removeChild(frame);
            }
            frame = next;
        }
    }

    update_expose() {
        if (!this.expose) {
            // Reposition all frames in order.
            let frame = this.firstElementChild;
            let i = 0;
            while (frame) {
                // Remove overlay frames.
                if (frame.localName === "frame-overlay") {
                    let next = frame.nextElementSibling;
                    this.removeChild(frame);
                    frame = next;
                    continue;
                }

                // Re-position the web views.
                if (frame.localName === "web-view") {
                    let style = `transform: translateX(${this.width * i}px)`
                    frame.setAttribute("style", style);
                    frame.classList.remove("exposed");
                    i = i + 1;
                }

                frame = frame.nextElementSibling;
            }
            // Go back to the frame that was in view.
            this.setAttribute("style", `transform: translateX(-${this.pos * this.width}px);`);
        } else {
            // Reset the container to not being translated.
            this.removeAttribute("style");

            // The number of rows and columns we use to layout the frames.
            let grid_size = Math.ceil(Math.sqrt(this.frames.length));
            let frame = this.firstElementChild;
            let x = 0;
            let y = 0;
            let delta = 0;
            // If the last row is empty or if we have only one row, shift the content down to center it.
            if ((grid_size * (grid_size - 1) > this.frames.length) || (grid_size == this.frames.length)) {
                delta = this.height / 2;
            }

            while (frame) {
                // We only transform web views, and add the overlay at the same time.
                if (frame.localName !== "web-view") {
                    frame = frame.nextElementSibling;
                    continue;
                }

                let style = `transform: scale(${1.0 / grid_size})
                translateX(${- this.width * (grid_size - 1) / 2 + x * this.width}px)
                translateY(${- this.height * (grid_size - 1) / 2 + y * this.height}px)
                scale(0.8) translateY(${delta}px)`;

                // console.log(`${frame.localName} x=${x} y=${y} style=${style}`);
                frame.setAttribute("style", style);
                frame.classList.add("exposed");

                // Create the overlay to display the frame title and buttons.
                let overlay = document.createElement("frame-overlay");
                overlay.setAttribute("title", frame.title);
                frame.addEventListener("title-change", (event) => {
                    overlay.title = event.detail.title;
                    overlay.update();
                });
                style = style + `; font-size: ${28 * grid_size}px`;
                overlay.setAttribute("style", style);
                overlay.setAttribute("wm_id", frame.getAttribute("id"));
                overlay.setAttribute("closable", frame.getAttribute("closable"));
                overlay.setAttribute("scale", grid_size);
                this.appendChild(overlay);

                frame = frame.nextElementSibling;
                x = x + 1;
                if (x == grid_size) {
                    x = 0;
                    y = y + 1;
                }
            }
        }
    }

    close_frame(id) {
        // Remove the frame from the DOM.
        let node = this.querySelector(`#${id}`);
        if (node) {
            this.removeChild(node);
        }

        // Update our frame list.
        let index = this.frames.indexOf(id);
        if (index != -1) {
            this.frames.splice(index, 1);
        } else {
            console.error(`Could not find this frame id: ${id}`);
        }

        // Remove all the overlays before updating the expose view.
        this.remove_overlays();

        // Update the expose view.
        this.update_expose();

        // Ensure that if we removed the last frame while it was active,
        // we still select a valid frame.
        if (this.pos >= this.frames.length) {
            this.pos = this.frames.length - 1;
            let active_frame = this.current_frame();
            active_frame.set_active(true);
            MessageRouter.dispatch({ name: "set-active-frame", frame: active_frame });
        }
    }

    on_drag_start() {
        // Don't drag in expose view.
        if (this.expose) {
            return;
        }

        // Disable transition on transform to better follow the dragging move.
        this.classList.add("dragging");
    }

    on_drag_move(delta) {
        // Don't drag in expose view.
        if (this.expose) {
            return;
        }

        this.setAttribute("style", `transform: translateX(${delta - this.pos * this.width}px);`);
    }

    on_drag_end(delta) {
        // Don't drag in expose view.
        if (this.expose) {
            return;
        }

        this.classList.remove("dragging");

        // If we moved more than half width, change frame.
        let abs = Math.abs(delta);
        let has_moved_enough = abs > (this.width / 2);

        if (delta < 0 && has_moved_enough) {
            this.set_pos(this.pos + 1);
        } else if (delta > 0 && has_moved_enough) {
            this.set_pos(this.pos - 1);
        } else {
            // Reset the position we had before starting to follow the drag.
            this.set_pos(this.pos);
        }
    }
}

// A FrameOverlay is used when in expose mode to display the
// frame title and closing control if needed.
// Tapping on the overlay selects the frame as current.
class FrameOverlay extends HTMLElement {
    constructor() {
        super();
    }

    get_attr_values() {
        this.title = this.getAttribute("title");
        this.wm_id = this.getAttribute("wm_id");
        this.scale = this.getAttribute("scale");
        this.closable = this.getAttribute("closable") == "true";
    }
    connectedCallback() {
        this.get_attr_values();
        this.render = hyperHTML.bind(this);
        this.addEventListener("click", this.onclick.bind(this));
        this.update();
    }

    attributeChangedCallback(name, old_value, new_value) {
        this.get_attr_values();
        this.update();
    }

    onclick(event) {
        let target = event.target;
        console.log(`Click event on ${target.localName} ${target.getAttribute("class")}`);

        if (target.classList.contains("close-button")) {
            // Close this frame.
            this.parentElement.close_frame(this.wm_id);
        } else if (target.classList.contains("frame-overlay")) {
            this.parentElement.select_frame(this.wm_id);
        }
    }

    update() {
        let size = 48 * this.scale;
        let style = `font-size:${size}px`;
        if (!this.closable) {
            style = style + "; display: none";
        }

        this.render`
        <div class="frame-overlay">
            <div class="filler"> </div>
            <div class="overlay-title">
              <div class="filler">${this.title}</div>
              <i class="close-button far fa-times-circle" style=${style}></i>
            </div>
        </div>
        `;
    }
}

// The DragPanel is used to swipe from one app to the other from
// the edges of the screen.
class DragPanel extends HTMLElement {
    constructor() {
        super();
        this.active = false;
        this.start = 0;
        this.current = 0;
    }

    connectedCallback() {
        this.addEventListener("touchstart", (event) => {
            event.preventDefault();
            this.on_start(event);
        });
        this.addEventListener("mousedown", this.on_start.bind(this));

        this.addEventListener("touchmove", this.on_move.bind(this));
        this.addEventListener("mousemove", this.on_move.bind(this));

        this.addEventListener("touchend", this.on_end.bind(this));
        this.addEventListener("mouseup", this.on_end.bind(this));
    }

    get_wm() {
        if (!this._wm) {
            this._wm = document.getElementById("windows");
        }
        return this._wm;
    }

    get_xpos(event) {
        if (event instanceof MouseEvent) {
            return event.clientX;
        } else if (event instanceof TouchEvent) {
            // Check if our tracked touch id has changed.
            let changes = event.changedTouches;
            for (let i = 0; i < changes.length; i++) {
                let item = changes.item(i);
                if (item.identifier == this.touch_id) {
                    return item.clientX;
                }
            }
        }
    }

    on_start(event) {
        console.log(`DragPanel::on_start ${event}`);
        this.active = true;
        if (this.classList.contains("left")) {
            this.start = 0;
        } else {
            this.start = window.innerWidth;
        }
        this.current = this.start;
        this.classList.add("wide");

        // Check if it's a touch event to track the right touch id.
        if (event instanceof TouchEvent) {
            this.touch_id = event.changedTouches.item(0).identifier;
        }

        // Notify the window manager that we start a drag.
        this.get_wm().on_drag_start();
    }

    on_move(event) {
        if (!this.active) {
            return;
        }
        this.current = this.get_xpos(event);

        // Notify the window manager that we are moving.
        this.get_wm().on_drag_move(this.current - this.start);
    }

    on_end(event) {
        console.log("DragPanel::on_end");
        if (!this.active) {
            return;
        }
        this.active = false;
        this.classList.remove("wide");
        this.current = this.get_xpos(event);

        // Notify the window manager that we stopped dragging.
        this.get_wm().on_drag_end(this.current - this.start);
    }
}

customElements.define("drag-panel", DragPanel);
customElements.define("window-manager", WindowManager);
customElements.define("frame-overlay", FrameOverlay);
