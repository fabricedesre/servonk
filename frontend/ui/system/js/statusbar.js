class StatusBar extends HTMLElement {
    constructor() {
        super();

        // TODO: use a default favicon.
        this.default_favicon = "";
    }

    connectedCallback() {
        console.log("Adding status bar");
        this.render = hyperHTML.bind(this);
        this.title = "Servonk";
        this.favicon = this.default_favicon;
        this.timer = setInterval(this.update.bind(this), 1000);
        this.active_frame = null;

        let title_change = (event) => {
            this.set_title(event.detail.title);
        }

        let favicon_change = (event) => {
            this.set_favicon(event.detail.url);
        }

        Utils.add_event_listener("set-active-frame", (message) => {
            // console.log(`set-active-frame`);
            if (this.active_frame) {
                this.active_frame.removeEventListener("title-change", title_change);
                this.active_frame.removeEventListener("favicon-change", favicon_change);
            }
            this.active_frame = message.frame;
            this.active_frame.addEventListener("title-change", title_change);
            this.active_frame.addEventListener("favicon-change", favicon_change);
            // console.log(`Active frame set to ${this.active_frame.title} ${this.active_frame.favicon}`);
            this.title = this.active_frame.title;
            this.favicon = this.active_frame.favicon;
            this.update();
        });

        this.update();
        this.querySelector(".title").addEventListener("click", () => {
            Utils.dispatch_event("open-search", { content: this.active_frame.src, target: this.active_frame });
        });
    }

    disconnectedCallback() {
        console.log("Removing status bar");
        clearInterval(this.timer);
    }

    set_title(new_title) {
        this.title = new_title;
        this.update();
    }

    set_favicon(url) {
        this.favicon = url;
        this.update();
    }

    update() {
        // console.log(`Update to ${this.title} ${this.favicon}`);

        // Servo's toLocaleTimeString() is HH:MM:SS and we don't want the seconds.
        this.render`
            <div class="favicon"><img src=${this.favicon}></div>
            <div class="title">${this.title}</div>
            <div>${new Date().toLocaleTimeString().substr(0, 5)}</div>`;
    }
}

customElements.define("status-bar", StatusBar);