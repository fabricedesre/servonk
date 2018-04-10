'use strict';

/* global MockEventTarget, Promise */

(function (exports) {

    var Deferred = function () {
        this.promise = new Promise(function (resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
        }.bind(this));

        return this;
    };

    /**
     * InputMethod is a constructer function that will give you an mock
     * instance of `navigator.mozInputMethod`. For the real implementation, see
     * http://dxr.mozilla.org/mozilla-central/source/dom/inputmethod/MozKeyboard.js
     *
     * The only extra mothod in the mock is `setInputContext()`, for you to set
     * the inputContext.
     *
     * @param {Object} inputContext InputContext instance.
     *
     * @class InputMethod
     * @requires MockEventTarget
     */
    var InputMethod = function InputMethod(inputContext) {
        this.inputcontext = inputContext || null;
    };

    InputMethod.prototype = new MockEventTarget();

    InputMethod.prototype.oninputcontextchange = null;

    InputMethod.prototype.inputcontext = null;

    InputMethod.prototype.start = function () {
        this.mgmt = new InputMethodManager();
        this.mgmt.start();

        this.inputcontext = new InputContext();
        this.inputcontext.start();

        window.addEventListener('message', this);
    };

    InputMethod.prototype.stop = function () {
        window.removeEventListener('message', this);
    };

    InputMethod.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'inputmethod') {
            return;
        }

        switch (data.method) {
            case 'setInputContext':
                if (this.inputcontext) {
                    this.inputcontext.stop();
                }

                var ctx = null;
                if (data.ctx) {
                    ctx = new InputContext();
                    ctx.selectionStart = data.selectionStart;
                    ctx.selectionEnd = data.selectionEnd;
                    ctx.textBeforeCursor = data.textBeforeCursor;
                    ctx.textAfterCursor = data.textAfterCursor;
                    ctx.start();
                }

                this.setInputContext(ctx);

                break;
        }
    };

    /**
     * Set the mocked inputContext. Will send an inputcontextchange event if
     * the context is different.
     *
     * @param {Object} inputContext InputContext instance.
     * @memberof InputMethod.prototype
     */
    InputMethod.prototype.setInputContext = function (inputContext) {
        inputContext = inputContext || null;
        if (inputContext === this.inputcontext) {
            return;
        }

        if (inputContext) {
            this.inputcontext = inputContext;
        } else {
            this.inputcontext = null;
        }

        var evt = {
            type: 'inputcontextchange'
        };
        this.dispatchEvent(evt);
    };

    /**
     * This class allow you to create a mock inputContext instance.
     * It does *not* manage it's own states and properties. Doing so inevitablely
     * reimplements the API :'(.
     *
     * Many of it's method returns a Promise. You should install a
     * sinon.spy on the method and retrive the Promise instance with
     * 'spy.getCall(0).returnValue'.
     *
     * These Promise instances comes with their `resolve()` and `reject()`
     * methods exposed, so you should call them accordingly after setting the
     * properties.
     *
     * Two additional methods, `fireSurroundingTextChange()` and
     * `fireSelectionChange()` allow you to dispatch simulated events.
     *
     * @class InputContext
     * @requires MockEventTarget
     *
     */
    var InputContext = function InputContext() {
        this._contextId = '';
        this._pendingPromisesId = 0;
        this._pendingPromises = null;
    };

    InputContext.prototype = new MockEventTarget();

    InputContext.prototype.type = 'textarea';
    InputContext.prototype.inputType = 'textarea';
    InputContext.prototype.inputMode = '';
    InputContext.prototype.lang = '';

    InputContext.prototype.selectionStart = 0;
    InputContext.prototype.selectionEnd = 0;
    InputContext.prototype.textBeforeCursor = '';
    InputContext.prototype.textAfterCursor = '';
    InputContext.prototype.text = '';

    InputContext.prototype.onsurroundingtextchange = null;

    InputContext.prototype.onselectionchange = null;

    InputContext.prototype.start = function () {
        this._contextId = Math.random().toString(32).substr(2, 8);
        this._pendingPromisesId = 0;
        this._pendingPromises = new Map();

        window.addEventListener('message', this);
    };

    InputContext.prototype.stop = function () {
        window.removeEventListener('message', this);

        this._contextId = '';
        this._pendingPromisesId = 0;
        this._pendingPromises = null;
    };

    InputContext.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'inputcontext') {
            return;
        }

        if (data.method) {
            switch (data.method) {
                case 'updateSelectionContext':
                    this._updateSelectionContext(data.result.selectionInfo,
                        data.result.ownAction);

                    break;
            }

            return;
        }

        var d = this._pendingPromises.get(data.id);
        this._pendingPromises.delete(data.id);

        if (typeof data.result !== 'undefined') {
            d.resolve(data.result);
        } else {
            d.reject(data.error);
        }
    };

    InputContext.prototype._sendMessage = function (method, args) {
        var d = new Deferred();

        var promiseId = ++this._pendingPromisesId;
        this._pendingPromises.set(promiseId, d);

        window.addEventListener('message', this);
        window.parent.postMessage({
            id: promiseId,
            api: 'inputcontext',
            contextId: this._contextId,
            method: method,
            args: args
        }, '*');

        return d.promise;
    };

    InputContext.prototype._updateSelectionContext = function (ctx, ownAction) {
        var selectionDirty = this.selectionStart !== ctx.selectionStart ||
            this.selectionEnd !== ctx.selectionEnd;
        var surroundDirty = this.textBeforeCursor !== ctx.textBeforeCursor ||
            this.textAfterCursor !== ctx.textAfterCursor;

        this.selectionStart = ctx.selectionStart;
        this.selectionEnd = ctx.selectionEnd;
        this.textBeforeCursor = ctx.textBeforeCursor;
        this.textAfterCursor = ctx.textAfterCursor;
        this.text = ctx.text;

        if (selectionDirty) {
            this.fireSelectionChange(ownAction);
        }

        if (surroundDirty) {
            this.fireSurroundingTextChange(ownAction);
        }
    };

    InputContext.prototype.fireSurroundingTextChange = function (ownAction) {
        var evt = {
            type: 'surroundingtextchange',
            detail: {
                beforeString: this.textBeforeCursor,
                afterString: this.textAfterCursor,
                ownAction: ownAction
            }
        };

        this.dispatchEvent(evt);
    };

    InputContext.prototype.fireSelectionChange = function (ownAction) {
        var evt = {
            type: 'selectionchange',
            detail: {
                selectionStart: this.selectionStart,
                selectionEnd: this.selectionEnd,
                ownAction: ownAction
            }
        };

        this.dispatchEvent(evt);
    };

    InputContext.prototype.getText = function () {
        return this._sendMessage('getText');
    };
    InputContext.prototype.setSelectionRange = function () {
        return this._sendMessage(
            'setSelectionRange', [].slice.call(arguments));
    };
    InputContext.prototype.replaceSurroundingText = function () {
        return this._sendMessage(
            'replaceSurroundingText', [].slice.call(arguments));
    };
    InputContext.prototype.deleteSurroundingText = function () {
        return this._sendMessage(
            'deleteSurroundingText', [].slice.call(arguments));
    };
    InputContext.prototype.keydown = function () {
        return this._sendMessage(
            'keydown', [].slice.call(arguments));
    };
    InputContext.prototype.sendKey = function () {
        return this._sendMessage(
            'sendKey', [].slice.call(arguments));
    };
    InputContext.prototype.keyup = function () {
        return this._sendMessage(
            'keyup', [].slice.call(arguments));
    };
    InputContext.prototype.setComposition = function () {
        return this._sendMessage(
            'setComposition', [].slice.call(arguments));
    };
    InputContext.prototype.endComposition = function () {
        return this._sendMessage(
            'endComposition', [].slice.call(arguments));
    };

    /**
     * A InputMethodManager instance when the
     * InputMethod instance is created.
     *
     * Noop method are in place to install spies.
     *
     * @class InputMethodManager
     *
     */
    var InputMethodManager = function MozInputMethodManager() {
        this._supportsSwitching = true;
    };

    InputMethodManager.prototype.start = function () {
        window.addEventListener('message', this);
    };

    InputMethodManager.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'inputmethodmanager') {
            return;
        }

        this._supportsSwitching = data.result;
    };

    InputMethodManager.prototype._sendMessage = function (method) {
        window.parent.postMessage({
            api: 'inputmethodmanager',
            method: method
        }, '*');
    };

    InputMethodManager.prototype.showAll = function () {
        this._sendMessage('showAll');
    };

    InputMethodManager.prototype.next = function () {
        this._sendMessage('next');
    };

    InputMethodManager.prototype.hide = function () {
        this._sendMessage('hide');
    };

    InputMethodManager.prototype.supportsSwitching = function () {
        return this._supportsSwitching;
    };

    exports.InputMethodManager = InputMethodManager;
    exports.InputMethod = InputMethod;
    exports.InputContext = InputContext;
}(window));
