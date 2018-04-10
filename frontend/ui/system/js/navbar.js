class NavBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('Adding nav bar');
        this.render = hyperHTML.bind(this);
        this.update();

        ["menu", "notifs", "back", "forward", "stop", "refresh"].forEach(e => {
            this[e] = this.querySelector(`.${e}`);
        });

        MessageRouter.add_listener("page-load-start", (message) => {
            // console.log(`message: ${JSON.stringify(message)}`)
            this.refresh.classList.add("spin");
        });

        MessageRouter.add_listener("page-load-end", (message) => {
            // console.log(`message: ${JSON.stringify(message)}`)
            this.refresh.classList.remove("spin");
        });

        this.refresh.addEventListener("click", () => {
            let message = {
                name: "refresh-active-page",
                forced: false
            };
            MessageRouter.dispatch(message)
        });

        this.back.addEventListener("click", () => {
            let message = {
                name: "history-back"
            };
            MessageRouter.dispatch(message)
        });

        this.forward.addEventListener("click", () => {
            let message = {
                name: "history-forward"
            };
            MessageRouter.dispatch(message)
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
    }

    disconnectedCallback() {
        console.log('Removing nav bar');
    }

    update() {
        this.render`
    <div class="nav-left">
        <img class="notifs" src="assets/icons/notification-gray-36.png">
    </div>
    <div class="nav-center">
        <img class="menu" src="assets/icons/menu-gray-36.png">
    </div>
    <div class="nav-right">
        <img class="back" src="assets/icons/go-back-48.png">
        <img class="forward" src="assets/icons/go-forward-48.png">
        <img class="stop" src="assets/icons/stop-48.png">
        <img class="refresh" src="assets/icons/refresh-48.png">
    </div>
     `;
    }
}

customElements.define("nav-bar", NavBar);