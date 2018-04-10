
// Basic keyboard API.

(function keyboard_api(window) {
    return;

    console.log(`Keyboard API loaded in ${window.location.href}`);
    if (window.location.href === "about:blank") {
        return;
    }

    function is_input(node) {
        return (["input"].indexOf(node.localName.toLowerCase()) != -1);
    }

    window.addEventListener("focus", (event) => {
        console.log(`Got focus event on ${event.target.localName}`);
        if (is_input(event.target)) {
            window.parent.postMessage({ action: "focus" }, "*");
        }
    }, true);

    window.addEventListener("blur", (event) => {
        console.log(`Got blur event on ${event.target.localName}`);
        if (is_input(event.target)) {
            window.parent.postMessage({ action: "blur" }, "*");
        }
    }, true);

})(window);
