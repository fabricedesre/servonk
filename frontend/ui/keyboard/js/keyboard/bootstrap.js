'use strict';

/* global KeyboardApp */

// This file should be considered frozen and nothing should be added here,
// ever. It's also intentionally not covered in the unit test suite.
(function (exports) {

    function init_apis() {
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

    init_apis();
    var app = new KeyboardApp();
    app.start();

    // Ideally we shouldn't be exposing the instance to the world, however
    // we still need to allow incorrect access of Gaia UI tests
    // for getting our states.
    //
    // See tests/python/gaia-ui-tests/gaiatest/apps/keyboard/app.py.
    //
    // JS Console is probably the only valid use case to access this.
    exports.app = app;

})(window);
