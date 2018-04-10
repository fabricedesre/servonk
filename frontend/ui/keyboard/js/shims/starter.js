'use strict';

(function (exports) {

    var KeyboardAppStarter = function () {
        this._started = false;
    };

    // Since the app scripts are dynamic injected, Ctrl+F5 will not clean it up.
    // We therefore employ cache busting here by replacing the native appendChild
    // methods under <head> and <body>.
    // This hash is the Gaia commit hash included in submodule.
    KeyboardAppStarter.prototype.CACHE_BUSTING_HASH = '5b90c09';

    KeyboardAppStarter.prototype.start = function () {
        window.history.replaceState(null, '', window.location.hash.substr(1));

        this._getIndexHTMLContent()
            .then(this._prepareDOM.bind(this))
            .catch(function (e) { console.error(e); });

        window.addEventListener('message', this);

        this._startAPI();
        this._replaceAppendChild();
    };

    KeyboardAppStarter.prototype._startAPI = function () {
        navigator.mozSettings = new NavigatorMozSettings();
        navigator.mozSettings.start();

        navigator.mozInputMethod = new InputMethod();
        navigator.mozInputMethod.start();

        window.resizeTo = function (width, height) {
            window.parent.postMessage({
                api: 'resizeTo',
                args: [width, height]
            }, '*');
        };

        if (!window.AudioContext && window.webkitAudioContext) {
            var cachedAudioContextInstance;
            // WebKit throws when we do |new AudioContext('system')|.
            // It must called with 0 arguments.
            window.AudioContext = function AudioContext() {
                if (!cachedAudioContextInstance) {
                    cachedAudioContextInstance = new window.webkitAudioContext();
                }
                return cachedAudioContextInstance;
            };
        }

        if (!window.OfflineAudioContext && window.webkitOfflineAudioContext) {
            window.OfflineAudioContext = window.webkitOfflineAudioContext;
        } else if (!window.OfflineAudioContext) {
            window.OfflineAudioContext = window.AudioContext;
        }

        if (!('vibrate' in navigator)) {
            navigator.vibrate = function () { };
        };

        if (!('performance' in window)) {
            window.performance = {
                timing: {
                },
                now: function () { }
            };
        }

        // if (!('flex' in document.body.style) &&
        //     ('webkitFlex' in document.body.style)) {
        //     Object.defineProperty(CSSStyleDeclaration.prototype, 'flex', {
        //         get: function () {
        //             return this.webkitFlex;
        //         },
        //         set: function (val) {
        //             return (this.webkitFlex = val);
        //         }
        //     })
        // }

        // if (!exports.WeakMap) {
        //     exports.WeakMap = exports.Map;
        // } else if (navigator.userAgent.indexOf('Safari') !== -1) {
        //     // Workarounds broken WeakMap implementation in JavaScriptCode
        //     // See https://bugs.webkit.org/show_bug.cgi?id=137651
        //     var weakMapPrototypeSet = exports.WeakMap.prototype.set;
        //     exports.WeakMap.prototype.set = function (key, val) {
        //         if (key instanceof HTMLElement) {
        //             key.webkitWeakMapWorkaround = 1;
        //         }
        //         weakMapPrototypeSet.call(this, key, val);
        //     };
        // }
    };

    KeyboardAppStarter.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'api') {
            return;
        }

        switch (data.method) {
            case 'updateHash':
                window.location.replace('#' + data.result);

                break;
        }
    };

    KeyboardAppStarter.prototype._replaceAppendChild = function () {
        var nativeAppendChild = document.body.appendChild;
        var app = this;

        document.body.appendChild =
            document.documentElement.firstElementChild.appendChild = function (node) {
                var url;

                switch (node.nodeName) {
                    case 'SCRIPT':
                        // Reject l10n.js request --
                        // it doesn't work without running build script
                        if (/l10n\.js$/.test(node.src)) {
                            return;
                        }

                        url = node.src.replace(/apps\/keyboard\/shared/, 'shared');

                        node.src = url; // + '?_=' + app.CACHE_BUSTING_HASH;
                        break;

                    case 'LINK':
                        // Redirect shared CSS
                        url = node.href.replace(/apps\/keyboard\/shared/, 'shared');

                        node.href = url; // + '?_=' + app.CACHE_BUSTING_HASH;
                        break;
                }

                return nativeAppendChild.call(this, node);
            };
    };

    KeyboardAppStarter.prototype._getIndexHTMLContent = function () {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '');
            xhr.responseType = 'document';
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(e);
            };
            xhr.send();
        }.bind(this));
    };

    KeyboardAppStarter.prototype._prepareDOM = function (sourceDoc) {
        // Clean up the document.
        document.documentElement.firstElementChild.innerHTML = '';
        document.body.innerHTML = '';

        var destHeadNode = document.documentElement.firstElementChild;

        // Copy the imported DOM into the document.
        var sourceHeadNode = document.importNode(
            sourceDoc.documentElement.firstElementChild, true);
        var sourceBodyNode = document.importNode(sourceDoc.body, true);

        // These appendChild() are already wrapped with cache busting.

        ['../../../assets/api.css'].forEach(function (url) {
            var el = document.createElement('link');
            el.href = url;
            el.rel = 'stylesheet';
            destHeadNode.appendChild(el);
        }, this);

        Array.prototype.forEach.call(sourceHeadNode.children, function (node, i) {
            if (node.nodeName === 'SCRIPT') {
                // Script elements needs to be recreated;
                // imported ones doesn't trigger actual script load.
                var el = document.createElement('script');
                el.src = node.src;
                el.async = false;
                destHeadNode.appendChild(el);
            } else {
                // clone the node so we don't mess with the original collection list.
                destHeadNode.appendChild(node.cloneNode(true));
            }
        });

        Array.prototype.forEach.call(sourceBodyNode.children, function (node) {
            // clone the node so we don't mess with the original collection list.
            document.body.appendChild(node.cloneNode(true));
        });

        // Insert -prefix-free to get <style> prefixed.
        var el = document.createElement('script');
        el.src =
            '//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js';
        el.async = false;
        destHeadNode.appendChild(el);
    };

    exports.KeyboardAppStarter = KeyboardAppStarter;

}(window));
