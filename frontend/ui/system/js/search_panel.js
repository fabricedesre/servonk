
class SearchSuggestionFetcher {
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

    cancel() {
        this.token += 1;
    }

    do_fetch(value) {
        // console.log(`Search request for ${value}`);
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

class TopSitesFetcher {
    constructor(max_results, callback) {
        this.json = [];

        this.callback = callback;
        this.max_results = max_results;
        this.load_data();
    }

    load_data() {
        let url = "/shared/top-10k.json";
        fetch(url).then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw "Failed to get suggestions";
            }
        }).then(json => {
            console.log(`Top sites loaded: ${json.length} entries.`);
            this.json = json;
        }).catch(e => {
            console.error(`Failed to load top sites: ${e}`);
        });
    }

    // TODO: dispatch that to a worker instead.
    update(value) {
        if (value.length < 3) {
            return;
        }

        let start = Date.now();
        let res = [];
        value = value.toLowerCase();

        // console.log(`Looking for top site matching ${value}`);

        for (let i = 0; i < this.json.length; i++) {
            if (this.json[i].indexOf(value) !== -1) {
                res.push(`https://${this.json[i]}`);
                if (res.length == this.max_results) {
                    break;
                }
            }
        }

        let elapsed = Date.now() - start;
        console.log(`Found ${res.length} top sites matching ${value} in ${elapsed}ms`);
        this.callback(res);
    }

    cancel() {

    }
}

class SearchPanel extends HTMLElement {
    constructor() {
        super();

        this.content = "";
        this.search_suggestions = [];
        this.sites_suggestions = [];
        this.opened = false;
        this.search_suggester = new SearchSuggestionFetcher(200, this.update_search_suggestions.bind(this));
        this.sites_suggester = new TopSitesFetcher(5, this.update_sites_suggestions.bind(this));
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

    update_search_suggestions(value) {
        this.search_suggestions = value;
        this.update();
    }

    update_sites_suggestions(value) {
        this.sites_suggestions = value;
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
            this.search_suggester.cancel();
            this.sites_suggester.cancel();
            this.update_search_suggestions([]);
            this.update_sites_suggestions([]);
            return;
        }

        if (event.key == "Enter") {
            this.go_to(input);
        } else {
            // update the list of suggestions.
            this.search_suggester.update(input);
            this.sites_suggester.update(input);
        }
    }

    update() {
        this.render`
        <div>
            <ul class="search-results" onclick=${this}>
                ${this.search_suggestions.map(value => `<li><i class="fas fa-search"></i> ${value}</li>`)}
                ${this.sites_suggestions.map(value => `<li><i class="fas fa-globe"></i> ${value}</li>`)}
            </ul>
            <input type="text" value=${this.content} onkeyup=${this}>
        </div>
        `;
    }

    close() {
        console.log("Close search panel");
        this.classList.remove("open");
        this.content = "";
        this.update();
        this.opened = false;
    }

    open(initial_content) {
        console.log("Open search panel");
        this.content = initial_content;
        this.update();
        this.classList.add("open");
        this.opened = true;
        window.setTimeout(() => {
            this.querySelector("input").focus();
        }, 0);
    }

    is_open() {
        return this.opened;
    }
}

customElements.define("search-panel", SearchPanel);