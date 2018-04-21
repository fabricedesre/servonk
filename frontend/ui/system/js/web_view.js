let __web_view_id = 0;

class WebView extends HTMLElement {
    static get observedAttributes() { return ["src"]; }

    constructor() {
        super();
        this.render = hyperHTML.bind(this);
    }

    connectedCallback() {
        console.log('Adding WebView');

        this.title = "";
        this.src = this.getAttribute("src");
        this.update();
        this.frame = this.firstElementChild;
        this.active = false;
        this.loading = false;
        this.can_go_back = false;
        this.can_go_forward = false;

        let webview_id = this.frame.getAttribute("webviewid");
        // console.log(`webview id is ${webview_id}`);
        MessageRouter.add_listener(`webview-${webview_id}`, this.on_webview_event.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log(`attributeChangedCallback ${name} ${newValue}`);
        if (name === "src") {
            this.src = newValue;
            this.update();
        }
    }

    set_active(val) {
        // console.log(`Changing "${this.title}" active status to ${val}`);
        this.active = val;
        let event = new CustomEvent("active-state-change", { detail: { active: val } });
        this.dispatchEvent(event);
    }

    state() {
        return {
            loading: this.loading,
            can_go_back: this.can_go_back,
            can_go_forward: this.can_go_forward
        }
    }

    active() {
        return this.active;
    }

    dispatch_state() {
        let event = new CustomEvent("state-change", {
            detail: {
                loading: this.loading,
                can_go_back: this.can_go_back,
                can_go_forward: this.can_go_forward
            }
        });
        this.dispatchEvent(event);
    }

    on_webview_event(message) {
        let msg = message.data;

        if (msg.type === "change_page_title") {
            this.title = msg.title;
            let event = new CustomEvent("title-change", { detail: { title: msg.title } });
            this.dispatchEvent(event);
        } else if (msg.type === "progress") {
            if (msg.event === "load_complete") {
                this.loading = false;
                this.dispatch_state();
            } else if (msg.event === "load_start") {
                this.loading = true;
                this.dispatch_state();
            }
        } else if (msg.type === "history_changed") {
            this.can_go_back = msg.current !== 0;
            this.can_go_forward = msg.current + 1 !== msg.urls.length;
            this.dispatch_state();
            this.update();
        }
    }

    update() {
        // Local apps urls start with / : keep a transparent background
        // for them.
        let style = "";
        if (!this.src.startsWith("/")) {
            style = "background-color: white";
        }

        this.render`
        <iframe src="${this.src}" style="${style}" webview></iframe>
        `;
    }
}

customElements.define("web-view", WebView);