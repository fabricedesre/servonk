
(function (global) {
    'use strict';

    // Add a long press event on a DOM target. Works both for mouse
    // or touch interactions.
    let addLongPressEvent = (target, delay) => {
        delay = delay || 1000; // Default to 1000ms of delay.
        let timer = null;

        let touch_start = () => {
            timer = global.setTimeout(() => {
                timer = null;
                target.dispatchEvent(new CustomEvent("longpress"));
            }, delay);
        }

        let touch_end = () => {
            // Clear the timeour when releasing to early.
            if (timer) {
                global.clearTimeout(timer);
            }
        }

        target.addEventListener("touchstart", (event) => {
            event.preventDefault();
            touch_start(event);
        });
        target.addEventListener("mousedown", touch_start);

        target.addEventListener("touchend", (event) => {
            event.preventDefault();
            touch_end(event);
        });
        target.addEventListener("mouseup", touch_end);
    }

    // Will dispatch a custom "timedclick" event on the target, letting the
    // user decide wheter that should be recognized as a click or not.
    let addTimedClickEvent = (target) => {
        let start = null;
        let touch_start = () => {
            start = Date.now();
        }

        let touch_end = () => {
            let delay = Date.now() - start;
            target.dispatchEvent(new CustomEvent("timedclick", { detail: { delay } }));
        }

        target.addEventListener("touchstart", (event) => {
            event.preventDefault();
            touch_start(event);
        });
        target.addEventListener("mousedown", touch_start);

        target.addEventListener("touchend", (event) => {
            event.preventDefault();
            touch_end(event);
        });
        target.addEventListener("mouseup", touch_end);
    }

    // Dispatch an "idle" event when no input even has been received for more than `delay`.
    let addIdleEvent = (target, delay) => {
        let timer = null;
        let idle = false;

        let reset_timer = () => {
            // Clear the current timer.
            // This needs to happen before eventually dispatching the event
            // to prevent the timer to go off during the event.
            if (timer) {
                global.clearTimeout(timer);
            }

            // If we were idle, dispatch an "not idle anymore event".
            if (idle) {
                idle = false;
                target.dispatchEvent(new CustomEvent("idle", { detail: { idle } }));
            }

            start_timer();
        }

        let start_timer = () => {
            timer = global.setTimeout(() => {
                timer = null;
                idle = true;
                target.dispatchEvent(new CustomEvent("idle", { detail: { idle } }));
                // We are idle now, just wait for some event to trigger a reset of the timer.
            }, delay);
        }

        // Capture top level events.
        global.addEventListener("touchstart", reset_timer, true);
        global.addEventListener("mousedown", reset_timer, true);
        global.addEventListener("mousemove", reset_timer, true);
        global.addEventListener("keydown", reset_timer, true);

        start_timer();
    }

    global.Utils = {
        addLongPressEvent,
        addTimedClickEvent,
        addIdleEvent
    }
})(window);