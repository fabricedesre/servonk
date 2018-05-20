class NavBar extends HTMLElement {
    constructor() {
        super();
        this.MENU_LONG_PRESS_DELAY = 500; // ms
    }

    connectedCallback() {
        console.log('Adding nav bar');
        this.render = hyperHTML.bind(this);
        this.active_frame = null;
        this.frame_state = {
            loading: false,
            can_go_back: false,
            can_go_forward: false
        };

        let dup = this.cloneNode();

        this.update();

        ["menu", "notifs", "back", "forward", "refresh"].forEach(e => {
            this[e] = this.querySelector(`.${e}`);
        });

        this.refresh.addEventListener("click", () => {
            if (!this.active_frame) {
                console.error("Can't reload: no active frame.");
                return;
            }

            let message = {
                name: "ws-message",
                data: {
                    service: "from_system_app",
                    type: "reload",
                    webview_id: this.active_frame.frame.getAttribute("webviewid")
                }
            };
            MessageRouter.dispatch(message);
        });

        this.back.addEventListener("click", () => {
            if (!this.active_frame) {
                console.error("Can't go back: no active frame.");
                return;
            }

            if (!this.frame_state.can_go_back) {
                return;
            }

            let message = {
                name: "ws-message",
                data: {
                    service: "from_system_app",
                    type: "navigate",
                    webview_id: this.active_frame.frame.getAttribute("webviewid"),
                    direction: { back: 1 }
                }
            };
            MessageRouter.dispatch(message);
        });

        this.forward.addEventListener("click", () => {
            if (!this.active_frame) {
                console.error("Can't go forward: no active frame.");
                return;
            }

            if (!this.frame_state.can_go_forward) {
                return;
            }

            let message = {
                name: "ws-message",
                data: {
                    service: "from_system_app",
                    type: "navigate",
                    webview_id: this.active_frame.frame.getAttribute("webviewid"),
                    direction: { forward: 1 }
                }
            };
            MessageRouter.dispatch(message);
        });

        // this.notifs.addEventListener("click", () => {
        //     console.log("ZZZ Clicked on notifications");
        //     let w_m = document.getElementById("windows");
        //     let {size, pos} = w_m.state();
        //     console.log(`ZZZ state: size=${size} pos=${pos}`)
        //     let npos = (pos + 1) % size;
        //     console.log("ZZZ Moving to pos " + npos);
        //     w_m.set_pos(npos);
        // });

        Utils.add_longpress_event(this.menu, this.MENU_LONG_PRESS_DELAY);
        this.menu.addEventListener("longpress", () => {
            let w_m = document.getElementById("windows");
            w_m.enter_expose();
        });

        Utils.add_timed_click_event(this.menu);
        this.menu.addEventListener("timedclick", (event) => {
            if (event.detail.delay > this.MENU_LONG_PRESS_DELAY) {
                return;
            }

            let w_m = document.getElementById("windows");

            if (w_m.is_in_expose()) {
                // When in expose mode, return to normal view.
                w_m.exit_expose();
            } else {
                // When in normal view, open or close the search panel.
                let spanel = document.getElementById("search");
                if (spanel.is_open()) {
                    window.dispatchEvent(new CustomEvent("close-search"));
                } else {
                    window.dispatchEvent(new CustomEvent("open-search"));
                }
            }
        });

        let state_change = (event) => {
            this.frame_state = event.detail;
            this.update();
        }

        MessageRouter.add_listener("set-active-frame", (message) => {
            if (this.active_frame) {
                this.active_frame.removeEventListener("state-change", state_change);
            }
            this.active_frame = message.frame;
            this.active_frame.addEventListener("state-change", state_change);
            this.frame_state = this.active_frame.state();
            this.update();
        });
    }

    disconnectedCallback() {
        console.log('Removing nav bar');
    }

    update() {
        let can_go_back = "back fa-fw fas fa-arrow-alt-circle-left";
        if (!this.frame_state.can_go_back) {
            can_go_back += " disabled";
        }
        let can_go_forward = "forward fa-fw fas fa-arrow-alt-circle-right";
        if (!this.frame_state.can_go_forward) {
            can_go_forward += " disabled";
        }
        let loading = "refresh fa-fw fas fa-sync-alt";
        if (this.frame_state.loading) {
            // Disable spinning animation until https://github.com/servo/servo/issues/20731 is fixed.
            // loading += " fa-spin";
        }
        
        this.render`
    <div class="nav-left">
        <i class="notifs fas fa-bell"></i>
    </div>
    <div class="nav-center">
        <i class="menu fas fa-dot-circle"></i>
    </div>
    <div class="nav-right">
        <i class=${can_go_back}></i>
        <i class=${can_go_forward}></i>
        <i class=${loading}></i>
    </div>
     `;
    }
}

customElements.define("nav-bar", NavBar);