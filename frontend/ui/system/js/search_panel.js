
class SuggestionFetcher {
    constructor(delay, callback) {
        this.delay = delay;
        this.callback = callback;
        // The token value is incremented at each request and is
        // used to drop previous requests that take too long.
        // TODO: implement abortable fetch() in Servo instead.
        this.token = 0;
        this.timer = null;
    }

    // Ask to update results for a new value.
    // Will wait for `delay` ms to start or overrides an
    // already running request.
    update(value) {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(() => {
            this.token += 1;
            this.do_fetch(value);
        }, this.delay);
    }

    do_fetch(value) {
        console.log(`Search request for ${value}`);
        let expected = this.token;
        // TODO: don't hardcode Google as the search engine.
        let url = `https://www.google.com/complete/search?client=firefox&q=${encodeURIComponent(value)}`;

        fetch(url, { mode: "no-cors" }).then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw "Failed to get suggestions";
            }
        }).then(json => {
            if (expected == this.token) {
                this.callback(json[1] || []);
            }
        }).catch(e => {
            console.error(e);
            if (expected == this.token) {
                this.callback([]);
            }
        });
    }
}

class SearchPanel extends HTMLElement {
    constructor() {
        super();

        this.content = "";
        this.suggestions = [];
        this.opened = false;
        this.suggester = new SuggestionFetcher(200, this.update_suggestions.bind(this));
    }

    connectedCallback() {
        console.log("Adding search panel");
        this.render = hyperHTML.bind(this);
        this.update();

        window.addEventListener("open-search", event => {
            let content = (event.detail && event.detail.content) || "";
            this.target = (event.detail && event.detail.target) || null;
            this.open(content);
        });

        window.addEventListener("close-search", event => {
            this.close();
        });
    }

    go_to(text_or_url) {
        let url = Utils.fixup_url(text_or_url);
        this.close();
        if (this.target) {
            this.target.setAttribute("src", url);
        } else {
            let window_manager = document.getElementById("windows");
            let frame_id = window_manager.add_frame(url);
            window_manager.select_frame(frame_id);
        }
    }

    update_suggestions(value) {
        this.suggestions = value;
        this.update();
    }

    handleEvent(event) {
        if (event.type == "click" && event.target.localName == "li") {
            // We clicked on a suggestion.
            this.go_to(event.target.textContent);
            return;
        }

        let input = event.target.value.trim();
        if (input.length == 0) {
            this.update_suggestions([]);
            return;
        }

        if (event.key == "Enter") {
            this.go_to(input);
        } else {
            // update the list of suggestions.
            this.suggester.update(input);
        }
    }

    update() {
        this.render`
        <div>
            <ul class="search-results" onclick=${this}>
                ${this.suggestions.map(value => `<li>${value}</li>`)}
            </ul>
            <input type="text" value=${this.content} onkeyup=${this}>
        </div>
        `;
    }

    close() {
        console.log("Close search panel");
        this.classList.remove("open");
        this.content = "";
        this.opened = false;
    }

    open(initial_content) {
        console.log("Open search panel");
        this.content = initial_content;
        this.update();
        this.classList.add("open");
        this.opened = true;
    }

    is_open() {
        return this.opened;
    }
}

customElements.define("search-panel", SearchPanel);