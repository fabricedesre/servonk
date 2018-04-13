class NavBar extends HTMLElement {
    constructor() {
        super();
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

        this.menu.addEventListener("click", () => {
            let w_m = document.getElementById("windows");
            w_m.toggle_expose();
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
        let can_go_back = this.frame_state.can_go_back ? "back" : "back disabled";
        let can_go_forward = this.frame_state.can_go_forward ? "forward" : "forward disabled";
        let loading = this.frame_state.loading ? "refresh spin" : "refresh";
        
        this.render`
    <div class="nav-left">
        <img class="notifs" src="assets/icons/notification-gray-36.png">
    </div>
    <div class="nav-center">
        <img class="menu" src="assets/icons/menu-gray-36.png">
    </div>
    <div class="nav-right">
        <img class=${can_go_back} src="assets/icons/go-back-48.png">
        <img class=${can_go_forward} src="assets/icons/go-forward-48.png">
        <img class=${loading} src="assets/icons/refresh-48.png">
    </div>
     `;
    }
}

customElements.define("nav-bar", NavBar);