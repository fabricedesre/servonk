'use strict';

/* global MockEventTarget, MockDOMRequest */

(function (exports) {

    /**
     *
     * This is a mock of navigator.mozSettings
     * See
     * https://mxr.mozilla.org/mozilla-central/source/dom/settings/SettingsManager.js
     * for the platform implementation.
     *
     * Please use sinon.spy or sinon.stub to wrap these functions to do your things.
     *
     * Require MockEventTarget and MockDOMRequest.
     *
     */
    var NavigatorMozSettings = function () {
        this._callbacks = {};
    };

    NavigatorMozSettings.prototype = new MockEventTarget();

    NavigatorMozSettings.prototype.onsettingchange = null;

    NavigatorMozSettings.prototype.start = function () {
        window.addEventListener('message', this);
    };

    NavigatorMozSettings.prototype.stop = function () {
        window.removeEventListener('message', this);
    };

    NavigatorMozSettings.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'settings' || !('method' in data)) {
            return;
        }

        switch (data.method) {
            case 'dispatchSettingChange':
                this.dispatchSettingChange(data.key, data.value);

                break;
        }
    };

    // This function returns a mocked lock object.
    // to spy/stub the methods of the returned lock before this method is called,
    // stub this method and return your own lock with spy/stub methods.
    NavigatorMozSettings.prototype.createLock = function () {
        var lock = new NavigatorMozSettingsLock();
        lock.start();

        return lock;
    };

    NavigatorMozSettings.prototype.addObserver = function (key, callback) {
        if (!this._callbacks[key]) {
            this._callbacks[key] = [callback];
        } else {
            this._callbacks[key].push(callback);
        }
    };

    NavigatorMozSettings.prototype.removeObserver = function (key, callback) {
        if (this._callbacks[key]) {
            var index = this._callbacks[key].indexOf(callback);
            if (index !== -1) {
                this._callbacks[key].splice(index, 1);
            }
        }
    };

    NavigatorMozSettings.prototype.dispatchSettingChange = function (key, val) {
        var evt = {
            type: 'settingchange',
            settingName: key,
            settingValue: val
        };
        this.dispatchEvent(evt);

        if (this._callbacks && this._callbacks[key]) {
            this._callbacks[key].forEach(function (cb) {
                cb({ settingName: key, settingValue: val });
            }.bind(this));
        }
    };

    var NavigatorMozSettingsLock = function () {
        this.closed = false;

        this._lockId = '';
        this._pendingRequestId = 0;
        this._pendingRequests = null;
    };

    NavigatorMozSettingsLock.prototype.start = function () {
        this._lockId = Math.random().toString(32).substr(2, 8);
        this._pendingRequestId = 0;
        this._pendingRequests = new Map();
    };

    NavigatorMozSettingsLock.prototype.stop = function () {
        window.removeEventListener('message', this);

        this._lockId = '';
        this._pendingRequestId = 0;
        this._pendingRequests = null;
    };

    NavigatorMozSettingsLock.prototype.handleEvent = function (evt) {
        var data = evt.data;

        if (data.api !== 'settings' || data.lockId !== this._lockId) {
            return;
        }

        var req = this._pendingRequests.get(data.id);
        this._pendingRequests.delete(data.id);

        if (this._pendingRequests.size === 0) {
            window.removeEventListener('message', this);
        }

        if (typeof data.result !== 'undefined') {
            req.fireSuccess(data.result);
        } else {
            req.fireError(data.error);
        }
    };

    NavigatorMozSettingsLock.prototype._sendMessage = function (method, args) {
        var req = new MockDOMRequest();

        var requestId = ++this._pendingRequestId;
        this._pendingRequests.set(requestId, req);

        window.addEventListener('message', this);
        window.parent.postMessage({
            id: requestId,
            api: 'settings',
            lockId: this._lockId,
            method: method,
            args: args
        }, '*');

        return req;
    };

    NavigatorMozSettingsLock.prototype.set = function (arg) {
        return this._sendMessage('set', [arg]);
    };

    NavigatorMozSettingsLock.prototype.get = function (arg) {
        return this._sendMessage('get', [arg]);
    };

    NavigatorMozSettingsLock.prototype.clear = function (arg) {
        return this._sendMessage('clear', [arg]);
    };

    exports.NavigatorMozSettings = NavigatorMozSettings;
    exports.NavigatorMozSettingsLock = NavigatorMozSettingsLock;

})(window);
