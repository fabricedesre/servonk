class StatusBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("Adding status bar");
        this.render = hyperHTML.bind(this);
        this.title = "Servonk";
        this.timer = setInterval(this.update.bind(this), 1000);
        this.active_frame = null;

        let title_change = (event) => {
            this.set_title(event.detail.title);
        }

        MessageRouter.add_listener("set-active-frame", (message) => {
            let frame = message.frame;
            console.log(`statusbar change active frame to ${frame.getAttribute("id")}`);
            if (this.active_frame) {
                this.active_frame.removeEventListener("title-change", title_change);
            }
            this.active_frame = frame;
            this.active_frame.addEventListener("title-change", title_change);
            this.set_title(this.active_frame.title);
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

    update() {
        // Servo's toLocaleTimeString() is HH:MM:SS and we don't want the seconds.
        this.render`
            <div class="title">${this.title}</div>
            <div>${new Date().toLocaleTimeString().substr(0, 5)}</div>`
    }
}

customElements.define("status-bar", StatusBar);