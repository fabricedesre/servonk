'use strict';

/*
 * This is the main interface where websites could drop-in this library
 * and start having users using Gaia Keyboard on their site.
 *
 */

(function(exports) {

function Deferred() {
  this.promise = new Promise(function(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }.bind(this));
}

function GaiaKeyboard(options) {
  // Must be called with a |new| operator
  if (this.constructor !== GaiaKeyboard) {
    return new GaiaKeyboard(options);
  }

  options = options || {};

  this.parentElement = options.parentElement || document.body;

  if (options.startInputLayoutId) {
    this.startInputLayoutId = options.startInputLayoutId;
  }

  if (options.enabledLayouts) {
    this.enabledLayouts = options.enabledLayouts;
  } else {
    this.enabledLayouts = [];
    this.LAYOUT_ID_TO_LABEL_MAP.forEach(function(label, id) {
      this.enabledLayouts.push(id);
    }.bind(this));
  }
}

GaiaKeyboard.prototype.constructor = GaiaKeyboard;

GaiaKeyboard.prototype.ASSET_ROOT_URL =
  'http://timdream.org/gaia-keyboard-demo/';
GaiaKeyboard.prototype.GAIA_APP_DIR = './gaia/apps/keyboard';
GaiaKeyboard.prototype.LAYOUT_ID_TO_LABEL_MAP = LAYOUTS;

GaiaKeyboard.prototype.startInputLayoutId = 'en';
GaiaKeyboard.prototype.enabledLayouts = undefined;

GaiaKeyboard.prototype.parentElement = undefined;
GaiaKeyboard.prototype.launchButtonElement = undefined;
GaiaKeyboard.prototype.containerElement = undefined;
GaiaKeyboard.prototype.titleElement = undefined;
GaiaKeyboard.prototype.closeButtonElement = undefined;
GaiaKeyboard.prototype.inputAreaElement = undefined;
GaiaKeyboard.prototype.appFrameElement = undefined;

GaiaKeyboard.prototype.start = function () {
  this.load();

  window.addEventListener('message', this);

  window.addEventListener('focus', this, true);
  window.addEventListener('blur', this, true);
};

GaiaKeyboard.prototype.load = function() {
  this._loadDOM();

  this.settingsHandler = new SettingsHandler(this);
  this.settingsHandler.start();

  this.inputMethodHandler = new InputMethodHandler(this);
  this.inputMethodHandler.start({
    input: this.inputAreaElement.firstChild,
    composition: this.inputAreaElement.lastChild
  });

  this.loaded = true;
};

GaiaKeyboard.prototype._loadDOM = function() {
  // Create the flaoting button
  var launchButton = this.launchButtonElement =
    document.createElement('button');
  launchButton.className = 'gaia-keyboard-button';
  launchButton.addEventListener('touchstart', this);
  launchButton.addEventListener('mousedown', this);
  launchButton.title = 'Use Gaia Keyboard';
  launchButton.disabled = !this.isActiveElementAnInput();
  this.parentElement.appendChild(launchButton);

  // Create the container element
  var containerElement =
    this.containerElement = document.createElement('div');
  containerElement.className = 'gaia-keyboard-container';
  containerElement.hidden = true;
  this.parentElement.appendChild(containerElement);

  var scrollableContainer = document.createElement('div');
  scrollableContainer.className = 'gaia-keyboard-inner-container';
  containerElement.appendChild(scrollableContainer);

  var titleElement = this.titleElement = document.createElement('h2');
  scrollableContainer.appendChild(titleElement);

  var closeButtonElement =
    this.closeButtonElement = document.createElement('button');
  closeButtonElement.textContent = '✕';
  closeButtonElement.addEventListener('click', this);
  scrollableContainer.appendChild(closeButtonElement);

  var inputAreaElement =
    this.inputAreaElement = document.createElement('div');
  inputAreaElement.className = 'gaia-keyboard-inputarea';
  inputAreaElement.dir = 'auto';
  scrollableContainer.appendChild(inputAreaElement);

  inputAreaElement.appendChild(document.createElement('span'));
  inputAreaElement.appendChild(document.createElement('span'));
  inputAreaElement.lastChild.className = 'gaia-keyboard-composition';

  var iframe = this.appFrameElement = document.createElement('iframe');
  iframe.scrolling = 'no';
  iframe.src = this.ASSET_ROOT_URL + 'app.html#' +
    this.GAIA_APP_DIR + '/index.html#' + this.startInputLayoutId;
  this.currentLayout = this.startInputLayoutId;
  containerElement.appendChild(iframe);
};

GaiaKeyboard.prototype.stop = function() {
  this.close();

  this.inputMethodHandler.stop();
  this.settingsHandler.stop();

  // Remove the container element from the parent element
  this._unloadDOM();
  this.loaded = false;
};

GaiaKeyboard.prototype._unloadDOM = function () {
  this.parentElement.removeChild(this.launchButtonElement);
  this.parentElement.removeChild(this.containerElement);

  this.launchButtonElement = undefined;
  this.containerElement = undefined;
  this.titleElement = undefined;
  this.closeButtonElement = undefined;
  this.inputAreaElement = undefined;
  this.appFrameElement = undefined;
};

GaiaKeyboard.prototype.requireInputOnElement = function(element) {
  element.disabled = true;
  return this.requireInput({
      value: element.value,
      title: element.title
    })
    .then(function(value) {
      element.value = value;
    })
    .catch(function(e) {
      console.error(e);
    })
    .then(function() {
      element.disabled = false;
      element.scrollIntoView();
    })
    .catch(function(e) {
      console.error(e);
    });
};

GaiaKeyboard.prototype.requireInput = function(inputData) {
  if (this.activeInputDeferred) {
    this.resolveActiveInput();
  }

  this.titleElement.textContent = inputData.title || '';

  this.inputMethodHandler.setCurrentText(inputData.value);
  this.containerElement.hidden = false;
  this.containerElement.firstChild.style.minHeight =
    Math.max(document.body.getBoundingClientRect().height,
      window.innerHeight) + 'px';

  var info = this.inputMethodHandler.getSelectionInfo();
  this.postMessage({
    api: 'inputmethod',
    method: 'setInputContext',
    ctx: true,
    selectionStart: info.selectionStart,
    selectionEnd: info.selectionEnd,
    textBeforeCursor: info.textBeforeCursor,
    textAfterCursor: info.textAfterCursor
  });

  var deferred = this.activeInputDeferred = new Deferred();
  return deferred.promise;
};

GaiaKeyboard.prototype.resolveActiveInput = function() {
  this.containerElement.firstChild.style.minHeight = null;

  this.activeInputDeferred.resolve(this.inputMethodHandler.getCurrentText());
};

GaiaKeyboard.prototype.showSelectionDialog = function () {
  // XXX Implement me
  alert('Layout selection is not implemented yet.');
};

GaiaKeyboard.prototype.switchToNext = function () {
  var index = this.enabledLayouts.indexOf(this.currentLayout);
  if (index === -1) {
    index = 0;
  } else {
    index++;
  }

  if (index === this.enabledLayouts.length) {
    index = 0;
  }

  this.currentLayout = this.enabledLayouts[index];

  this.postMessage({
    api: 'api',
    method: 'updateHash',
    result: this.currentLayout
  });
};

GaiaKeyboard.prototype.removeFocus = function() {
  this.close();
};

GaiaKeyboard.prototype.close = function() {
  if (!this.activeInputDeferred) {
    return;
  }

  this.resolveActiveInput();
  this.containerElement.hidden = true;

  this.postMessage({
    api: 'inputmethod',
    method: 'setInputContext',
    ctx: false
  });
  document.body.style.paddingBottom = '';
};

GaiaKeyboard.prototype.postMessage = function(data) {
  this.appFrameElement.contentWindow.postMessage(data, '*');
};

GaiaKeyboard.prototype.handleEvent = function(evt) {
  switch (evt.type) {
    case 'touchstart':
    case 'mousedown':
      if (!this.isActiveElementAnInput()) {
        return;
      }

      var element = document.activeElement;

      this.requireInputOnElement(document.activeElement)
        .then(function() {
          element.focus();
        })
        .catch(function(e) {
          console.error(e);
        });
      element.blur();
      break;

    case 'click':
      this.close();

      break;

    case 'focus':
    case 'blur':
      if (this.isActiveElementAnInput()) {
        this.launchButtonElement.disabled = false;
        // XXX: Improve this on an iPhone so there can be a better
        // interaction between native keyboard and our keyboard.
        this.launchButtonElement.style.top =
          document.activeElement.offsetTop + 'px';
      } else {
        this.launchButtonElement.disabled = true;
      }

      break;

    case 'message':
      this.handleMessage(evt.data);
      break;

    default:
      console.error('GaiaKeyboard: Unknown event', evt);
      break;
  }
};

GaiaKeyboard.prototype.handleMessage = function(data) {
  switch (data.api) {
    case 'settings':
      this.settingsHandler.handleMessage(data);

      break;

    case 'inputmethod':
    case 'inputcontext':
    case 'inputmethodmanager':
      this.inputMethodHandler.handleMessage(data);

      break;

    case 'resizeTo':
      if (!this.activeInputDeferred) {
        return;
      }
      window.requestAnimationFrame(function() {
        this.containerElement.firstChild.style.paddingBottom =
          data.args[1] + 'px';
        this.inputMethodHandler.composition.scrollIntoView();
      }.bind(this));

      break;

    default:
      throw new Error('GaiaKeyboard: Unknown message.');

      break;
  }
};

GaiaKeyboard.prototype.isActiveElementAnInput = function () {
  // TODO: button <input>s will pass here...

  return document.activeElement &&
    (document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA') &&
    !document.activeElement.readOnly;
};

exports.GaiaKeyboard = GaiaKeyboard;

})(window);
