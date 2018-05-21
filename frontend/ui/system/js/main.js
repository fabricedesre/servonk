
// TODO: replace by a proper signal from the Servo side.
window.addEventListener("idle", (event) => {
    let idle = event.detail.idle;
    console.log(`Changing idle state to: ${idle}`);
    let lockscreen = document.getElementById("lock-screen");

    if (idle) {
        lockscreen.lock();
        // TODO: turn off the screen properly.
        document.body.style.opacity = 0;
    } else if (lockscreen.is_locked()) {
        // When  leaving the idle state with the screen locked, turn on the screen.
        // TODO: turn on the screen properly;
        document.body.style.opacity = 1;
    }
});
// Set the idle delay to 30s.
Utils.add_idle_event(window, 30000);

// Guards to check when we are ready to create the initial web views.
let dom_ready = false;
let embedding_ready = false;

document.addEventListener("DOMContentLoaded", () => {
    // Bind the backspace key to some action.
    // document.addEventListener("keydown", (event) => {
    //     console.log(`Keydown event: ${event.key}`);
    //     if (event.key == "Backspace") {
    //         document.getElementById("lock-screen").toggle_lock();
    //     }
    // });

    dom_ready = true;
    init_window_manager();
});

window.onmessage = (e) => {
    console.log(`window.onmessage: received ${e.data}`);
}

function init_window_manager() {
    // Only really start when all stars are aligned.
    if (!dom_ready || !embedding_ready) {
        return;
    }

    let window_manager = document.getElementById("windows");

    window_manager.add_frame("/homescreen/index.html", { closable: false });
    // window_manager.add_frame("https://duckduckgo.com");
    // window_manager.add_frame("https://wikipedia.org");
    // window_manager.add_frame("https://google.com");
    // window_manager.add_frame("https://www.google.com/");
    window_manager.set_pos(0);
}

// WebSocket based embedding API.
let EmbeddingApi = {
    init() {
        console.log(`EmbeddingApi::init`);
        this.connect();
    },

    connect() {
        this.ws = new WebSocket("ws://localhost:8000/api/v1/");

        console.log(`EmbeddingApi ws is ${this.ws}`);

        // On device we may get stuck waiting for the response :(
        // Until we figure out how to wait for the ws server to be fully
        // ready, hack around.
        window.setTimeout(() => {
            if (embedding_ready) {
                return;
            }
            this.ws.close();
            this.ws = null;
            this.connect.bind(this);
        }, 1000);

        this.ws.onopen = () => {
            console.log(`EmbeddingApi websocket open`);

            Utils.add_event_listener("ws-message", (msg) => {
                let json = JSON.stringify(msg);
                console.log(`Sending ${json}`);
                this.ws.send(json);
            });
            embedding_ready = true;
            init_window_manager();
        }

        this.ws.onmessage = (e) => {
            // console.log(`EmbeddingApi message ${e.data}`);
            let msg = JSON.parse(e.data);

            // Only process the messages targeted to the system app.
            if (msg.service !== "to_system_app") {
                return;
            }

            // Dispatch webview messages keyed on the webview id.
            if (msg.webview_id) {
                Utils.dispatch_event(`webview-${msg.webview_id}`, msg);
            }
        }

        this.ws.onerror = (e) => {
            console.log(`EmbeddingApi error ${e}`);
            // Try to reconnect every second.
            window.setTimeout(this.connect.bind(this), 1000);
        }

        this.ws.onclose = (e) => {
            console.log(`EmbeddingApi closing websocket ${e}`);
        }
    }
}

EmbeddingApi.init();
