
(function (global) {
    'use strict';

    // Add a long press event on a DOM element. Works both for mouse
    // or touch interactions.
    let addLongPressEvent = (elem, delay) => {
        delay = delay || 1000; // Default to 1000ms of delay.
        let timer = null;

        let touch_start = () => {
            timer = global.setTimeout(() => {
                timer = null;
                elem.dispatchEvent(new CustomEvent("longpress"));
            }, delay);
        }

        let touch_end = () => {
            // Clear the timeour when releasing to early.
            if (timer) {
                global.clearTimeout(timer);
            }
        }

        elem.addEventListener("touchstart", (event) => {
            event.preventDefault();
            touch_start(event);
        });
        elem.addEventListener("mousedown", touch_start);

        elem.addEventListener("touchend", (event) => {
            event.preventDefault();
            touch_end(event);
        });
        elem.addEventListener("mouseup", touch_end);
    }

    // Will dispatch a custom "timedclick" event on the element, letting the
    // user decide wheter that should be recognized as a click or not.
    let addTimedClickEvent = (elem) => {
        let start = null;
        let touch_start = () => {
            start = Date.now();
        }

        let touch_end = () => {
            let delay = Date.now() - start;
            elem.dispatchEvent(new CustomEvent("timedclick", { detail: { delay } }));
        }

        elem.addEventListener("touchstart", (event) => {
            event.preventDefault();
            touch_start(event);
        });
        elem.addEventListener("mousedown", touch_start);

        elem.addEventListener("touchend", (event) => {
            event.preventDefault();
            touch_end(event);
        });
        elem.addEventListener("mouseup", touch_end);
    }

    global.Utils = {
        addLongPressEvent,
        addTimedClickEvent
    }
})(window);