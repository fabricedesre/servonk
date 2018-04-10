'use strict';

(function(exports) {

var InputMethodHandler = function(app) {
  this.app = app;
  this._selectionStart = -1;
  this._text = '';

  this._currentText = '';
};

InputMethodHandler.prototype.INPUT_ELEMENT_ID = 'inputtext';
InputMethodHandler.prototype.COMPOSITION_ELEMENT_ID = 'composition';

InputMethodHandler.prototype.start = function(elements) {
  elements = elements || {};
  this.input =
    elements.input ||
    document.getElementById(this.INPUT_ELEMENT_ID);
  this.input.appendChild(document.createTextNode(''));

  this.composition =
    elements.composition ||
    document.getElementById(this.COMPOSITION_ELEMENT_ID);
};

InputMethodHandler.prototype.stop = function() {
  this.input = null;
  this.composition = null;
};

InputMethodHandler.prototype.getCurrentText = function() {
  return this._currentText;
};

InputMethodHandler.prototype.setCurrentText = function(text) {
  this._currentText = text;
  this.input.textContent = '';

  if (!text) {
    this.input.appendChild(document.createTextNode(''));
  } else {
    text.split('\n').forEach(function(paragraph, i, arr) {
      // The witchcraft is needed because we need to use nbsp to prevent
      // space from collapsing, but the same time we want word breaks if
      // needed.
      //
      // XXX: This is not the most efficient way to do it.
      paragraph = paragraph.replace(/ /g, String.fromCharCode(0xA0))
        .replace(/\xA0(\S)/g, function(m0, m1) { return ' ' + m1; });
      this.input.appendChild(document.createTextNode(paragraph));
      if ((i + 1) !== arr.length) {
        this.input.appendChild(document.createElement('br'));
      }
    }.bind(this));
  }
};

InputMethodHandler.prototype.handleMessage = function(data) {
  switch (data.api) {
    case 'inputcontext':
      this.handleInputContextMessage(data);

      break;

    case 'inputmethodmanager':
      this.handleInputMethodManagerMessage(data);

      break;
  }
};

InputMethodHandler.prototype.handleInputContextMessage = function(data) {
  switch (data.method) {
    case 'keydown':
    case 'sendKey':
      if (typeof data.args[0] === 'object') {
        switch (data.args[0].key) {
          case 'Backspace':
            this._handleInput('backspace');

            break;

          case 'Enter':
            this._handleInput('return');

            break;

          default:
            this._handleInput('append', data.args[0].key);

            break;
        }
      } else { // old arguments
        // keydown does not support old methods
        if (data.method === 'keydown') {
          this.app.postMessage({
            api: data.api,
            contextId: data.contextId,
            id: data.id,
            error: 'Wrong arguments.'
          });
          break;
        }
        var charCode = data.args[1];
        if (charCode) {
          this._handleInput('append', String.fromCharCode(data.args[1]));
        } else {
          switch (data.args[0]) {
            case 0x08: // DOM_VK_BACKSPACE
              this._handleInput('backspace');

              break;

            case 0x0D: // DOM_VK_RETURN
              this._handleInput('return');

              break;

            default:
              console.log(data.args[0]);

              break;
          }
        }
      }

      this._updateSelectionContext();

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        result: ''
      });
      break;

    case 'keyup':
      // nothing to do since we don't emit events.
      break;

    case 'replaceSurroundingText':
      this._handleInput('replace', data.args[0], data.args[1], data.args[2]);

      this._updateSelectionContext();

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        result: this.getSelectionInfo()
      });

      break;

    case 'deleteSurroundingText':
      this._handleInput('replace', '', data.args[0], data.args[1]);

      this._updateSelectionContext();

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        result: this.getSelectionInfo()
      });

      break;

    case 'setComposition':
      this._handleInput('updateComposition', data.args[0]);

      this._updateSelectionContext();

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        result: ''
      });

      break;

    case 'endComposition':
      this._handleInput('append', data.args[0]);

      this._updateSelectionContext();

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        result: ''
      });

      break;

    case 'setSelectionRange':

      this.app.postMessage({
        api: data.api,
        contextId: data.contextId,
        id: data.id,
        error: 'Unimplemented'
      });

      break;
  }
};

