class VirtualKeyboard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('Adding keyboard');
        this.render = hyperHTML.bind(this);
        this.update();
        this.hide();
    }

    show() {
        console.log("VirtualKeyboard::show");
        // this.style.display = this.display_style;
        document.getElementById("keyboard-frame").classList.remove("offscreen");
    }

    hide() {
        // this.display_style = this.style.display;
        console.log(`VirtualKeyboard::hide ${this.display_style}`);
        // this.style.display = "none";
        document.getElementById("keyboard-frame").classList.add("offscreen");
    }

    update() {
        this.render`
            <iframe id="keyboard-frame" scrolling="no" src="/keyboard/index.html"></iframe>
        `;
    }
}

customElements.define("virtual-keyboard", VirtualKeyboard);