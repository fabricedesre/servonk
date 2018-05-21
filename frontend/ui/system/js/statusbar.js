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
        this.favicon_url = this.default_favicon;
        this.timer = setInterval(this.update.bind(this), 1000);
        this.active_frame = null;

        let title_change = (event) => {
            this.set_title(event.detail.title);
        }

        let favicon_change = (event) => {
            this.set_favicon(event.detail.url);
        }

        Utils.add_event_listener("set-active-frame", (message) => {
            if (this.active_frame) {
                this.active_frame.removeEventListener("title-change", title_change);
                this.active_frame.removeEventListener("favicon-change", favicon_change);
            }
            this.active_frame = message.frame;
            this.active_frame.addEventListener("title-change", title_change);
            this.active_frame.addEventListener("favicon-change", favicon_change);
            this.set_title(this.active_frame.title);
            this.set_favicon(this.default_favicon);
        });

        this.update();
        this.querySelector(".title").addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("open-search", { detail: { content: this.active_frame.src, target: this.active_frame } }));
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
        this.favicon_url = url;
        this.update();
    }

    update() {
        // Servo's toLocaleTimeString() is HH:MM:SS and we don't want the seconds.
        this.render`
            <div class="favicon"><img src=${this.favicon_url}></div>
            <div class="title">${this.title}</div>
            <div>${new Date().toLocaleTimeString().substr(0, 5)}</div>`
    }
}

customElements.define("status-bar", StatusBar);