InputMethodHandler.prototype.handleInputMethodManagerMessage = function(data) {
  switch (data.method) {
    case 'showAll':
      this.app.showSelectionDialog();

      break;

    case 'next':
      this.app.switchToNext();

      break;

    case 'hide':
      this.app.removeFocus();

      break;
  }
};

InputMethodHandler.prototype._handleInput = function(job, str, offset, length) {
  var container = this.input;
  var lastChild = this.input.lastChild;

  switch (job) {
    case 'updateComposition':
      window.requestAnimationFrame(function() {
        this.composition.textContent = str;
      }.bind(this));

      break;

    case 'append':
      this._currentText += str;

      window.requestAnimationFrame(function() {
        this.composition.textContent = '';
        if (lastChild.nodeName !== '#text') {
          container.appendChild(document.createTextNode(str));
        } else {
          var text = lastChild.textContent + str;
          // The witchcraft is needed because we need to use nbsp to prevent
          // space from collapsing, but the same time we want word breaks if
          // needed.
          //
          // XXX: This is not the most efficient way to do it.
          lastChild.textContent = text.replace(/ /g, String.fromCharCode(0xA0))
            .replace(/\xA0(\S)/g, function(m0, m1) { return ' ' + m1; });
        }

        this.composition.scrollIntoView();
      }.bind(this));

      break;

    case 'return':
      this._currentText += '\n';

      window.requestAnimationFrame(function() {
        container.appendChild(document.createElement('br'));

        this.composition.scrollIntoView();
      }.bind(this));

      break;

    case 'backspace':
      var length = 1;
      var lastCharCode;
      while (true) {
        lastCharCode =
          this._currentText.charCodeAt(this._currentText.length - length);
        // Surrogates 0xd800 - 0xdfff
        if (lastCharCode >> 11 === 0x1b) {
          length += 1;
          break;
        }

        // Variation selectors 0xfe00 - 0xfe0f
        if (lastCharCode >> 4 === 0xfe0) {
          length += 1;
          continue;
        }

        break;
      }
      this._currentText =
        this._currentText.substr(0, this._currentText.length - length);

      window.requestAnimationFrame(function() {
        if ((lastChild.nodeName !== '#text' ||
              lastChild.textContent.length === 1) &&
            lastChild !== container.firstChild) {
          container.removeChild(lastChild);
        } else {
          lastChild.textContent = lastChild.textContent
            .substr(0, lastChild.textContent.length - length)
            .replace(/ /g, String.fromCharCode(0xA0))
            .replace(/\xA0(\S)/g, function(m0, m1) { return ' ' + m1; });
        }
      }.bind(this));

      break;

    case 'replace':
      var text = this._currentText;
      this._currentText = text.substr(0, text.length + offset) + str;
      if (offset !== - length) {
        this._currentText += text.substr(text.length + offset + length);
      }

      window.requestAnimationFrame(function() {
        if (lastChild.textContent.length < length) {
          console.error('Unimplemented: ' +
            'replaceSurroundingText range reaches return.');

          return;
        }

        var text = lastChild.textContent;
        var resultTextContent = '';
        resultTextContent = text.substr(0, text.length + offset) + str;
        if (offset !== - length) {
          resultTextContent += text.substr(text.length + offset + length);
        }
        lastChild.textContent =
          resultTextContent.replace(/ /g, String.fromCharCode(0xA0))
            .replace(/\xA0(\S)/g, function(m0, m1) { return ' ' + m1; });

        this.composition.scrollIntoView();
      }.bind(this));

      break;
  }
};

InputMethodHandler.prototype.getSelectionInfo = function() {
  var text = this._currentText;
  var selectionStart = text.length;
  var changed = (text !== this._text ||
    selectionStart !== this._selectionStart);

  this._text = text;
  this._selectionStart = selectionStart;

  return {
    selectionStart: selectionStart,
    selectionEnd: selectionStart,
    textBeforeCursor: text,
    textAfterCursor: '',
    changed: changed,
    text: text
  };
};

InputMethodHandler.prototype._updateSelectionContext = function() {
  this.app.postMessage({
    api: 'inputcontext',
    method: 'updateSelectionContext',
    result: {
      selectionInfo: this.getSelectionInfo(),
      // Our implementation does not currently allow user to change
      // selection or text on the fake input,
      // therefore all events should have ownAction set to true.
      ownAction: true
    }
  });
};

exports.InputMethodHandler = InputMethodHandler;

}(window));
