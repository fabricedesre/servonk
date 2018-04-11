let __web_view_id = 0;

class WebView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('Adding WebView');

        this.title = "";
        this.render = hyperHTML.bind(this);
        this.src = this.getAttribute("src");
        this.update();
        this.frame = this.firstElementChild;
        this.active = false;

        let webview_id = this.frame.getAttribute("webviewid");
        // console.log(`webview id is ${webview_id}`);
        MessageRouter.add_listener(`webview-${webview_id}`, this.on_webview_event.bind(this));
    }

    set_active(val) {
        console.log(`Changing "${this.title}" active status to ${val}`);
        this.active = val;
        let event = new CustomEvent("active-state-change", { detail: { active: val }});
        this.dispatchEvent(event);
    }

    active() {
        return this.active;
    }

    on_webview_event(message) {
        let msg = message.data;
        
        if (msg.type === "change_page_title") {
            this.title = msg.title;
            let event = new CustomEvent("title-change", { detail: { title: msg.title }});
            this.dispatchEvent(event);
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