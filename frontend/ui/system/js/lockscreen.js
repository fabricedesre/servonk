class LockScreen extends HTMLElement {
    constructor() {
        super();

        this.expected = "4242";
        this.input = "";
        this.display = "";
        this.locked = true;

        // Support both touch and mouse.
        this.addEventListener("touchstart", (event) => {
            event.preventDefault();
            this.process_click_or_touch(event);
        });
        this.addEventListener("mousedown", this.process_click_or_touch.bind(this));

        // document.addEventListener("keydown", (event) => {
        //     let content = "";
        //     if (event.key == "Backspace") {
        //         content = "back";
        //     } else if (event.key == "Enter") {
        //         content = "ok";
        //     } else if ("0123456789".indexOf(event.key) != -1) {
        //         content = event.key;
        //     }

        //     if (content !== "") {
        //         this.process_input(content);
        //     }
        // });

        window.addEventListener("inactive", () => {
            this.lock();
        });
    }

    process_input(content) {
        switch (content) {
            case "back":
                this.input = this.input.slice(0, -1);
                this.display = this.display.slice(0, -1);
                break;
            case "ok":
                if (this.input == this.expected) {
                    this.unlock();
                } else {
                    // Turn the display field to red in case of error.
                    this.classList.add("error");
                    window.setTimeout(() => {
                        this.classList.remove("error");
                    }, 500);
                }
                this.input = "";
                this.display = "";
                this.update();
                break;
            default:
                if (this.input.length == 4) {
                    return;
                }
                this.input = this.input + content;
                this.display = this.display + content;
                // Replace the last digit by a * after 300ms.
                window.setTimeout(() => {
                    this.display = this.display.slice(0, -1) + '*';
                    this.update();
                }, 300);
                break;
        }
        this.update();
    }

    process_click_or_touch(event) {
        let target = event.target;

        if (target.localName != "span" || !target.hasAttribute("data")) {
            return;
        }

        let content = target.getAttribute("data");

        // :active is not properly supported yet (see https://github.com/servo/servo/issues/20284)
        // so we do it with a class and a timeout :(
        target.classList.add("active");
        window.setTimeout(() => {
            target.classList.remove("active");
        }, 300);

        this.process_input(content);
    }

    update() {
        this.render`
        <div class="filler"></div>
        <div class="lock-keyboard">
          <div class="lock-row">
            <span class="flex2 empty">${this.display}</span><span data="back" class="keyboard">⌫</span>
          </div>
          <div class="lock-row">
            <span data="1">1</span><span data="2">2</span><span data="3">3</span>
          </div>
          <div class="lock-row">
            <span data="4">4</span><span data="5">5</span><span data="6">6</span>
          </div>
          <div class="lock-row">
            <span data="7">7</span><span data="8">8</span><span data="9">9</span>
          </div>
          <div class="lock-row">
            <span class="empty">&nbsp;</span><span data="0">0</span><span data="ok" class="keyboard">↵</span>
          </div>
        </div>
        `;
    }

    connectedCallback() {
        console.log('Adding lockscreen');
        this.render = hyperHTML.bind(this);
        this.update();
    }

    toggle_lock() {
        if (this.locked) {
            this.unlock();
        } else {
            this.lock();
        }
    }

    unlock() {
        console.log("Unlocking...");
        this.locked = false;
        this.classList.add("offscreen");
        window.dispatchEvent(new CustomEvent("lockscreen-unlocked"));
        console.log("Unlocked!");
    }

    lock() {
        console.log("Locking...");
        this.locked = true;
        this.classList.remove("offscreen");
        window.dispatchEvent(new CustomEvent("lockscreen-locked"));
        console.log("Locked!");
    }
}

customElements.define("lock-screen", LockScreen);