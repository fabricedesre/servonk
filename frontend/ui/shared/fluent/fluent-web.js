/* fluent-web@0.0.1 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define('fluent-web', factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Below is a manually a list of likely subtags corresponding to Unicode
 * CLDR likelySubtags list.
 * This list is curated by the maintainers of Project Fluent and is
 * intended to be used in place of the full likelySubtags list in use cases
 * where full list cannot be (for example, due to the size).
 *
 * This version of the list is based on CLDR 30.0.3.
 */
var likelySubtagsMin = {
  'ar': 'ar-arab-eg',
  'az-arab': 'az-arab-ir',
  'az-ir': 'az-arab-ir',
  'be': 'be-cyrl-by',
  'da': 'da-latn-dk',
  'el': 'el-grek-gr',
  'en': 'en-latn-us',
  'fa': 'fa-arab-ir',
  'ja': 'ja-jpan-jp',
  'ko': 'ko-kore-kr',
  'pt': 'pt-latn-br',
  'sr': 'sr-cyrl-rs',
  'sr-ru': 'sr-latn-ru',
  'sv': 'sv-latn-se',
  'ta': 'ta-taml-in',
  'uk': 'uk-cyrl-ua',
  'zh': 'zh-hans-cn',
  'zh-gb': 'zh-hant-gb',
  'zh-us': 'zh-hant-us'
};

var regionMatchingLangs = ['az', 'bg', 'cs', 'de', 'es', 'fi', 'fr', 'hu', 'it', 'lt', 'lv', 'nl', 'pl', 'ro', 'ru'];

function getLikelySubtagsMin(loc) {
  if (likelySubtagsMin.hasOwnProperty(loc)) {
    return new Locale(likelySubtagsMin[loc]);
  }
  var locale = new Locale(loc);
  if (regionMatchingLangs.includes(locale.language)) {
    locale.region = locale.language;
    locale.string = locale.language + '-' + locale.region;
    return locale;
  }
  return null;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint no-magic-numbers: 0 */

var languageCodeRe = '([a-z]{2,3}|\\*)';
var scriptCodeRe = '(?:-([a-z]{4}|\\*))';
var regionCodeRe = '(?:-([a-z]{2}|\\*))';
var variantCodeRe = '(?:-([a-z]{3}|\\*))';

/**
 * Regular expression splitting locale id into four pieces:
 *
 * Example: `en-Latn-US-mac`
 *
 * language: en
 * script:   Latn
 * region:   US
 * variant:  mac
 *
 * It can also accept a range `*` character on any position.
 */
var localeRe = new RegExp('^' + languageCodeRe + scriptCodeRe + '?' + regionCodeRe + '?' + variantCodeRe + '?$', 'i');

var localeParts = ['language', 'script', 'region', 'variant'];

var Locale = function () {
  /**
   * Parses a locale id using the localeRe into an array with four elements.
   *
   * If the second argument `range` is set to true, it places range `*` char
   * in place of any missing piece.
   *
   * It also allows skipping the script section of the id, so `en-US` is
   * properly parsed as `en-*-US-*`.
   */
  function Locale(locale) {
    var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    classCallCheck(this, Locale);

    var result = localeRe.exec(locale.replace(/_/g, '-'));
    if (!result) {
      return;
    }

    var missing = range ? '*' : undefined;

    var language = result[1] || missing;
    var script = result[2] || missing;
    var region = result[3] || missing;
    var variant = result[4] || missing;

    this.language = language;
    this.script = script;
    this.region = region;
    this.variant = variant;
    this.string = locale;
  }

  createClass(Locale, [{
    key: 'isEqual',
    value: function isEqual(locale) {
      var _this = this;

      return localeParts.every(function (part) {
        return _this[part] === locale[part];
      });
    }
  }, {
    key: 'matches',
    value: function matches(locale) {
      var _this2 = this;

      return localeParts.every(function (part) {
        return _this2[part] === '*' || locale[part] === '*' || _this2[part] === undefined && locale[part] === undefined || _this2[part] !== undefined && locale[part] !== undefined && _this2[part].toLowerCase() === locale[part].toLowerCase();
      });
    }
  }, {
    key: 'setVariantRange',
    value: function setVariantRange() {
      this.variant = '*';
    }
  }, {
    key: 'setRegionRange',
    value: function setRegionRange() {
      this.region = '*';
    }
  }, {
    key: 'addLikelySubtags',
    value: function addLikelySubtags() {
      var _this3 = this;

      var newLocale = getLikelySubtagsMin(this.string.toLowerCase());

      if (newLocale) {
        localeParts.forEach(function (part) {
          return _this3[part] = newLocale[part];
        });
        this.string = newLocale.string;
        return true;
      }
      return false;
    }
  }]);
  return Locale;
}();

/* eslint no-magic-numbers: 0 */

/**
 * Negotiates the languages between the list of requested locales against
 * a list of available locales.
 *
 * The algorithm is based on the BCP4647 3.3.2 Extended Filtering algorithm,
 * with several modifications:
 *
 *  1) available locales are treated as ranges
 *
 *    This change allows us to match a more specific request against
 *    more generic available locale.
 *
 *    For example, if the available locale list provides locale `en`,
 *    and the requested locale is `en-US`, we treat the available locale as
 *    a locale that matches all possible english requests.
 *
 *    This means that we expect available locale ID to be as precize as
 *    the matches they want to cover.
 *
 *    For example, if there is only `sr` available, it's ok to list
 *    it in available locales. But once the available locales has both,
 *    Cyrl and Latn variants, the locale IDs should be `sr-Cyrl` and `sr-Latn`
 *    to avoid any `sr-*` request to match against whole `sr` range.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['en-US'] * ['en'] = ['en']
 *
 *  2) likely subtags from LDML 4.3 Likely Subtags has been added
 *
 *    The most obvious likely subtag that can be computed is a duplication
 *    of the language field onto region field (`fr` => `fr-FR`).
 *
 *    On top of that, likely subtags may use a list of mappings, that
 *    allow the algorithm to handle non-obvious matches.
 *    For example, making sure that we match `en` to `en-US` or `sr` to
 *    `sr-Cyrl`, while `sr-RU` to `sr-Latn-RU`.
 *
 *    This list can be taken directly from CLDR Supplemental Data.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['fr'] * ['fr-FR'] = ['fr-FR']
 *    ['en'] * ['en-US'] = ['en-US']
 *    ['sr'] * ['sr-Latn', 'sr-Cyrl'] = ['sr-Cyrl']
 *
 *  3) variant/region range check has been added
 *
 *    Lastly, the last form of check is against the requested locale ID
 *    but with the variant/region field replaced with a `*` range.
 *
 *    The rationale here laid out in LDML 4.4 Language Matching:
 *      "(...) normally the fall-off between the user's languages is
 *      substantially greated than regional variants."
 *
 *    In other words, if we can't match for the given region, maybe
 *    we can match for the same language/script but other region, and
 *    it will in most cases be preferred over falling back on the next
 *    language.
 *
 *    What it does ([requested] * [available] = [supported]):
 *
 *    ['en-AU'] * ['en-US'] = ['en-US']
 *    ['sr-RU'] * ['sr-Latn-RO'] = ['sr-Latn-RO'] // sr-RU -> sr-Latn-RU
 *
 *    It works similarly to getParentLocales algo, except that we stop
 *    after matching against variant/region ranges and don't try to match
 *    ignoring script ranges. That means that `sr-Cyrl` will never match
 *    against `sr-Latn`.
 */
function filterMatches(requestedLocales, availableLocales, strategy) {
  var supportedLocales = new Set();

  var availLocales = new Set(availableLocales.map(function (locale) {
    return new Locale(locale, true);
  }));

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    outer: for (var _iterator = requestedLocales[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var reqLocStr = _step.value;

      var reqLocStrLC = reqLocStr.toLowerCase();
      var requestedLocale = new Locale(reqLocStrLC);

      if (requestedLocale.language === undefined) {
        continue;
      }

      // Attempt to make an exact match
      // Example: `en-US` === `en-US`
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = availableLocales[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var availableLocale = _step2.value;

          if (reqLocStrLC === availableLocale.toLowerCase()) {
            supportedLocales.add(availableLocale);
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
              for (var _iterator7 = availLocales[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                var loc = _step7.value;

                if (loc.isEqual(requestedLocale)) {
                  availLocales.delete(loc);
                  break;
                }
              }
            } catch (err) {
              _didIteratorError7 = true;
              _iteratorError7 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                  _iterator7.return();
                }
              } finally {
                if (_didIteratorError7) {
                  throw _iteratorError7;
                }
              }
            }

            if (strategy === 'lookup') {
              return Array.from(supportedLocales);
            } else if (strategy === 'filtering') {
              continue;
            } else {
              continue outer;
            }
          }
        }

        // Attempt to match against the available range
        // This turns `en` into `en-*-*-*` and `en-US` into `en-*-US-*`
        // Example: ['en-US'] * ['en'] = ['en']
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = availLocales[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _availableLocale = _step3.value;

          if (requestedLocale.matches(_availableLocale)) {
            supportedLocales.add(_availableLocale.string);
            availLocales.delete(_availableLocale);
            if (strategy === 'lookup') {
              return Array.from(supportedLocales);
            } else if (strategy === 'filtering') {
              continue;
            } else {
              continue outer;
            }
          }
        }

        // Attempt to retrieve a maximal version of the requested locale ID
        // If data is available, it'll expand `en` into `en-Latn-US` and
        // `zh` into `zh-Hans-CN`.
        // Example: ['en'] * ['en-GB', 'en-US'] = ['en-US']
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (requestedLocale.addLikelySubtags()) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = availLocales[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _availableLocale2 = _step4.value;

            if (requestedLocale.matches(_availableLocale2)) {
              supportedLocales.add(_availableLocale2.string);
              availLocales.delete(_availableLocale2);
              if (strategy === 'lookup') {
                return Array.from(supportedLocales);
              } else if (strategy === 'filtering') {
                continue;
              } else {
                continue outer;
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      // Attempt to look up for a different variant for the same locale ID
      // Example: ['en-US-mac'] * ['en-US-win'] = ['en-US-win']
      requestedLocale.setVariantRange();

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = availLocales[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _availableLocale3 = _step5.value;

          if (requestedLocale.matches(_availableLocale3)) {
            supportedLocales.add(_availableLocale3.string);
            availLocales.delete(_availableLocale3);
            if (strategy === 'lookup') {
              return Array.from(supportedLocales);
            } else if (strategy === 'filtering') {
              continue;
            } else {
              continue outer;
            }
          }
        }

        // Attempt to look up for a different region for the same locale ID
        // Example: ['en-US'] * ['en-AU'] = ['en-AU']
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      requestedLocale.setRegionRange();

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = availLocales[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _availableLocale4 = _step6.value;

          if (requestedLocale.matches(_availableLocale4)) {
            supportedLocales.add(_availableLocale4.string);
            availLocales.delete(_availableLocale4);
            if (strategy === 'lookup') {
              return Array.from(supportedLocales);
            } else if (strategy === 'filtering') {
              continue;
            } else {
              continue outer;
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return Array.from(supportedLocales);
}

function GetOption(options, property, type, values, fallback) {
  var value = options[property];

  if (value !== undefined) {
    if (type === 'boolean') {
      value = new Boolean(value);
    } else if (type === 'string') {
      value = String(value);
    }

    if (values !== undefined && values.indexOf(value) === -1) {
      throw new Error('Invalid option value');
    }

    return value;
  }

  return fallback;
}

/**
 * Negotiates the languages between the list of requested locales against
 * a list of available locales.
 *
 * It accepts three arguments:
 *
 *   requestedLocales:
 *     an Array of strings with BCP47 locale IDs sorted
 *     according to user preferences.
 *
 *   availableLocales:
 *     an Array of strings with BCP47 locale IDs of locale for which
 *     resources are available. Unsorted.
 *
 *   options:
 *     An object with the following, optional keys:
 *
 *       strategy: 'filtering' (default) | 'matching' | 'lookup'
 *
 *       defaultLocale:
 *         a string with BCP47 locale ID to be used
 *         as a last resort locale.
 *
 *       likelySubtags:
 *         a key-value map of locale keys to their most expanded variants.
 *         For example:
 *           'en' -> 'en-Latn-US',
 *           'ru' -> 'ru-Cyrl-RU',
 *
 *
 * It returns an Array of strings with BCP47 locale IDs sorted according to the
 * user preferences.
 *
 * The exact list will be selected differently depending on the strategy:
 *
 *   'filtering': (default)
 *     In the filtering strategy, the algorithm will attempt to match
 *     as many keys in the available locales in order of the requested locales.
 *
 *   'matching':
 *     In the matching strategy, the algorithm will attempt to find the
 *     best possible match for each element of the requestedLocales list.
 *
 *   'lookup':
 *     In the lookup strategy, the algorithm will attempt to find a single
 *     best available locale based on the requested locales list.
 *
 *     This strategy requires defaultLocale option to be set.
 */
function negotiateLanguages(requestedLocales, availableLocales) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  var defaultLocale = GetOption(options, 'defaultLocale', 'string');
  var likelySubtags = GetOption(options, 'likelySubtags', 'object', undefined);
  var strategy = GetOption(options, 'strategy', 'string', ['filtering', 'matching', 'lookup'], 'filtering');

  if (strategy === 'lookup' && !defaultLocale) {
    throw new Error('defaultLocale cannot be undefined for strategy `lookup`');
  }

  var resolvedReqLoc = Array.from(Object(requestedLocales)).map(function (loc) {
    return String(loc);
  });
  var resolvedAvailLoc = Array.from(Object(availableLocales)).map(function (loc) {
    return String(loc);
  });

  var supportedLocales = filterMatches(resolvedReqLoc, resolvedAvailLoc, strategy, likelySubtags);

  if (strategy === 'lookup') {
    if (supportedLocales.length === 0) {
      supportedLocales.push(defaultLocale);
    }
  } else if (defaultLocale && !supportedLocales.includes(defaultLocale)) {
    supportedLocales.push(defaultLocale);
  }
  return supportedLocales;
}

/*
 * @module fluent-langneg
 * @overview
 *
 * `fluent-langneg` provides language negotiation API that fits into
 * Project Fluent localization composition and fallbacking strategy.
 *
 */

/*  eslint no-magic-numbers: [0]  */

var MAX_PLACEABLES = 100;

var entryIdentifierRe = new RegExp('-?[a-zA-Z][a-zA-Z0-9_-]*', 'y');
var identifierRe = new RegExp('[a-zA-Z][a-zA-Z0-9_-]*', 'y');
var functionIdentifierRe = /^[A-Z][A-Z_?-]*$/;

/**
 * The `Parser` class is responsible for parsing FTL resources.
 *
 * It's only public method is `getResource(source)` which takes an FTL string
 * and returns a two element Array with an Object of entries generated from the
 * source as the first element and an array of SyntaxError objects as the
 * second.
 *
 * This parser is optimized for runtime performance.
 *
 * There is an equivalent of this parser in syntax/parser which is
 * generating full AST which is useful for FTL tools.
 */

var RuntimeParser = function () {
  function RuntimeParser() {
    classCallCheck(this, RuntimeParser);
  }

  createClass(RuntimeParser, [{
    key: 'getResource',

    /**
     * Parse FTL code into entries formattable by the MessageContext.
     *
     * Given a string of FTL syntax, return a map of entries that can be passed
     * to MessageContext.format and a list of errors encountered during parsing.
     *
     * @param {String} string
     * @returns {Array<Object, Array>}
     */
    value: function getResource(string) {
      this._source = string;
      this._index = 0;
      this._length = string.length;
      this.entries = {};

      var errors = [];

      this.skipWS();
      while (this._index < this._length) {
        try {
          this.getEntry();
        } catch (e) {
          if (e instanceof SyntaxError) {
            errors.push(e);

            this.skipToNextEntryStart();
          } else {
            throw e;
          }
        }
        this.skipWS();
      }

      return [this.entries, errors];
    }

    /**
     * Parse the source string from the current index as an FTL entry
     * and add it to object's entries property.
     *
     * @private
     */

  }, {
    key: 'getEntry',
    value: function getEntry() {
      // The index here should either be at the beginning of the file
      // or right after new line.
      if (this._index !== 0 && this._source[this._index - 1] !== '\n') {
        throw this.error('Expected an entry to start\n        at the beginning of the file or on a new line.');
      }

      var ch = this._source[this._index];

      // We don't care about comments or sections at runtime
      if (ch === '/' || ch === '#' && [' ', '#', '\n'].includes(this._source[this._index + 1])) {
        this.skipComment();
        return;
      }

      if (ch === '[') {
        this.skipSection();
        return;
      }

      this.getMessage();
    }

    /**
     * Skip the section entry from the current index.
     *
     * @private
     */

  }, {
    key: 'skipSection',
    value: function skipSection() {
      this._index += 1;
      if (this._source[this._index] !== '[') {
        throw this.error('Expected "[[" to open a section');
      }

      this._index += 1;

      this.skipInlineWS();
      this.getVariantName();
      this.skipInlineWS();

      if (this._source[this._index] !== ']' || this._source[this._index + 1] !== ']') {
        throw this.error('Expected "]]" to close a section');
      }

      this._index += 2;
    }

    /**
     * Parse the source string from the current index as an FTL message
     * and add it to the entries property on the Parser.
     *
     * @private
     */

  }, {
    key: 'getMessage',
    value: function getMessage() {
      var id = this.getEntryIdentifier();

      this.skipInlineWS();

      if (this._source[this._index] === '=') {
        this._index++;
      }

      this.skipInlineWS();

      var val = this.getPattern();

      if (id.startsWith('-') && val === null) {
        throw this.error('Expected term to have a value');
      }

      var attrs = null;

      if (this._source[this._index] === ' ') {
        var lineStart = this._index;
        this.skipInlineWS();

        if (this._source[this._index] === '.') {
          this._index = lineStart;
          attrs = this.getAttributes();
        }
      }

      if (attrs === null && typeof val === 'string') {
        this.entries[id] = val;
      } else {
        if (val === null && attrs === null) {
          throw this.error('Expected message to have a value or attributes');
        }

        this.entries[id] = {};

        if (val !== null) {
          this.entries[id].val = val;
        }

        if (attrs !== null) {
          this.entries[id].attrs = attrs;
        }
      }
    }

    /**
     * Skip whitespace.
     *
     * @private
     */

  }, {
    key: 'skipWS',
    value: function skipWS() {
      var ch = this._source[this._index];
      while (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r') {
        ch = this._source[++this._index];
      }
    }

    /**
     * Skip inline whitespace (space and \t).
     *
     * @private
     */

  }, {
    key: 'skipInlineWS',
    value: function skipInlineWS() {
      var ch = this._source[this._index];
      while (ch === ' ' || ch === '\t') {
        ch = this._source[++this._index];
      }
    }

    /**
     * Skip blank lines.
     *
     * @private
     */

  }, {
    key: 'skipBlankLines',
    value: function skipBlankLines() {
      while (true) {
        var ptr = this._index;

        this.skipInlineWS();

        if (this._source[this._index] === '\n') {
          this._index += 1;
        } else {
          this._index = ptr;
          break;
        }
      }
    }

    /**
     * Get identifier using the provided regex.
     *
     * By default this will get identifiers of public messages, attributes and
     * external arguments (without the $).
     *
     * @returns {String}
     * @private
     */

  }, {
    key: 'getIdentifier',
    value: function getIdentifier() {
      var re = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identifierRe;

      re.lastIndex = this._index;
      var result = re.exec(this._source);

      if (result === null) {
        this._index += 1;
        throw this.error('Expected an identifier [' + re.toString() + ']');
      }

      this._index = re.lastIndex;
      return result[0];
    }

    /**
     * Get identifier of a Message or a Term (staring with a dash).
     *
     * @returns {String}
     * @private
     */

  }, {
    key: 'getEntryIdentifier',
    value: function getEntryIdentifier() {
      return this.getIdentifier(entryIdentifierRe);
    }

    /**
     * Get Variant name.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getVariantName',
    value: function getVariantName() {
      var name = '';

      var start = this._index;
      var cc = this._source.charCodeAt(this._index);

      if (cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc === 95 || cc === 32) {
        // _ <space>
        cc = this._source.charCodeAt(++this._index);
      } else {
        throw this.error('Expected a keyword (starting with [a-zA-Z_])');
      }

      while (cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc >= 48 && cc <= 57 || // 0-9
      cc === 95 || cc === 45 || cc === 32) {
        // _- <space>
        cc = this._source.charCodeAt(++this._index);
      }

      // If we encountered the end of name, we want to test if the last
      // collected character is a space.
      // If it is, we will backtrack to the last non-space character because
      // the keyword cannot end with a space character.
      while (this._source.charCodeAt(this._index - 1) === 32) {
        this._index--;
      }

      name += this._source.slice(start, this._index);

      return { type: 'varname', name: name };
    }

    /**
     * Get simple string argument enclosed in `"`.
     *
     * @returns {String}
     * @private
     */

  }, {
    key: 'getString',
    value: function getString() {
      var start = this._index + 1;

      while (++this._index < this._length) {
        var ch = this._source[this._index];

        if (ch === '"') {
          break;
        }

        if (ch === '\n') {
          throw this.error('Unterminated string expression');
        }
      }

      return this._source.substring(start, this._index++);
    }

    /**
     * Parses a Message pattern.
     * Message Pattern may be a simple string or an array of strings
     * and placeable expressions.
     *
     * @returns {String|Array}
     * @private
     */

  }, {
    key: 'getPattern',
    value: function getPattern() {
      // We're going to first try to see if the pattern is simple.
      // If it is we can just look for the end of the line and read the string.
      //
      // Then, if either the line contains a placeable opening `{` or the
      // next line starts an indentation, we switch to complex pattern.
      var start = this._index;
      var eol = this._source.indexOf('\n', this._index);

      if (eol === -1) {
        eol = this._length;
      }

      var firstLineContent = start !== eol ? this._source.slice(start, eol) : null;

      if (firstLineContent && firstLineContent.includes('{')) {
        return this.getComplexPattern();
      }

      this._index = eol + 1;

      this.skipBlankLines();

      if (this._source[this._index] !== ' ') {
        // No indentation means we're done with this message. Callers should check
        // if the return value here is null. It may be OK for messages, but not OK
        // for terms, attributes and variants.
        return firstLineContent;
      }

      var lineStart = this._index;

      this.skipInlineWS();

      if (this._source[this._index] === '.') {
        // The pattern is followed by an attribute. Rewind _index to the first
        // column of the current line as expected by getAttributes.
        this._index = lineStart;
        return firstLineContent;
      }

      if (firstLineContent) {
        // It's a multiline pattern which started on the same line as the
        // identifier. Reparse the whole pattern to make sure we get all of it.
        this._index = start;
      }

      return this.getComplexPattern();
    }

    /**
     * Parses a complex Message pattern.
     * This function is called by getPattern when the message is multiline,
     * or contains escape chars or placeables.
     * It does full parsing of complex patterns.
     *
     * @returns {Array}
     * @private
     */
    /* eslint-disable complexity */

  }, {
    key: 'getComplexPattern',
    value: function getComplexPattern() {
      var buffer = '';
      var content = [];
      var placeables = 0;

      var ch = this._source[this._index];

      while (this._index < this._length) {
        // This block handles multi-line strings combining strings separated
        // by new line.
        if (ch === '\n') {
          this._index++;

          // We want to capture the start and end pointers
          // around blank lines and add them to the buffer
          // but only if the blank lines are in the middle
          // of the string.
          var blankLinesStart = this._index;
          this.skipBlankLines();
          var blankLinesEnd = this._index;

          if (this._source[this._index] !== ' ') {
            break;
          }
          this.skipInlineWS();

          if (this._source[this._index] === '}' || this._source[this._index] === '[' || this._source[this._index] === '*' || this._source[this._index] === '.') {
            this._index = blankLinesEnd;
            break;
          }

          buffer += this._source.substring(blankLinesStart, blankLinesEnd);

          if (buffer.length || content.length) {
            buffer += '\n';
          }
          ch = this._source[this._index];
          continue;
        } else if (ch === '\\') {
          var ch2 = this._source[this._index + 1];
          if (ch2 === '"' || ch2 === '{' || ch2 === '\\') {
            ch = ch2;
            this._index++;
          }
        } else if (ch === '{') {
          // Push the buffer to content array right before placeable
          if (buffer.length) {
            content.push(buffer);
          }
          if (placeables > MAX_PLACEABLES - 1) {
            throw this.error('Too many placeables, maximum allowed is ' + MAX_PLACEABLES);
          }
          buffer = '';
          content.push(this.getPlaceable());

          this._index++;

          ch = this._source[this._index];
          placeables++;
          continue;
        }

        if (ch) {
          buffer += ch;
        }
        this._index++;
        ch = this._source[this._index];
      }

      if (content.length === 0) {
        return buffer.length ? buffer : null;
      }

      if (buffer.length) {
        content.push(buffer);
      }

      return content;
    }
    /* eslint-enable complexity */

    /**
     * Parses a single placeable in a Message pattern and returns its
     * expression.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getPlaceable',
    value: function getPlaceable() {
      var start = ++this._index;

      this.skipWS();

      if (this._source[this._index] === '*' || this._source[this._index] === '[' && this._source[this._index + 1] !== ']') {
        var _variants = this.getVariants();

        return {
          type: 'sel',
          exp: null,
          vars: _variants[0],
          def: _variants[1]
        };
      }

      // Rewind the index and only support in-line white-space now.
      this._index = start;
      this.skipInlineWS();

      var selector = this.getSelectorExpression();

      this.skipWS();

      var ch = this._source[this._index];

      if (ch === '}') {
        if (selector.type === 'attr' && selector.id.name.startsWith('-')) {
          throw this.error('Attributes of private messages cannot be interpolated.');
        }

        return selector;
      }

      if (ch !== '-' || this._source[this._index + 1] !== '>') {
        throw this.error('Expected "}" or "->"');
      }

      if (selector.type === 'ref') {
        throw this.error('Message references cannot be used as selectors.');
      }

      if (selector.type === 'var') {
        throw this.error('Variants cannot be used as selectors.');
      }

      if (selector.type === 'attr' && !selector.id.name.startsWith('-')) {
        throw this.error('Attributes of public messages cannot be used as selectors.');
      }

      this._index += 2; // ->

      this.skipInlineWS();

      if (this._source[this._index] !== '\n') {
        throw this.error('Variants should be listed in a new line');
      }

      this.skipWS();

      var variants = this.getVariants();

      if (variants[0].length === 0) {
        throw this.error('Expected members for the select expression');
      }

      return {
        type: 'sel',
        exp: selector,
        vars: variants[0],
        def: variants[1]
      };
    }

    /**
     * Parses a selector expression.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getSelectorExpression',
    value: function getSelectorExpression() {
      var literal = this.getLiteral();

      if (literal.type !== 'ref') {
        return literal;
      }

      if (this._source[this._index] === '.') {
        this._index++;

        var name = this.getIdentifier();
        this._index++;
        return {
          type: 'attr',
          id: literal,
          name: name
        };
      }

      if (this._source[this._index] === '[') {
        this._index++;

        var key = this.getVariantKey();
        this._index++;
        return {
          type: 'var',
          id: literal,
          key: key
        };
      }

      if (this._source[this._index] === '(') {
        this._index++;
        var args = this.getCallArgs();

        if (!functionIdentifierRe.test(literal.name)) {
          throw this.error('Function names must be all upper-case');
        }

        this._index++;

        literal.type = 'fun';

        return {
          type: 'call',
          fun: literal,
          args: args
        };
      }

      return literal;
    }

    /**
     * Parses call arguments for a CallExpression.
     *
     * @returns {Array}
     * @private
     */

  }, {
    key: 'getCallArgs',
    value: function getCallArgs() {
      var args = [];

      while (this._index < this._length) {
        this.skipInlineWS();

        if (this._source[this._index] === ')') {
          return args;
        }

        var exp = this.getSelectorExpression();

        // MessageReference in this place may be an entity reference, like:
        // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
        if (exp.type !== 'ref') {
          args.push(exp);
        } else {
          this.skipInlineWS();

          if (this._source[this._index] === ':') {
            this._index++;
            this.skipInlineWS();

            var val = this.getSelectorExpression();

            // If the expression returned as a value of the argument
            // is not a quote delimited string or number, throw.
            //
            // We don't have to check here if the pattern is quote delimited
            // because that's the only type of string allowed in expressions.
            if (typeof val === 'string' || Array.isArray(val) || val.type === 'num') {
              args.push({
                type: 'narg',
                name: exp.name,
                val: val
              });
            } else {
              this._index = this._source.lastIndexOf(':', this._index) + 1;
              throw this.error('Expected string in quotes, number.');
            }
          } else {
            args.push(exp);
          }
        }

        this.skipInlineWS();

        if (this._source[this._index] === ')') {
          break;
        } else if (this._source[this._index] === ',') {
          this._index++;
        } else {
          throw this.error('Expected "," or ")"');
        }
      }

      return args;
    }

    /**
     * Parses an FTL Number.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getNumber',
    value: function getNumber() {
      var num = '';
      var cc = this._source.charCodeAt(this._index);

      // The number literal may start with negative sign `-`.
      if (cc === 45) {
        num += '-';
        cc = this._source.charCodeAt(++this._index);
      }

      // next, we expect at least one digit
      if (cc < 48 || cc > 57) {
        throw this.error('Unknown literal "' + num + '"');
      }

      // followed by potentially more digits
      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }

      // followed by an optional decimal separator `.`
      if (cc === 46) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);

        // followed by at least one digit
        if (cc < 48 || cc > 57) {
          throw this.error('Unknown literal "' + num + '"');
        }

        // and optionally more digits
        while (cc >= 48 && cc <= 57) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);
        }
      }

      return {
        type: 'num',
        val: num
      };
    }

    /**
     * Parses a list of Message attributes.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      var attrs = {};

      while (this._index < this._length) {
        if (this._source[this._index] !== ' ') {
          break;
        }
        this.skipInlineWS();

        if (this._source[this._index] !== '.') {
          break;
        }
        this._index++;

        var key = this.getIdentifier();

        this.skipInlineWS();

        if (this._source[this._index] !== '=') {
          throw this.error('Expected "="');
        }
        this._index++;

        this.skipInlineWS();

        var val = this.getPattern();

        if (val === null) {
          throw this.error('Expected attribute to have a value');
        }

        if (typeof val === 'string') {
          attrs[key] = val;
        } else {
          attrs[key] = {
            val: val
          };
        }

        this.skipBlankLines();
      }

      return attrs;
    }

    /**
     * Parses a list of Selector variants.
     *
     * @returns {Array}
     * @private
     */

  }, {
    key: 'getVariants',
    value: function getVariants() {
      var variants = [];
      var index = 0;
      var defaultIndex = void 0;

      while (this._index < this._length) {
        var ch = this._source[this._index];

        if ((ch !== '[' || this._source[this._index + 1] === '[') && ch !== '*') {
          break;
        }
        if (ch === '*') {
          this._index++;
          defaultIndex = index;
        }

        if (this._source[this._index] !== '[') {
          throw this.error('Expected "["');
        }

        this._index++;

        var key = this.getVariantKey();

        this.skipInlineWS();

        var val = this.getPattern();

        if (val === null) {
          throw this.error('Expected variant to have a value');
        }

        variants[index++] = { key: key, val: val };

        this.skipWS();
      }

      return [variants, defaultIndex];
    }

    /**
     * Parses a Variant key.
     *
     * @returns {String}
     * @private
     */

  }, {
    key: 'getVariantKey',
    value: function getVariantKey() {
      // VariantKey may be a Keyword or Number

      var cc = this._source.charCodeAt(this._index);
      var literal = void 0;

      if (cc >= 48 && cc <= 57 || cc === 45) {
        literal = this.getNumber();
      } else {
        literal = this.getVariantName();
      }

      if (this._source[this._index] !== ']') {
        throw this.error('Expected "]"');
      }

      this._index++;
      return literal;
    }

    /**
     * Parses an FTL literal.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: 'getLiteral',
    value: function getLiteral() {
      var cc0 = this._source.charCodeAt(this._index);

      if (cc0 === 36) {
        // $
        this._index++;
        return {
          type: 'ext',
          name: this.getIdentifier()
        };
      }

      var cc1 = cc0 === 45 // -
      // Peek at the next character after the dash.
      ? this._source.charCodeAt(this._index + 1)
      // Or keep using the character at the current index.
      : cc0;

      if (cc1 >= 97 && cc1 <= 122 || // a-z
      cc1 >= 65 && cc1 <= 90) {
        // A-Z
        return {
          type: 'ref',
          name: this.getEntryIdentifier()
        };
      }

      if (cc1 >= 48 && cc1 <= 57) {
        // 0-9
        return this.getNumber();
      }

      if (cc0 === 34) {
        // "
        return this.getString();
      }

      throw this.error('Expected literal');
    }

    /**
     * Skips an FTL comment.
     *
     * @private
     */

  }, {
    key: 'skipComment',
    value: function skipComment() {
      // At runtime, we don't care about comments so we just have
      // to parse them properly and skip their content.
      var eol = this._source.indexOf('\n', this._index);

      while (eol !== -1 && (this._source[eol + 1] === '/' && this._source[eol + 2] === '/' || this._source[eol + 1] === '#' && [' ', '#'].includes(this._source[eol + 2]))) {
        this._index = eol + 3;

        eol = this._source.indexOf('\n', this._index);

        if (eol === -1) {
          break;
        }
      }

      if (eol === -1) {
        this._index = this._length;
      } else {
        this._index = eol + 1;
      }
    }

    /**
     * Creates a new SyntaxError object with a given message.
     *
     * @param {String} message
     * @returns {Object}
     * @private
     */

  }, {
    key: 'error',
    value: function error(message) {
      return new SyntaxError(message);
    }

    /**
     * Skips to the beginning of a next entry after the current position.
     * This is used to mark the boundary of junk entry in case of error,
     * and recover from the returned position.
     *
     * @private
     */

  }, {
    key: 'skipToNextEntryStart',
    value: function skipToNextEntryStart() {
      var start = this._index;

      while (true) {
        if (start === 0 || this._source[start - 1] === '\n') {
          var cc = this._source.charCodeAt(start);

          if (cc >= 97 && cc <= 122 || // a-z
          cc >= 65 && cc <= 90 || // A-Z
          cc === 47 || cc === 91) {
            // /[
            this._index = start;
            return;
          }
        }

        start = this._source.indexOf('\n', start);

        if (start === -1) {
          this._index = this._length;
          return;
        }
        start++;
      }
    }
  }]);
  return RuntimeParser;
}();

/**
 * Parses an FTL string using RuntimeParser and returns the generated
 * object with entries and a list of errors.
 *
 * @param {String} string
 * @returns {Array<Object, Array>}
 */


function parse(string) {
  var parser = new RuntimeParser();
  return parser.getResource(string);
}

/* global Intl */

/**
 * The `FluentType` class is the base of Fluent's type system.
 *
 * Fluent types wrap JavaScript values and store additional configuration for
 * them, which can then be used in the `valueOf` method together with a proper
 * `Intl` formatter.
 */
var FluentType = function () {

  /**
   * Create an `FluentType` instance.
   *
   * @param   {Any}    value - JavaScript value to wrap.
   * @param   {Object} opts  - Configuration.
   * @returns {FluentType}
   */
  function FluentType(value, opts) {
    classCallCheck(this, FluentType);

    this.value = value;
    this.opts = opts;
  }

  /**
   * Unwrap the instance of `FluentType`.
   *
   * Unwrapped values are suitable for use outside of the `MessageContext`.
   * This method can use `Intl` formatters memoized by the `MessageContext`
   * instance passed as an argument.
   *
   * In most cases, valueOf returns a string, but it can be overriden
   * and there are use cases, where the return type is not a string.
   *
   * An example is fluent-react which implements a custom `FluentType`
   * to represent React elements passed as arguments to format().
   *
   * @param   {MessageContext} [ctx]
   * @returns {string}
   */


  createClass(FluentType, [{
    key: 'valueOf',
    value: function valueOf() {
      throw new Error('Subclasses of FluentType must implement valueOf.');
    }

    /**
     * Internal field used for detecting instances of FluentType.
     *
     * @private
     */

  }, {
    key: '$$typeof',
    get: function get$$1() {
      return Symbol.for('FluentType');
    }

    /**
     * Check if a value is an instance of FluentType.
     *
     * In some build/transpilation setups instanceof is unreliable for detecting
     * subclasses of FluentType. Instead, FluentType.isTypeOf uses the $$typeof
     * field and the FluentType Symbol to determine the type of the argument.
     *
     * @param {Any} obj - The value to check the type of.
     * @returns {bool}
     */

  }], [{
    key: 'isTypeOf',
    value: function isTypeOf(obj) {
      // The best-case scenario: the bundler didn't break the identity of
      // FluentType.
      if (obj instanceof FluentType) {
        return true;
      }

      // Discard all primitive values, Object.prototype, and Object.create(null)
      // which by definition cannot be instances of FluentType. Then check the
      // value of the custom $$typeof field defined by the base FluentType class.
      return obj instanceof Object && obj.$$typeof === Symbol.for('FluentType');
    }
  }]);
  return FluentType;
}();

var FluentNone = function (_FluentType) {
  inherits(FluentNone, _FluentType);

  function FluentNone() {
    classCallCheck(this, FluentNone);
    return possibleConstructorReturn(this, (FluentNone.__proto__ || Object.getPrototypeOf(FluentNone)).apply(this, arguments));
  }

  createClass(FluentNone, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.value || '???';
    }
  }]);
  return FluentNone;
}(FluentType);

var FluentNumber = function (_FluentType2) {
  inherits(FluentNumber, _FluentType2);

  function FluentNumber(value, opts) {
    classCallCheck(this, FluentNumber);
    return possibleConstructorReturn(this, (FluentNumber.__proto__ || Object.getPrototypeOf(FluentNumber)).call(this, parseFloat(value), opts));
  }

  createClass(FluentNumber, [{
    key: 'valueOf',
    value: function valueOf(ctx) {
      try {
        var nf = ctx._memoizeIntlObject(Intl.NumberFormat, this.opts);
        return nf.format(this.value);
      } catch (e) {
        // XXX Report the error.
        return this.value;
      }
    }

    /**
     * Compare the object with another instance of a FluentType.
     *
     * @param   {MessageContext} ctx
     * @param   {FluentType}     other
     * @returns {bool}
     */

  }, {
    key: 'match',
    value: function match(ctx, other) {
      if (other instanceof FluentNumber) {
        return this.value === other.value;
      }
      return false;
    }
  }]);
  return FluentNumber;
}(FluentType);

var FluentDateTime = function (_FluentType3) {
  inherits(FluentDateTime, _FluentType3);

  function FluentDateTime(value, opts) {
    classCallCheck(this, FluentDateTime);
    return possibleConstructorReturn(this, (FluentDateTime.__proto__ || Object.getPrototypeOf(FluentDateTime)).call(this, new Date(value), opts));
  }

  createClass(FluentDateTime, [{
    key: 'valueOf',
    value: function valueOf(ctx) {
      try {
        var dtf = ctx._memoizeIntlObject(Intl.DateTimeFormat, this.opts);
        return dtf.format(this.value);
      } catch (e) {
        // XXX Report the error.
        return this.value;
      }
    }
  }]);
  return FluentDateTime;
}(FluentType);

var FluentSymbol = function (_FluentType4) {
  inherits(FluentSymbol, _FluentType4);

  function FluentSymbol() {
    classCallCheck(this, FluentSymbol);
    return possibleConstructorReturn(this, (FluentSymbol.__proto__ || Object.getPrototypeOf(FluentSymbol)).apply(this, arguments));
  }

  createClass(FluentSymbol, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.value;
    }

    /**
     * Compare the object with another instance of a FluentType.
     *
     * @param   {MessageContext} ctx
     * @param   {FluentType}     other
     * @returns {bool}
     */

  }, {
    key: 'match',
    value: function match(ctx, other) {
      if (other instanceof FluentSymbol) {
        return this.value === other.value;
      } else if (typeof other === 'string') {
        return this.value === other;
      } else if (other instanceof FluentNumber) {
        var pr = ctx._memoizeIntlObject(Intl.PluralRules, other.opts);
        return this.value === pr.select(other.value);
      } else if (Array.isArray(other)) {
        var values = other.map(function (symbol) {
          return symbol.value;
        });
        return values.includes(this.value);
      }
      return false;
    }
  }]);
  return FluentSymbol;
}(FluentType);

/**
 * @overview
 *
 * The FTL resolver ships with a number of functions built-in.
 *
 * Each function take two arguments:
 *   - args - an array of positional args
 *   - opts - an object of key-value args
 *
 * Arguments to functions are guaranteed to already be instances of
 * `FluentType`.  Functions must return `FluentType` objects as well.
 */

var builtins = {
  'NUMBER': function NUMBER(_ref, opts) {
    var _ref2 = slicedToArray(_ref, 1),
        arg = _ref2[0];

    return new FluentNumber(value(arg), merge(arg.opts, opts));
  },
  'DATETIME': function DATETIME(_ref3, opts) {
    var _ref4 = slicedToArray(_ref3, 1),
        arg = _ref4[0];

    return new FluentDateTime(value(arg), merge(arg.opts, opts));
  }
};

function merge(argopts, opts) {
  return Object.assign({}, argopts, values(opts));
}

function values(opts) {
  var unwrapped = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(opts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref5 = _step.value;

      var _ref6 = slicedToArray(_ref5, 2);

      var name = _ref6[0];
      var opt = _ref6[1];

      unwrapped[name] = value(opt);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return unwrapped;
}

function value(arg) {
  // StringExpression-typed options are parsed as regular strings by the
  // runtime parser and are not converted to a FluentType by the resolver.
  // They don't have the "value" property; they are the value.
  return typeof arg === 'string' ? arg : arg.value;
}

/**
 * @overview
 *
 * The role of the Fluent resolver is to format a translation object to an
 * instance of `FluentType` or an array of instances.
 *
 * Translations can contain references to other messages or external arguments,
 * conditional logic in form of select expressions, traits which describe their
 * grammatical features, and can use Fluent builtins which make use of the
 * `Intl` formatters to format numbers, dates, lists and more into the
 * context's language.  See the documentation of the Fluent syntax for more
 * information.
 *
 * In case of errors the resolver will try to salvage as much of the
 * translation as possible.  In rare situations where the resolver didn't know
 * how to recover from an error it will return an instance of `FluentNone`.
 *
 * `MessageReference`, `VariantExpression`, `AttributeExpression` and
 * `SelectExpression` resolve to raw Runtime Entries objects and the result of
 * the resolution needs to be passed into `Type` to get their real value.
 * This is useful for composing expressions.  Consider:
 *
 *     brand-name[nominative]
 *
 * which is a `VariantExpression` with properties `id: MessageReference` and
 * `key: Keyword`.  If `MessageReference` was resolved eagerly, it would
 * instantly resolve to the value of the `brand-name` message.  Instead, we
 * want to get the message object and look for its `nominative` variant.
 *
 * All other expressions (except for `FunctionReference` which is only used in
 * `CallExpression`) resolve to an instance of `FluentType`.  The caller should
 * use the `valueOf` method to convert the instance to a native value.
 *
 *
 * All functions in this file pass around a special object called `env`.
 * This object stores a set of elements used by all resolve functions:
 *
 *  * {MessageContext} ctx
 *      context for which the given resolution is happening
 *  * {Object} args
 *      list of developer provided arguments that can be used
 *  * {Array} errors
 *      list of errors collected while resolving
 *  * {WeakSet} dirty
 *      Set of patterns already encountered during this resolution.
 *      This is used to prevent cyclic resolutions.
 */

// Prevent expansion of too long placeables.
var MAX_PLACEABLE_LENGTH = 2500;

// Unicode bidi isolation characters.
var FSI = '\u2068';
var PDI = '\u2069';

/**
 * Helper for computing the total character length of a placeable.
 *
 * Used in Pattern.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Array}  parts
 *    List of parts of a placeable.
 * @returns {Number}
 * @private
 */
function PlaceableLength(env, parts) {
  var ctx = env.ctx;

  return parts.reduce(function (sum, part) {
    return sum + part.valueOf(ctx).length;
  }, 0);
}

/**
 * Helper for choosing the default value from a set of members.
 *
 * Used in SelectExpressions and Type.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} members
 *    Hash map of variants from which the default value is to be selected.
 * @param   {Number} def
 *    The index of the default variant.
 * @returns {FluentType}
 * @private
 */
function DefaultMember(env, members, def) {
  if (members[def]) {
    return members[def];
  }

  var errors = env.errors;

  errors.push(new RangeError('No default'));
  return new FluentNone();
}

/**
 * Resolve a reference to another message.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} id
 *    The identifier of the message to be resolved.
 * @param   {String} id.name
 *    The name of the identifier.
 * @returns {FluentType}
 * @private
 */
function MessageReference(env, _ref) {
  var name = _ref.name;
  var ctx = env.ctx,
      errors = env.errors;

  var message = name.startsWith('-') ? ctx._terms.get(name) : ctx._messages.get(name);

  if (!message) {
    var err = name.startsWith('-') ? new ReferenceError('Unknown term: ' + name) : new ReferenceError('Unknown message: ' + name);
    errors.push(err);
    return new FluentNone(name);
  }

  return message;
}

/**
 * Resolve a variant expression to the variant object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {Object} expr.id
 *    An Identifier of a message for which the variant is resolved.
 * @param   {Object} expr.id.name
 *    Name a message for which the variant is resolved.
 * @param   {Object} expr.key
 *    Variant key to be resolved.
 * @returns {FluentType}
 * @private
 */
function VariantExpression(env, _ref2) {
  var id = _ref2.id,
      key = _ref2.key;

  var message = MessageReference(env, id);
  if (message instanceof FluentNone) {
    return message;
  }

  var ctx = env.ctx,
      errors = env.errors;

  var keyword = Type(env, key);

  function isVariantList(node) {
    return Array.isArray(node) && node[0].type === 'sel' && node[0].exp === null;
  }

  if (isVariantList(message.val)) {
    // Match the specified key against keys of each variant, in order.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = message.val[0].vars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var variant = _step.value;

        var variantKey = Type(env, variant.key);
        if (keyword.match(ctx, variantKey)) {
          return variant;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  errors.push(new ReferenceError('Unknown variant: ' + keyword.valueOf(ctx)));
  return Type(env, message);
}

/**
 * Resolve an attribute expression to the attribute object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.id
 *    An ID of a message for which the attribute is resolved.
 * @param   {String} expr.name
 *    Name of the attribute to be resolved.
 * @returns {FluentType}
 * @private
 */
function AttributeExpression(env, _ref3) {
  var id = _ref3.id,
      name = _ref3.name;

  var message = MessageReference(env, id);
  if (message instanceof FluentNone) {
    return message;
  }

  if (message.attrs) {
    // Match the specified name against keys of each attribute.
    for (var attrName in message.attrs) {
      if (name === attrName) {
        return message.attrs[name];
      }
    }
  }

  var errors = env.errors;

  errors.push(new ReferenceError('Unknown attribute: ' + name));
  return Type(env, message);
}

/**
 * Resolve a select expression to the member object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.exp
 *    Selector expression
 * @param   {Array} expr.vars
 *    List of variants for the select expression.
 * @param   {Number} expr.def
 *    Index of the default variant.
 * @returns {FluentType}
 * @private
 */
function SelectExpression(env, _ref4) {
  var exp = _ref4.exp,
      vars = _ref4.vars,
      def = _ref4.def;

  if (exp === null) {
    return DefaultMember(env, vars, def);
  }

  var selector = Type(env, exp);
  if (selector instanceof FluentNone) {
    return DefaultMember(env, vars, def);
  }

  // Match the selector against keys of each variant, in order.
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = vars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var variant = _step2.value;

      var key = Type(env, variant.key);
      var keyCanMatch = key instanceof FluentNumber || key instanceof FluentSymbol;

      if (!keyCanMatch) {
        continue;
      }

      var ctx = env.ctx;


      if (key.match(ctx, selector)) {
        return variant;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return DefaultMember(env, vars, def);
}

/**
 * Resolve expression to a Fluent type.
 *
 * JavaScript strings are a special case.  Since they natively have the
 * `valueOf` method they can be used as if they were a Fluent type without
 * paying the cost of creating a instance of one.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression object to be resolved into a Fluent type.
 * @returns {FluentType}
 * @private
 */
function Type(env, expr) {
  // A fast-path for strings which are the most common case, and for
  // `FluentNone` which doesn't require any additional logic.
  if (typeof expr === 'string' || expr instanceof FluentNone) {
    return expr;
  }

  // The Runtime AST (Entries) encodes patterns (complex strings with
  // placeables) as Arrays.
  if (Array.isArray(expr)) {
    return Pattern(env, expr);
  }

  switch (expr.type) {
    case 'varname':
      return new FluentSymbol(expr.name);
    case 'num':
      return new FluentNumber(expr.val);
    case 'ext':
      return ExternalArgument(env, expr);
    case 'fun':
      return FunctionReference(env, expr);
    case 'call':
      return CallExpression(env, expr);
    case 'ref':
      {
        var message = MessageReference(env, expr);
        return Type(env, message);
      }
    case 'attr':
      {
        var attr = AttributeExpression(env, expr);
        return Type(env, attr);
      }
    case 'var':
      {
        var variant = VariantExpression(env, expr);
        return Type(env, variant);
      }
    case 'sel':
      {
        var member = SelectExpression(env, expr);
        return Type(env, member);
      }
    case undefined:
      {
        // If it's a node with a value, resolve the value.
        if (expr.val !== null && expr.val !== undefined) {
          return Type(env, expr.val);
        }

        var errors = env.errors;

        errors.push(new RangeError('No value'));
        return new FluentNone();
      }
    default:
      return new FluentNone();
  }
}

/**
 * Resolve a reference to an external argument.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.name
 *    Name of an argument to be returned.
 * @returns {FluentType}
 * @private
 */
function ExternalArgument(env, _ref5) {
  var name = _ref5.name;
  var args = env.args,
      errors = env.errors;


  if (!args || !args.hasOwnProperty(name)) {
    errors.push(new ReferenceError('Unknown external: ' + name));
    return new FluentNone(name);
  }

  var arg = args[name];

  // Return early if the argument already is an instance of FluentType.
  if (FluentType.isTypeOf(arg)) {
    return arg;
  }

  // Convert the argument to a Fluent type.
  switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
    case 'string':
      return arg;
    case 'number':
      return new FluentNumber(arg);
    case 'object':
      if (arg instanceof Date) {
        return new FluentDateTime(arg);
      }
    default:
      errors.push(new TypeError('Unsupported external type: ' + name + ', ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg))));
      return new FluentNone(name);
  }
}

/**
 * Resolve a reference to a function.
 *
 * @param   {Object}  env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.name
 *    Name of the function to be returned.
 * @returns {Function}
 * @private
 */
function FunctionReference(env, _ref6) {
  var name = _ref6.name;

  // Some functions are built-in.  Others may be provided by the runtime via
  // the `MessageContext` constructor.
  var _functions = env.ctx._functions,
      errors = env.errors;

  var func = _functions[name] || builtins[name];

  if (!func) {
    errors.push(new ReferenceError('Unknown function: ' + name + '()'));
    return new FluentNone(name + '()');
  }

  if (typeof func !== 'function') {
    errors.push(new TypeError('Function ' + name + '() is not callable'));
    return new FluentNone(name + '()');
  }

  return func;
}

/**
 * Resolve a call to a Function with positional and key-value arguments.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {Object} expr.fun
 *    FTL Function object.
 * @param   {Array} expr.args
 *    FTL Function argument list.
 * @returns {FluentType}
 * @private
 */
function CallExpression(env, _ref7) {
  var fun = _ref7.fun,
      args = _ref7.args;

  var callee = FunctionReference(env, fun);

  if (callee instanceof FluentNone) {
    return callee;
  }

  var posargs = [];
  var keyargs = {};

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = args[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var arg = _step3.value;

      if (arg.type === 'narg') {
        keyargs[arg.name] = Type(env, arg.val);
      } else {
        posargs.push(Type(env, arg));
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  try {
    return callee(posargs, keyargs);
  } catch (e) {
    // XXX Report errors.
    return new FluentNone();
  }
}

/**
 * Resolve a pattern (a complex string with placeables).
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Array} ptn
 *    Array of pattern elements.
 * @returns {Array}
 * @private
 */
function Pattern(env, ptn) {
  var ctx = env.ctx,
      dirty = env.dirty,
      errors = env.errors;


  if (dirty.has(ptn)) {
    errors.push(new RangeError('Cyclic reference'));
    return new FluentNone();
  }

  // Tag the pattern as dirty for the purpose of the current resolution.
  dirty.add(ptn);
  var result = [];

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = ptn[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var elem = _step4.value;

      if (typeof elem === 'string') {
        result.push(elem);
        continue;
      }

      var part = Type(env, elem);

      if (ctx._useIsolating) {
        result.push(FSI);
      }

      if (Array.isArray(part)) {
        var len = PlaceableLength(env, part);

        if (len > MAX_PLACEABLE_LENGTH) {
          errors.push(new RangeError('Too many characters in placeable ' + ('(' + len + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')')));
          result.push(new FluentNone());
        } else {
          result.push.apply(result, toConsumableArray(part));
        }
      } else {
        result.push(part);
      }

      if (ctx._useIsolating) {
        result.push(PDI);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  dirty.delete(ptn);
  return result;
}

/**
 * Format a translation into an `FluentType`.
 *
 * The return value must be unwrapped via `valueOf` by the caller.
 *
 * @param   {MessageContext} ctx
 *    A MessageContext instance which will be used to resolve the
 *    contextual information of the message.
 * @param   {Object}         args
 *    List of arguments provided by the developer which can be accessed
 *    from the message.
 * @param   {Object}         message
 *    An object with the Message to be resolved.
 * @param   {Array}          errors
 *    An error array that any encountered errors will be appended to.
 * @returns {FluentType}
 */
function resolve(ctx, args, message) {
  var errors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var env = {
    ctx: ctx, args: args, errors: errors, dirty: new WeakSet()
  };
  return Type(env, message);
}

/**
 * Message contexts are single-language stores of translations.  They are
 * responsible for parsing translation resources in the Fluent syntax and can
 * format translation units (entities) to strings.
 *
 * Always use `MessageContext.format` to retrieve translation units from
 * a context.  Translations can contain references to other entities or
 * external arguments, conditional logic in form of select expressions, traits
 * which describe their grammatical features, and can use Fluent builtins which
 * make use of the `Intl` formatters to format numbers, dates, lists and more
 * into the context's language.  See the documentation of the Fluent syntax for
 * more information.
 */
var MessageContext = function () {

  /**
   * Create an instance of `MessageContext`.
   *
   * The `locales` argument is used to instantiate `Intl` formatters used by
   * translations.  The `options` object can be used to configure the context.
   *
   * Examples:
   *
   *     const ctx = new MessageContext(locales);
   *
   *     const ctx = new MessageContext(locales, { useIsolating: false });
   *
   *     const ctx = new MessageContext(locales, {
   *       useIsolating: true,
   *       functions: {
   *         NODE_ENV: () => process.env.NODE_ENV
   *       }
   *     });
   *
   * Available options:
   *
   *   - `functions` - an object of additional functions available to
   *                   translations as builtins.
   *
   *   - `useIsolating` - boolean specifying whether to use Unicode isolation
   *                    marks (FSI, PDI) for bidi interpolations.
   *
   * @param   {string|Array<string>} locales - Locale or locales of the context
   * @param   {Object} [options]
   * @returns {MessageContext}
   */
  function MessageContext(locales) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$functions = _ref.functions,
        functions = _ref$functions === undefined ? {} : _ref$functions,
        _ref$useIsolating = _ref.useIsolating,
        useIsolating = _ref$useIsolating === undefined ? true : _ref$useIsolating;

    classCallCheck(this, MessageContext);

    this.locales = Array.isArray(locales) ? locales : [locales];

    this._terms = new Map();
    this._messages = new Map();
    this._functions = functions;
    this._useIsolating = useIsolating;
    this._intls = new WeakMap();
  }

  /*
   * Return an iterator over public `[id, message]` pairs.
   *
   * @returns {Iterator}
   */


  createClass(MessageContext, [{
    key: 'hasMessage',


    /*
     * Check if a message is present in the context.
     *
     * @param {string} id - The identifier of the message to check.
     * @returns {bool}
     */
    value: function hasMessage(id) {
      return this._messages.has(id);
    }

    /*
     * Return the internal representation of a message.
     *
     * The internal representation should only be used as an argument to
     * `MessageContext.format` and `MessageContext.formatToParts`.
     *
     * @param {string} id - The identifier of the message to check.
     * @returns {Any}
     */

  }, {
    key: 'getMessage',
    value: function getMessage(id) {
      return this._messages.get(id);
    }

    /**
     * Add a translation resource to the context.
     *
     * The translation resource must use the Fluent syntax.  It will be parsed by
     * the context and each translation unit (message) will be available in the
     * context by its identifier.
     *
     *     ctx.addMessages('foo = Foo');
     *     ctx.getMessage('foo');
     *
     *     // Returns a raw representation of the 'foo' message.
     *
     * Parsed entities should be formatted with the `format` method in case they
     * contain logic (references, select expressions etc.).
     *
     * @param   {string} source - Text resource with translations.
     * @returns {Array<Error>}
     */

  }, {
    key: 'addMessages',
    value: function addMessages(source) {
      var _parse = parse(source),
          _parse2 = slicedToArray(_parse, 2),
          entries = _parse2[0],
          errors = _parse2[1];

      for (var id in entries) {
        if (id.startsWith('-')) {
          // Identifiers starting with a dash (-) define terms. Terms are private
          // and cannot be retrieved from MessageContext.
          this._terms.set(id, entries[id]);
        } else {
          this._messages.set(id, entries[id]);
        }
      }

      return errors;
    }

    /**
     * Format a message to an array of `FluentTypes` or null.
     *
     * Format a raw `message` from the context into an array of `FluentType`
     * instances which may be used to build the final result.  It may also return
     * `null` if it has a null value.  `args` will be used to resolve references
     * to external arguments inside of the translation.
     *
     * See the documentation of {@link MessageContext#format} for more
     * information about error handling.
     *
     * In case of errors `format` will try to salvage as much of the translation
     * as possible and will still return a string.  For performance reasons, the
     * encountered errors are not returned but instead are appended to the
     * `errors` array passed as the third argument.
     *
     *     ctx.addMessages('hello = Hello, { $name }!');
     *     const hello = ctx.getMessage('hello');
     *     ctx.formatToParts(hello, { name: 'Jane' }, []);
     *     // → ['Hello, ', '\u2068', 'Jane', '\u2069']
     *
     * The returned parts need to be formatted via `valueOf` before they can be
     * used further.  This will ensure all values are correctly formatted
     * according to the `MessageContext`'s locale.
     *
     *     const parts = ctx.formatToParts(hello, { name: 'Jane' }, []);
     *     const str = parts.map(part => part.valueOf(ctx)).join('');
     *
     * @see MessageContext#format
     * @param   {Object | string}    message
     * @param   {Object | undefined} args
     * @param   {Array}              errors
     * @returns {?Array<FluentType>}
     */

  }, {
    key: 'formatToParts',
    value: function formatToParts(message, args, errors) {
      // optimize entities which are simple strings with no attributes
      if (typeof message === 'string') {
        return [message];
      }

      // optimize simple-string entities with attributes
      if (typeof message.val === 'string') {
        return [message.val];
      }

      // optimize entities with null values
      if (message.val === undefined) {
        return null;
      }

      var result = resolve(this, args, message, errors);

      return result instanceof FluentNone ? null : result;
    }

    /**
     * Format a message to a string or null.
     *
     * Format a raw `message` from the context into a string (or a null if it has
     * a null value).  `args` will be used to resolve references to external
     * arguments inside of the translation.
     *
     * In case of errors `format` will try to salvage as much of the translation
     * as possible and will still return a string.  For performance reasons, the
     * encountered errors are not returned but instead are appended to the
     * `errors` array passed as the third argument.
     *
     *     const errors = [];
     *     ctx.addMessages('hello = Hello, { $name }!');
     *     const hello = ctx.getMessage('hello');
     *     ctx.format(hello, { name: 'Jane' }, errors);
     *
     *     // Returns 'Hello, Jane!' and `errors` is empty.
     *
     *     ctx.format(hello, undefined, errors);
     *
     *     // Returns 'Hello, name!' and `errors` is now:
     *
     *     [<ReferenceError: Unknown external: name>]
     *
     * @param   {Object | string}    message
     * @param   {Object | undefined} args
     * @param   {Array}              errors
     * @returns {?string}
     */

  }, {
    key: 'format',
    value: function format(message, args, errors) {
      var _this = this;

      // optimize entities which are simple strings with no attributes
      if (typeof message === 'string') {
        return message;
      }

      // optimize simple-string entities with attributes
      if (typeof message.val === 'string') {
        return message.val;
      }

      // optimize entities with null values
      if (message.val === undefined) {
        return null;
      }

      var result = resolve(this, args, message, errors);

      if (result instanceof FluentNone) {
        return null;
      }

      return result.map(function (part) {
        return part.valueOf(_this);
      }).join('');
    }
  }, {
    key: '_memoizeIntlObject',
    value: function _memoizeIntlObject(ctor, opts) {
      var cache = this._intls.get(ctor) || {};
      var id = JSON.stringify(opts);

      if (!cache[id]) {
        cache[id] = new ctor(this.locales, opts);
        this._intls.set(ctor, cache);
      }

      return cache[id];
    }
  }, {
    key: 'messages',
    get: function get$$1() {
      return this._messages[Symbol.iterator]();
    }
  }]);
  return MessageContext;
}();

/*
 * CachedIterable caches the elements yielded by an iterable.
 *
 * It can be used to iterate over an iterable many times without depleting the
 * iterable.
 */
var CachedIterable = function () {
  /**
   * Create an `CachedIterable` instance.
   *
   * @param {Iterable} iterable
   * @returns {CachedIterable}
   */
  function CachedIterable(iterable) {
    classCallCheck(this, CachedIterable);

    if (!(Symbol.iterator in Object(iterable))) {
      throw new TypeError('Argument must implement the iteration protocol.');
    }

    this.iterator = iterable[Symbol.iterator]();
    this.seen = [];
  }

  createClass(CachedIterable, [{
    key: Symbol.iterator,
    value: function value() {
      var seen = this.seen,
          iterator = this.iterator;

      var cur = 0;

      return {
        next: function next() {
          if (seen.length <= cur) {
            seen.push(iterator.next());
          }
          return seen[cur++];
        }
      };
    }

    /**
     * This method allows user to consume the next element from the iterator
     * into the cache.
     */

  }, {
    key: 'touchNext',
    value: function touchNext() {
      var seen = this.seen,
          iterator = this.iterator;

      if (seen.length === 0 || seen[seen.length - 1].done === false) {
        seen.push(iterator.next());
      }
    }
  }]);
  return CachedIterable;
}();

/*
 * @overview
 *
 * Functions for managing ordered sequences of MessageContexts.
 *
 * An ordered iterable of MessageContext instances can represent the current
 * negotiated fallback chain of languages.  This iterable can be used to find
 * the best existing translation for a given identifier.
 *
 * The mapContext* methods can be used to find the first MessageContext in the
 * given iterable which contains the translation with the given identifier.  If
 * the iterable is ordered according to the result of a language negotiation
 * the returned MessageContext contains the best available translation.
 *
 * A simple function which formats translations based on the identifier might
 * be implemented as follows:
 *
 *     formatString(id, args) {
 *         const ctx = mapContextSync(contexts, id);
 *
 *         if (ctx === null) {
 *             return id;
 *         }
 *
 *         const msg = ctx.getMessage(id);
 *         return ctx.format(msg, args);
 *     }
 *
 * In order to pass an iterator to mapContext*, wrap it in CachedIterable.
 * This allows multiple calls to mapContext* without advancing and eventually
 * depleting the iterator.
 *
 *     function *generateMessages() {
 *         // Some lazy logic for yielding MessageContexts.
 *         yield *[ctx1, ctx2];
 *     }
 *
 *     const contexts = new CachedIterable(generateMessages());
 *     const ctx = mapContextSync(contexts, id);
 *
 */

/*
 * @module fluent
 * @overview
 *
 * `fluent` is a JavaScript implementation of Project Fluent, a localization
 * framework designed to unleash the expressive power of the natural language.
 *
 */

/* eslint no-console: ["error", {allow: ["warn"]}] */
/* global console */

// Match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
var reOverlay = /<|&#?\w+;/;

/**
 * Elements allowed in translations even if they are not present in the source
 * HTML. They are text-level elements as defined by the HTML5 spec:
 * https://www.w3.org/TR/html5/text-level-semantics.html with the exception of:
 *
 *   - a - because we don't allow href on it anyways,
 *   - ruby, rt, rp - because we don't allow nested elements to be inserted.
 */
var TEXT_LEVEL_ELEMENTS = {
  "http://www.w3.org/1999/xhtml": ["em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr"]
};

var LOCALIZABLE_ATTRIBUTES = {
  "http://www.w3.org/1999/xhtml": {
    global: ["title", "aria-label", "aria-valuetext", "aria-moz-hint"],
    a: ["download"],
    area: ["download", "alt"],
    // value is special-cased in isAttrNameLocalizable
    input: ["alt", "placeholder"],
    menuitem: ["label"],
    menu: ["label"],
    optgroup: ["label"],
    option: ["label"],
    track: ["label"],
    img: ["alt"],
    textarea: ["placeholder"],
    th: ["abbr"]
  },
  "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul": {
    global: ["accesskey", "aria-label", "aria-valuetext", "aria-moz-hint", "label"],
    key: ["key", "keycode"],
    textbox: ["placeholder"],
    toolbarbutton: ["tooltiptext"]
  }
};

/**
 * Translate an element.
 *
 * Translate the element's text content and attributes. Some HTML markup is
 * allowed in the translation. The element's children with the data-l10n-name
 * attribute will be treated as arguments to the translation. If the
 * translation defines the same children, their attributes and text contents
 * will be used for translating the matching source child.
 *
 * @param   {Element} element
 * @param   {Object} translation
 * @private
 */
function translateElement(element, translation) {
  var value = translation.value;


  if (typeof value === "string") {
    if (!reOverlay.test(value)) {
      // If the translation doesn't contain any markup skip the overlay logic.
      element.textContent = value;
    } else {
      // Else parse the translation's HTML using an inert template element,
      // sanitize it and replace the element's content.
      var templateElement = element.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml", "template");
      templateElement.innerHTML = value;
      overlayChildNodes(templateElement.content, element);
    }
  }

  // Even if the translation doesn't define any localizable attributes, run
  // overlayAttributes to remove any localizable attributes set by previous
  // translations.
  overlayAttributes(translation, element);
}

/**
 * Replace child nodes of an element with child nodes of another element.
 *
 * The contents of the target element will be cleared and fully replaced with
 * sanitized contents of the source element.
 *
 * @param {DocumentFragment} fromFragment - The source of children to overlay.
 * @param {Element} toElement - The target of the overlay.
 * @private
 */
function overlayChildNodes(fromFragment, toElement) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fromFragment.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var childNode = _step.value;

      if (childNode.nodeType === childNode.TEXT_NODE) {
        // Keep the translated text node.
        continue;
      }

      if (childNode.hasAttribute("data-l10n-name")) {
        var sanitized = namedChildFrom(toElement, childNode);
        fromFragment.replaceChild(sanitized, childNode);
        continue;
      }

      if (isElementAllowed(childNode)) {
        var _sanitized = allowedChild(childNode);
        fromFragment.replaceChild(_sanitized, childNode);
        continue;
      }

      console.warn("An element of forbidden type \"" + childNode.localName + "\" was found in " + "the translation. Only safe text-level elements and elements with " + "data-l10n-name are allowed.");

      // If all else fails, replace the element with its text content.
      fromFragment.replaceChild(textNode(childNode), childNode);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  toElement.textContent = "";
  toElement.appendChild(fromFragment);
}

/**
 * Transplant localizable attributes of an element to another element.
 *
 * Any localizable attributes already set on the target element will be
 * cleared.
 *
 * @param   {Element|Object} fromElement - The source of child nodes to overlay.
 * @param   {Element} toElement - The target of the overlay.
 * @private
 */
function overlayAttributes(fromElement, toElement) {
  var explicitlyAllowed = toElement.hasAttribute("data-l10n-attrs") ? toElement.getAttribute("data-l10n-attrs").split(",").map(function (i) {
    return i.trim();
  }) : null;

  // Remove existing localizable attributes.
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Array.from(toElement.attributes)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var attr = _step2.value;

      if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed)) {
        toElement.removeAttribute(attr.name);
      }
    }

    // fromElement might be a {value, attributes} object as returned by
    // Localization.messageFromContext. In which case attributes may be null to
    // save GC cycles.
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (!fromElement.attributes) {
    return;
  }

  // Set localizable attributes.
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Array.from(fromElement.attributes)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _attr = _step3.value;

      if (isAttrNameLocalizable(_attr.name, toElement, explicitlyAllowed)) {
        toElement.setAttribute(_attr.name, _attr.value);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

/**
 * Sanitize a child element created by the translation.
 *
 * Try to find a corresponding child in sourceElement and use it as the base
 * for the sanitization. This will preserve functional attribtues defined on
 * the child element in the source HTML.
 *
 * @param   {Element} sourceElement - The source for data-l10n-name lookups.
 * @param   {Element} translatedChild - The translated child to be sanitized.
 * @returns {Element}
 * @private
 */
function namedChildFrom(sourceElement, translatedChild) {
  var childName = translatedChild.getAttribute("data-l10n-name");
  var sourceChild = sourceElement.querySelector("[data-l10n-name=\"" + childName + "\"]");

  if (!sourceChild) {
    console.warn("An element named \"" + childName + "\" wasn't found in the source.");
    return textNode(translatedChild);
  }

  if (sourceChild.localName !== translatedChild.localName) {
    console.warn("An element named \"" + childName + "\" was found in the translation " + ("but its type " + translatedChild.localName + " didn't match the ") + ("element found in the source (" + sourceChild.localName + ")."));
    return textNode(translatedChild);
  }

  // Remove it from sourceElement so that the translation cannot use
  // the same reference name again.
  sourceElement.removeChild(sourceChild);
  // We can't currently guarantee that a translation won't remove
  // sourceChild from the element completely, which could break the app if
  // it relies on an event handler attached to the sourceChild. Let's make
  // this limitation explicit for now by breaking the identitiy of the
  // sourceChild by cloning it. This will destroy all event handlers
  // attached to sourceChild via addEventListener and via on<name>
  // properties.
  var clone = sourceChild.cloneNode(false);
  return shallowPopulateUsing(translatedChild, clone);
}

/**
 * Sanitize an allowed element.
 *
 * Text-level elements allowed in translations may only use safe attributes
 * and will have any nested markup stripped to text content.
 *
 * @param   {Element} element - The element to be sanitized.
 * @returns {Element}
 * @private
 */
function allowedChild(element) {
  // Start with an empty element of the same type to remove nested children
  // and non-localizable attributes defined by the translation.
  var clone = element.ownerDocument.createElement(element.localName);
  return shallowPopulateUsing(element, clone);
}

/**
 * Convert an element to a text node.
 *
 * @param   {Element} element - The element to be sanitized.
 * @returns {Node}
 * @private
 */
function textNode(element) {
  return element.ownerDocument.createTextNode(element.textContent);
}

/**
 * Check if element is allowed in the translation.
 *
 * This method is used by the sanitizer when the translation markup contains
 * an element which is not present in the source code.
 *
 * @param   {Element} element
 * @returns {boolean}
 * @private
 */
function isElementAllowed(element) {
  var allowed = TEXT_LEVEL_ELEMENTS[element.namespaceURI];
  return allowed && allowed.includes(element.localName);
}

/**
 * Check if attribute is allowed for the given element.
 *
 * This method is used by the sanitizer when the translation markup contains
 * DOM attributes, or when the translation has traits which map to DOM
 * attributes.
 *
 * `explicitlyAllowed` can be passed as a list of attributes explicitly
 * allowed on this element.
 *
 * @param   {string}         name
 * @param   {Element}        element
 * @param   {Array}          explicitlyAllowed
 * @returns {boolean}
 * @private
 */
function isAttrNameLocalizable(name, element) {
  var explicitlyAllowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (explicitlyAllowed && explicitlyAllowed.includes(name)) {
    return true;
  }

  var allowed = LOCALIZABLE_ATTRIBUTES[element.namespaceURI];
  if (!allowed) {
    return false;
  }

  var attrName = name.toLowerCase();
  var elemName = element.localName;

  // Is it a globally safe attribute?
  if (allowed.global.includes(attrName)) {
    return true;
  }

  // Are there no allowed attributes for this element?
  if (!allowed[elemName]) {
    return false;
  }

  // Is it allowed on this element?
  if (allowed[elemName].includes(attrName)) {
    return true;
  }

  // Special case for value on HTML inputs with type button, reset, submit
  if (element.namespaceURI === "http://www.w3.org/1999/xhtml" && elemName === "input" && attrName === "value") {
    var type = element.type.toLowerCase();
    if (type === "submit" || type === "button" || type === "reset") {
      return true;
    }
  }

  return false;
}

/**
 * Helper to set textContent and localizable attributes on an element.
 *
 * @param   {Element} fromElement
 * @param   {Element} toElement
 * @returns {Element}
 * @private
 */
function shallowPopulateUsing(fromElement, toElement) {
  toElement.textContent = fromElement.textContent;
  overlayAttributes(fromElement, toElement);
  return toElement;
}

/*  eslint no-magic-numbers: [0]  */

var MAX_PLACEABLES$1 = 100;

var entryIdentifierRe$1 = new RegExp("-?[a-zA-Z][a-zA-Z0-9_-]*", "y");
var identifierRe$1 = new RegExp("[a-zA-Z][a-zA-Z0-9_-]*", "y");
var functionIdentifierRe$1 = /^[A-Z][A-Z_?-]*$/;

/**
 * The `Parser` class is responsible for parsing FTL resources.
 *
 * It's only public method is `getResource(source)` which takes an FTL string
 * and returns a two element Array with an Object of entries generated from the
 * source as the first element and an array of SyntaxError objects as the
 * second.
 *
 * This parser is optimized for runtime performance.
 *
 * There is an equivalent of this parser in syntax/parser which is
 * generating full AST which is useful for FTL tools.
 */

var RuntimeParser$1 = function () {
  function RuntimeParser() {
    classCallCheck(this, RuntimeParser);
  }

  createClass(RuntimeParser, [{
    key: "getResource",

    /**
     * Parse FTL code into entries formattable by the MessageContext.
     *
     * Given a string of FTL syntax, return a map of entries that can be passed
     * to MessageContext.format and a list of errors encountered during parsing.
     *
     * @param {String} string
     * @returns {Array<Object, Array>}
     */
    value: function getResource(string) {
      this._source = string;
      this._index = 0;
      this._length = string.length;
      this.entries = {};

      var errors = [];

      this.skipWS();
      while (this._index < this._length) {
        try {
          this.getEntry();
        } catch (e) {
          if (e instanceof SyntaxError) {
            errors.push(e);

            this.skipToNextEntryStart();
          } else {
            throw e;
          }
        }
        this.skipWS();
      }

      return [this.entries, errors];
    }

    /**
     * Parse the source string from the current index as an FTL entry
     * and add it to object's entries property.
     *
     * @private
     */

  }, {
    key: "getEntry",
    value: function getEntry() {
      // The index here should either be at the beginning of the file
      // or right after new line.
      if (this._index !== 0 && this._source[this._index - 1] !== "\n") {
        throw this.error("Expected an entry to start\n        at the beginning of the file or on a new line.");
      }

      var ch = this._source[this._index];

      // We don't care about comments or sections at runtime
      if (ch === "/" || ch === "#" && [" ", "#", "\n"].includes(this._source[this._index + 1])) {
        this.skipComment();
        return;
      }

      if (ch === "[") {
        this.skipSection();
        return;
      }

      this.getMessage();
    }

    /**
     * Skip the section entry from the current index.
     *
     * @private
     */

  }, {
    key: "skipSection",
    value: function skipSection() {
      this._index += 1;
      if (this._source[this._index] !== "[") {
        throw this.error('Expected "[[" to open a section');
      }

      this._index += 1;

      this.skipInlineWS();
      this.getVariantName();
      this.skipInlineWS();

      if (this._source[this._index] !== "]" || this._source[this._index + 1] !== "]") {
        throw this.error('Expected "]]" to close a section');
      }

      this._index += 2;
    }

    /**
     * Parse the source string from the current index as an FTL message
     * and add it to the entries property on the Parser.
     *
     * @private
     */

  }, {
    key: "getMessage",
    value: function getMessage() {
      var id = this.getEntryIdentifier();

      this.skipInlineWS();

      if (this._source[this._index] === "=") {
        this._index++;
      }

      this.skipInlineWS();

      var val = this.getPattern();

      if (id.startsWith("-") && val === null) {
        throw this.error("Expected term to have a value");
      }

      var attrs = null;

      if (this._source[this._index] === " ") {
        var lineStart = this._index;
        this.skipInlineWS();

        if (this._source[this._index] === ".") {
          this._index = lineStart;
          attrs = this.getAttributes();
        }
      }

      if (attrs === null && typeof val === "string") {
        this.entries[id] = val;
      } else {
        if (val === null && attrs === null) {
          throw this.error("Expected message to have a value or attributes");
        }

        this.entries[id] = {};

        if (val !== null) {
          this.entries[id].val = val;
        }

        if (attrs !== null) {
          this.entries[id].attrs = attrs;
        }
      }
    }

    /**
     * Skip whitespace.
     *
     * @private
     */

  }, {
    key: "skipWS",
    value: function skipWS() {
      var ch = this._source[this._index];
      while (ch === " " || ch === "\n" || ch === "\t" || ch === "\r") {
        ch = this._source[++this._index];
      }
    }

    /**
     * Skip inline whitespace (space and \t).
     *
     * @private
     */

  }, {
    key: "skipInlineWS",
    value: function skipInlineWS() {
      var ch = this._source[this._index];
      while (ch === " " || ch === "\t") {
        ch = this._source[++this._index];
      }
    }

    /**
     * Skip blank lines.
     *
     * @private
     */

  }, {
    key: "skipBlankLines",
    value: function skipBlankLines() {
      while (true) {
        var ptr = this._index;

        this.skipInlineWS();

        if (this._source[this._index] === "\n") {
          this._index += 1;
        } else {
          this._index = ptr;
          break;
        }
      }
    }

    /**
     * Get identifier using the provided regex.
     *
     * By default this will get identifiers of public messages, attributes and
     * external arguments (without the $).
     *
     * @returns {String}
     * @private
     */

  }, {
    key: "getIdentifier",
    value: function getIdentifier() {
      var re = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identifierRe$1;

      re.lastIndex = this._index;
      var result = re.exec(this._source);

      if (result === null) {
        this._index += 1;
        throw this.error("Expected an identifier [" + re.toString() + "]");
      }

      this._index = re.lastIndex;
      return result[0];
    }

    /**
     * Get identifier of a Message or a Term (staring with a dash).
     *
     * @returns {String}
     * @private
     */

  }, {
    key: "getEntryIdentifier",
    value: function getEntryIdentifier() {
      return this.getIdentifier(entryIdentifierRe$1);
    }

    /**
     * Get Variant name.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getVariantName",
    value: function getVariantName() {
      var name = "";

      var start = this._index;
      var cc = this._source.charCodeAt(this._index);

      if (cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc === 95 || cc === 32) {
        // _ <space>
        cc = this._source.charCodeAt(++this._index);
      } else {
        throw this.error("Expected a keyword (starting with [a-zA-Z_])");
      }

      while (cc >= 97 && cc <= 122 || // a-z
      cc >= 65 && cc <= 90 || // A-Z
      cc >= 48 && cc <= 57 || // 0-9
      cc === 95 || cc === 45 || cc === 32) {
        // _- <space>
        cc = this._source.charCodeAt(++this._index);
      }

      // If we encountered the end of name, we want to test if the last
      // collected character is a space.
      // If it is, we will backtrack to the last non-space character because
      // the keyword cannot end with a space character.
      while (this._source.charCodeAt(this._index - 1) === 32) {
        this._index--;
      }

      name += this._source.slice(start, this._index);

      return { type: "varname", name: name };
    }

    /**
     * Get simple string argument enclosed in `"`.
     *
     * @returns {String}
     * @private
     */

  }, {
    key: "getString",
    value: function getString() {
      var start = this._index + 1;

      while (++this._index < this._length) {
        var ch = this._source[this._index];

        if (ch === '"') {
          break;
        }

        if (ch === "\n") {
          throw this.error("Unterminated string expression");
        }
      }

      return this._source.substring(start, this._index++);
    }

    /**
     * Parses a Message pattern.
     * Message Pattern may be a simple string or an array of strings
     * and placeable expressions.
     *
     * @returns {String|Array}
     * @private
     */

  }, {
    key: "getPattern",
    value: function getPattern() {
      // We're going to first try to see if the pattern is simple.
      // If it is we can just look for the end of the line and read the string.
      //
      // Then, if either the line contains a placeable opening `{` or the
      // next line starts an indentation, we switch to complex pattern.
      var start = this._index;
      var eol = this._source.indexOf("\n", this._index);

      if (eol === -1) {
        eol = this._length;
      }

      var firstLineContent = start !== eol ? this._source.slice(start, eol) : null;

      if (firstLineContent && firstLineContent.includes("{")) {
        return this.getComplexPattern();
      }

      this._index = eol + 1;

      this.skipBlankLines();

      if (this._source[this._index] !== " ") {
        // No indentation means we're done with this message. Callers should check
        // if the return value here is null. It may be OK for messages, but not OK
        // for terms, attributes and variants.
        return firstLineContent;
      }

      var lineStart = this._index;

      this.skipInlineWS();

      if (this._source[this._index] === ".") {
        // The pattern is followed by an attribute. Rewind _index to the first
        // column of the current line as expected by getAttributes.
        this._index = lineStart;
        return firstLineContent;
      }

      if (firstLineContent) {
        // It's a multiline pattern which started on the same line as the
        // identifier. Reparse the whole pattern to make sure we get all of it.
        this._index = start;
      }

      return this.getComplexPattern();
    }

    /**
     * Parses a complex Message pattern.
     * This function is called by getPattern when the message is multiline,
     * or contains escape chars or placeables.
     * It does full parsing of complex patterns.
     *
     * @returns {Array}
     * @private
     */
    /* eslint-disable complexity */

  }, {
    key: "getComplexPattern",
    value: function getComplexPattern() {
      var buffer = "";
      var content = [];
      var placeables = 0;

      var ch = this._source[this._index];

      while (this._index < this._length) {
        // This block handles multi-line strings combining strings separated
        // by new line.
        if (ch === "\n") {
          this._index++;

          // We want to capture the start and end pointers
          // around blank lines and add them to the buffer
          // but only if the blank lines are in the middle
          // of the string.
          var blankLinesStart = this._index;
          this.skipBlankLines();
          var blankLinesEnd = this._index;

          if (this._source[this._index] !== " ") {
            break;
          }
          this.skipInlineWS();

          if (this._source[this._index] === "}" || this._source[this._index] === "[" || this._source[this._index] === "*" || this._source[this._index] === ".") {
            this._index = blankLinesEnd;
            break;
          }

          buffer += this._source.substring(blankLinesStart, blankLinesEnd);

          if (buffer.length || content.length) {
            buffer += "\n";
          }
          ch = this._source[this._index];
          continue;
        } else if (ch === "\\") {
          var ch2 = this._source[this._index + 1];
          if (ch2 === '"' || ch2 === "{" || ch2 === "\\") {
            ch = ch2;
            this._index++;
          }
        } else if (ch === "{") {
          // Push the buffer to content array right before placeable
          if (buffer.length) {
            content.push(buffer);
          }
          if (placeables > MAX_PLACEABLES$1 - 1) {
            throw this.error("Too many placeables, maximum allowed is " + MAX_PLACEABLES$1);
          }
          buffer = "";
          content.push(this.getPlaceable());

          this._index++;

          ch = this._source[this._index];
          placeables++;
          continue;
        }

        if (ch) {
          buffer += ch;
        }
        this._index++;
        ch = this._source[this._index];
      }

      if (content.length === 0) {
        return buffer.length ? buffer : null;
      }

      if (buffer.length) {
        content.push(buffer);
      }

      return content;
    }
    /* eslint-enable complexity */

    /**
     * Parses a single placeable in a Message pattern and returns its
     * expression.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getPlaceable",
    value: function getPlaceable() {
      var start = ++this._index;

      this.skipWS();

      if (this._source[this._index] === "*" || this._source[this._index] === "[" && this._source[this._index + 1] !== "]") {
        var _variants = this.getVariants();

        return {
          type: "sel",
          exp: null,
          vars: _variants[0],
          def: _variants[1]
        };
      }

      // Rewind the index and only support in-line white-space now.
      this._index = start;
      this.skipInlineWS();

      var selector = this.getSelectorExpression();

      this.skipWS();

      var ch = this._source[this._index];

      if (ch === "}") {
        if (selector.type === "attr" && selector.id.name.startsWith("-")) {
          throw this.error("Attributes of private messages cannot be interpolated.");
        }

        return selector;
      }

      if (ch !== "-" || this._source[this._index + 1] !== ">") {
        throw this.error('Expected "}" or "->"');
      }

      if (selector.type === "ref") {
        throw this.error("Message references cannot be used as selectors.");
      }

      if (selector.type === "var") {
        throw this.error("Variants cannot be used as selectors.");
      }

      if (selector.type === "attr" && !selector.id.name.startsWith("-")) {
        throw this.error("Attributes of public messages cannot be used as selectors.");
      }

      this._index += 2; // ->

      this.skipInlineWS();

      if (this._source[this._index] !== "\n") {
        throw this.error("Variants should be listed in a new line");
      }

      this.skipWS();

      var variants = this.getVariants();

      if (variants[0].length === 0) {
        throw this.error("Expected members for the select expression");
      }

      return {
        type: "sel",
        exp: selector,
        vars: variants[0],
        def: variants[1]
      };
    }

    /**
     * Parses a selector expression.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getSelectorExpression",
    value: function getSelectorExpression() {
      var literal = this.getLiteral();

      if (literal.type !== "ref") {
        return literal;
      }

      if (this._source[this._index] === ".") {
        this._index++;

        var name = this.getIdentifier();
        this._index++;
        return {
          type: "attr",
          id: literal,
          name: name
        };
      }

      if (this._source[this._index] === "[") {
        this._index++;

        var key = this.getVariantKey();
        this._index++;
        return {
          type: "var",
          id: literal,
          key: key
        };
      }

      if (this._source[this._index] === "(") {
        this._index++;
        var args = this.getCallArgs();

        if (!functionIdentifierRe$1.test(literal.name)) {
          throw this.error("Function names must be all upper-case");
        }

        this._index++;

        literal.type = "fun";

        return {
          type: "call",
          fun: literal,
          args: args
        };
      }

      return literal;
    }

    /**
     * Parses call arguments for a CallExpression.
     *
     * @returns {Array}
     * @private
     */

  }, {
    key: "getCallArgs",
    value: function getCallArgs() {
      var args = [];

      while (this._index < this._length) {
        this.skipInlineWS();

        if (this._source[this._index] === ")") {
          return args;
        }

        var exp = this.getSelectorExpression();

        // MessageReference in this place may be an entity reference, like:
        // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
        if (exp.type !== "ref") {
          args.push(exp);
        } else {
          this.skipInlineWS();

          if (this._source[this._index] === ":") {
            this._index++;
            this.skipInlineWS();

            var val = this.getSelectorExpression();

            // If the expression returned as a value of the argument
            // is not a quote delimited string or number, throw.
            //
            // We don't have to check here if the pattern is quote delimited
            // because that's the only type of string allowed in expressions.
            if (typeof val === "string" || Array.isArray(val) || val.type === "num") {
              args.push({
                type: "narg",
                name: exp.name,
                val: val
              });
            } else {
              this._index = this._source.lastIndexOf(":", this._index) + 1;
              throw this.error("Expected string in quotes, number.");
            }
          } else {
            args.push(exp);
          }
        }

        this.skipInlineWS();

        if (this._source[this._index] === ")") {
          break;
        } else if (this._source[this._index] === ",") {
          this._index++;
        } else {
          throw this.error('Expected "," or ")"');
        }
      }

      return args;
    }

    /**
     * Parses an FTL Number.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getNumber",
    value: function getNumber() {
      var num = "";
      var cc = this._source.charCodeAt(this._index);

      // The number literal may start with negative sign `-`.
      if (cc === 45) {
        num += "-";
        cc = this._source.charCodeAt(++this._index);
      }

      // next, we expect at least one digit
      if (cc < 48 || cc > 57) {
        throw this.error("Unknown literal \"" + num + "\"");
      }

      // followed by potentially more digits
      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }

      // followed by an optional decimal separator `.`
      if (cc === 46) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);

        // followed by at least one digit
        if (cc < 48 || cc > 57) {
          throw this.error("Unknown literal \"" + num + "\"");
        }

        // and optionally more digits
        while (cc >= 48 && cc <= 57) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);
        }
      }

      return {
        type: "num",
        val: num
      };
    }

    /**
     * Parses a list of Message attributes.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getAttributes",
    value: function getAttributes() {
      var attrs = {};

      while (this._index < this._length) {
        if (this._source[this._index] !== " ") {
          break;
        }
        this.skipInlineWS();

        if (this._source[this._index] !== ".") {
          break;
        }
        this._index++;

        var key = this.getIdentifier();

        this.skipInlineWS();

        if (this._source[this._index] !== "=") {
          throw this.error('Expected "="');
        }
        this._index++;

        this.skipInlineWS();

        var val = this.getPattern();

        if (val === null) {
          throw this.error("Expected attribute to have a value");
        }

        if (typeof val === "string") {
          attrs[key] = val;
        } else {
          attrs[key] = {
            val: val
          };
        }

        this.skipBlankLines();
      }

      return attrs;
    }

    /**
     * Parses a list of Selector variants.
     *
     * @returns {Array}
     * @private
     */

  }, {
    key: "getVariants",
    value: function getVariants() {
      var variants = [];
      var index = 0;
      var defaultIndex = void 0;

      while (this._index < this._length) {
        var ch = this._source[this._index];

        if ((ch !== "[" || this._source[this._index + 1] === "[") && ch !== "*") {
          break;
        }
        if (ch === "*") {
          this._index++;
          defaultIndex = index;
        }

        if (this._source[this._index] !== "[") {
          throw this.error('Expected "["');
        }

        this._index++;

        var key = this.getVariantKey();

        this.skipInlineWS();

        var val = this.getPattern();

        if (val === null) {
          throw this.error("Expected variant to have a value");
        }

        variants[index++] = { key: key, val: val };

        this.skipWS();
      }

      return [variants, defaultIndex];
    }

    /**
     * Parses a Variant key.
     *
     * @returns {String}
     * @private
     */

  }, {
    key: "getVariantKey",
    value: function getVariantKey() {
      // VariantKey may be a Keyword or Number

      var cc = this._source.charCodeAt(this._index);
      var literal = void 0;

      if (cc >= 48 && cc <= 57 || cc === 45) {
        literal = this.getNumber();
      } else {
        literal = this.getVariantName();
      }

      if (this._source[this._index] !== "]") {
        throw this.error('Expected "]"');
      }

      this._index++;
      return literal;
    }

    /**
     * Parses an FTL literal.
     *
     * @returns {Object}
     * @private
     */

  }, {
    key: "getLiteral",
    value: function getLiteral() {
      var cc0 = this._source.charCodeAt(this._index);

      if (cc0 === 36) {
        // $
        this._index++;
        return {
          type: "ext",
          name: this.getIdentifier()
        };
      }

      var cc1 = cc0 === 45 // -
      // Peek at the next character after the dash.
      ? this._source.charCodeAt(this._index + 1)
      // Or keep using the character at the current index.
      : cc0;

      if (cc1 >= 97 && cc1 <= 122 || // a-z
      cc1 >= 65 && cc1 <= 90) {
        // A-Z
        return {
          type: "ref",
          name: this.getEntryIdentifier()
        };
      }

      if (cc1 >= 48 && cc1 <= 57) {
        // 0-9
        return this.getNumber();
      }

      if (cc0 === 34) {
        // "
        return this.getString();
      }

      throw this.error("Expected literal");
    }

    /**
     * Skips an FTL comment.
     *
     * @private
     */

  }, {
    key: "skipComment",
    value: function skipComment() {
      // At runtime, we don't care about comments so we just have
      // to parse them properly and skip their content.
      var eol = this._source.indexOf("\n", this._index);

      while (eol !== -1 && (this._source[eol + 1] === "/" && this._source[eol + 2] === "/" || this._source[eol + 1] === "#" && [" ", "#"].includes(this._source[eol + 2]))) {
        this._index = eol + 3;

        eol = this._source.indexOf("\n", this._index);

        if (eol === -1) {
          break;
        }
      }

      if (eol === -1) {
        this._index = this._length;
      } else {
        this._index = eol + 1;
      }
    }

    /**
     * Creates a new SyntaxError object with a given message.
     *
     * @param {String} message
     * @returns {Object}
     * @private
     */

  }, {
    key: "error",
    value: function error(message) {
      return new SyntaxError(message);
    }

    /**
     * Skips to the beginning of a next entry after the current position.
     * This is used to mark the boundary of junk entry in case of error,
     * and recover from the returned position.
     *
     * @private
     */

  }, {
    key: "skipToNextEntryStart",
    value: function skipToNextEntryStart() {
      var start = this._index;

      while (true) {
        if (start === 0 || this._source[start - 1] === "\n") {
          var cc = this._source.charCodeAt(start);

          if (cc >= 97 && cc <= 122 || // a-z
          cc >= 65 && cc <= 90 || // A-Z
          cc === 47 || cc === 91) {
            // /[
            this._index = start;
            return;
          }
        }

        start = this._source.indexOf("\n", start);

        if (start === -1) {
          this._index = this._length;
          return;
        }
        start++;
      }
    }
  }]);
  return RuntimeParser;
}();

/**
 * Parses an FTL string using RuntimeParser and returns the generated
 * object with entries and a list of errors.
 *
 * @param {String} string
 * @returns {Array<Object, Array>}
 */


function parse$1(string) {
  var parser = new RuntimeParser$1();
  return parser.getResource(string);
}

/* global Intl */

/**
 * The `FluentType` class is the base of Fluent's type system.
 *
 * Fluent types wrap JavaScript values and store additional configuration for
 * them, which can then be used in the `toString` method together with a proper
 * `Intl` formatter.
 */
var FluentType$1 = function () {

  /**
   * Create an `FluentType` instance.
   *
   * @param   {Any}    value - JavaScript value to wrap.
   * @param   {Object} opts  - Configuration.
   * @returns {FluentType}
   */
  function FluentType(value, opts) {
    classCallCheck(this, FluentType);

    this.value = value;
    this.opts = opts;
  }

  /**
   * Unwrap the raw value stored by this `FluentType`.
   *
   * @returns {Any}
   */


  createClass(FluentType, [{
    key: "valueOf",
    value: function valueOf() {
      return this.value;
    }

    /**
     * Format this instance of `FluentType` to a string.
     *
     * Formatted values are suitable for use outside of the `MessageContext`.
     * This method can use `Intl` formatters memoized by the `MessageContext`
     * instance passed as an argument.
     *
     * @param   {MessageContext} [ctx]
     * @returns {string}
     */

  }, {
    key: "toString",
    value: function toString() {
      throw new Error("Subclasses of FluentType must implement toString.");
    }
  }]);
  return FluentType;
}();

var FluentNone$1 = function (_FluentType) {
  inherits(FluentNone, _FluentType);

  function FluentNone() {
    classCallCheck(this, FluentNone);
    return possibleConstructorReturn(this, (FluentNone.__proto__ || Object.getPrototypeOf(FluentNone)).apply(this, arguments));
  }

  createClass(FluentNone, [{
    key: "toString",
    value: function toString() {
      return this.value || "???";
    }
  }]);
  return FluentNone;
}(FluentType$1);

var FluentNumber$1 = function (_FluentType2) {
  inherits(FluentNumber, _FluentType2);

  function FluentNumber(value, opts) {
    classCallCheck(this, FluentNumber);
    return possibleConstructorReturn(this, (FluentNumber.__proto__ || Object.getPrototypeOf(FluentNumber)).call(this, parseFloat(value), opts));
  }

  createClass(FluentNumber, [{
    key: "toString",
    value: function toString(ctx) {
      try {
        var nf = ctx._memoizeIntlObject(Intl.NumberFormat, this.opts);
        return nf.format(this.value);
      } catch (e) {
        // XXX Report the error.
        return this.value;
      }
    }

    /**
     * Compare the object with another instance of a FluentType.
     *
     * @param   {MessageContext} ctx
     * @param   {FluentType}     other
     * @returns {bool}
     */

  }, {
    key: "match",
    value: function match(ctx, other) {
      if (other instanceof FluentNumber) {
        return this.value === other.value;
      }
      return false;
    }
  }]);
  return FluentNumber;
}(FluentType$1);

var FluentDateTime$1 = function (_FluentType3) {
  inherits(FluentDateTime, _FluentType3);

  function FluentDateTime(value, opts) {
    classCallCheck(this, FluentDateTime);
    return possibleConstructorReturn(this, (FluentDateTime.__proto__ || Object.getPrototypeOf(FluentDateTime)).call(this, new Date(value), opts));
  }

  createClass(FluentDateTime, [{
    key: "toString",
    value: function toString(ctx) {
      try {
        var dtf = ctx._memoizeIntlObject(Intl.DateTimeFormat, this.opts);
        return dtf.format(this.value);
      } catch (e) {
        // XXX Report the error.
        return this.value;
      }
    }
  }]);
  return FluentDateTime;
}(FluentType$1);

var FluentSymbol$1 = function (_FluentType4) {
  inherits(FluentSymbol, _FluentType4);

  function FluentSymbol() {
    classCallCheck(this, FluentSymbol);
    return possibleConstructorReturn(this, (FluentSymbol.__proto__ || Object.getPrototypeOf(FluentSymbol)).apply(this, arguments));
  }

  createClass(FluentSymbol, [{
    key: "toString",
    value: function toString() {
      return this.value;
    }

    /**
     * Compare the object with another instance of a FluentType.
     *
     * @param   {MessageContext} ctx
     * @param   {FluentType}     other
     * @returns {bool}
     */

  }, {
    key: "match",
    value: function match(ctx, other) {
      if (other instanceof FluentSymbol) {
        return this.value === other.value;
      } else if (typeof other === "string") {
        return this.value === other;
      } else if (other instanceof FluentNumber$1) {
        var pr = ctx._memoizeIntlObject(Intl.PluralRules, other.opts);
        return this.value === pr.select(other.value);
      }
      return false;
    }
  }]);
  return FluentSymbol;
}(FluentType$1);

/**
 * @overview
 *
 * The FTL resolver ships with a number of functions built-in.
 *
 * Each function take two arguments:
 *   - args - an array of positional args
 *   - opts - an object of key-value args
 *
 * Arguments to functions are guaranteed to already be instances of
 * `FluentType`.  Functions must return `FluentType` objects as well.
 */

var builtins$1 = {
  "NUMBER": function NUMBER(_ref, opts) {
    var _ref2 = slicedToArray(_ref, 1),
        arg = _ref2[0];

    return new FluentNumber$1(arg.valueOf(), merge$1(arg.opts, opts));
  },
  "DATETIME": function DATETIME(_ref3, opts) {
    var _ref4 = slicedToArray(_ref3, 1),
        arg = _ref4[0];

    return new FluentDateTime$1(arg.valueOf(), merge$1(arg.opts, opts));
  }
};

function merge$1(argopts, opts) {
  return Object.assign({}, argopts, values$1(opts));
}

function values$1(opts) {
  var unwrapped = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(opts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref5 = _step.value;

      var _ref6 = slicedToArray(_ref5, 2);

      var name = _ref6[0];
      var opt = _ref6[1];

      unwrapped[name] = opt.valueOf();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return unwrapped;
}

/**
 * @overview
 *
 * The role of the Fluent resolver is to format a translation object to an
 * instance of `FluentType` or an array of instances.
 *
 * Translations can contain references to other messages or external arguments,
 * conditional logic in form of select expressions, traits which describe their
 * grammatical features, and can use Fluent builtins which make use of the
 * `Intl` formatters to format numbers, dates, lists and more into the
 * context's language.  See the documentation of the Fluent syntax for more
 * information.
 *
 * In case of errors the resolver will try to salvage as much of the
 * translation as possible.  In rare situations where the resolver didn't know
 * how to recover from an error it will return an instance of `FluentNone`.
 *
 * `MessageReference`, `VariantExpression`, `AttributeExpression` and
 * `SelectExpression` resolve to raw Runtime Entries objects and the result of
 * the resolution needs to be passed into `Type` to get their real value.
 * This is useful for composing expressions.  Consider:
 *
 *     brand-name[nominative]
 *
 * which is a `VariantExpression` with properties `id: MessageReference` and
 * `key: Keyword`.  If `MessageReference` was resolved eagerly, it would
 * instantly resolve to the value of the `brand-name` message.  Instead, we
 * want to get the message object and look for its `nominative` variant.
 *
 * All other expressions (except for `FunctionReference` which is only used in
 * `CallExpression`) resolve to an instance of `FluentType`.  The caller should
 * use the `toString` method to convert the instance to a native value.
 *
 *
 * All functions in this file pass around a special object called `env`.
 * This object stores a set of elements used by all resolve functions:
 *
 *  * {MessageContext} ctx
 *      context for which the given resolution is happening
 *  * {Object} args
 *      list of developer provided arguments that can be used
 *  * {Array} errors
 *      list of errors collected while resolving
 *  * {WeakSet} dirty
 *      Set of patterns already encountered during this resolution.
 *      This is used to prevent cyclic resolutions.
 */

// Prevent expansion of too long placeables.
var MAX_PLACEABLE_LENGTH$1 = 2500;

// Unicode bidi isolation characters.
var FSI$1 = "\u2068";
var PDI$1 = "\u2069";

/**
 * Helper for choosing the default value from a set of members.
 *
 * Used in SelectExpressions and Type.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} members
 *    Hash map of variants from which the default value is to be selected.
 * @param   {Number} def
 *    The index of the default variant.
 * @returns {FluentType}
 * @private
 */
function DefaultMember$1(env, members, def) {
  if (members[def]) {
    return members[def];
  }

  var errors = env.errors;

  errors.push(new RangeError("No default"));
  return new FluentNone$1();
}

/**
 * Resolve a reference to another message.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} id
 *    The identifier of the message to be resolved.
 * @param   {String} id.name
 *    The name of the identifier.
 * @returns {FluentType}
 * @private
 */
function MessageReference$1(env, _ref) {
  var name = _ref.name;
  var ctx = env.ctx,
      errors = env.errors;

  var message = name.startsWith("-") ? ctx._terms.get(name) : ctx._messages.get(name);

  if (!message) {
    var err = name.startsWith("-") ? new ReferenceError("Unknown term: " + name) : new ReferenceError("Unknown message: " + name);
    errors.push(err);
    return new FluentNone$1(name);
  }

  return message;
}

/**
 * Resolve a variant expression to the variant object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {Object} expr.id
 *    An Identifier of a message for which the variant is resolved.
 * @param   {Object} expr.id.name
 *    Name a message for which the variant is resolved.
 * @param   {Object} expr.key
 *    Variant key to be resolved.
 * @returns {FluentType}
 * @private
 */
function VariantExpression$1(env, _ref2) {
  var id = _ref2.id,
      key = _ref2.key;

  var message = MessageReference$1(env, id);
  if (message instanceof FluentNone$1) {
    return message;
  }

  var ctx = env.ctx,
      errors = env.errors;

  var keyword = Type$1(env, key);

  function isVariantList(node) {
    return Array.isArray(node) && node[0].type === "sel" && node[0].exp === null;
  }

  if (isVariantList(message.val)) {
    // Match the specified key against keys of each variant, in order.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = message.val[0].vars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var variant = _step.value;

        var variantKey = Type$1(env, variant.key);
        if (keyword.match(ctx, variantKey)) {
          return variant;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  errors.push(new ReferenceError("Unknown variant: " + keyword.toString(ctx)));
  return Type$1(env, message);
}

/**
 * Resolve an attribute expression to the attribute object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.id
 *    An ID of a message for which the attribute is resolved.
 * @param   {String} expr.name
 *    Name of the attribute to be resolved.
 * @returns {FluentType}
 * @private
 */
function AttributeExpression$1(env, _ref3) {
  var id = _ref3.id,
      name = _ref3.name;

  var message = MessageReference$1(env, id);
  if (message instanceof FluentNone$1) {
    return message;
  }

  if (message.attrs) {
    // Match the specified name against keys of each attribute.
    for (var attrName in message.attrs) {
      if (name === attrName) {
        return message.attrs[name];
      }
    }
  }

  var errors = env.errors;

  errors.push(new ReferenceError("Unknown attribute: " + name));
  return Type$1(env, message);
}

/**
 * Resolve a select expression to the member object.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.exp
 *    Selector expression
 * @param   {Array} expr.vars
 *    List of variants for the select expression.
 * @param   {Number} expr.def
 *    Index of the default variant.
 * @returns {FluentType}
 * @private
 */
function SelectExpression$1(env, _ref4) {
  var exp = _ref4.exp,
      vars = _ref4.vars,
      def = _ref4.def;

  if (exp === null) {
    return DefaultMember$1(env, vars, def);
  }

  var selector = Type$1(env, exp);
  if (selector instanceof FluentNone$1) {
    return DefaultMember$1(env, vars, def);
  }

  // Match the selector against keys of each variant, in order.
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = vars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var variant = _step2.value;

      var key = Type$1(env, variant.key);
      var keyCanMatch = key instanceof FluentNumber$1 || key instanceof FluentSymbol$1;

      if (!keyCanMatch) {
        continue;
      }

      var ctx = env.ctx;


      if (key.match(ctx, selector)) {
        return variant;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return DefaultMember$1(env, vars, def);
}

/**
 * Resolve expression to a Fluent type.
 *
 * JavaScript strings are a special case.  Since they natively have the
 * `toString` method they can be used as if they were a Fluent type without
 * paying the cost of creating a instance of one.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression object to be resolved into a Fluent type.
 * @returns {FluentType}
 * @private
 */
function Type$1(env, expr) {
  // A fast-path for strings which are the most common case, and for
  // `FluentNone` which doesn't require any additional logic.
  if (typeof expr === "string" || expr instanceof FluentNone$1) {
    return expr;
  }

  // The Runtime AST (Entries) encodes patterns (complex strings with
  // placeables) as Arrays.
  if (Array.isArray(expr)) {
    return Pattern$1(env, expr);
  }

  switch (expr.type) {
    case "varname":
      return new FluentSymbol$1(expr.name);
    case "num":
      return new FluentNumber$1(expr.val);
    case "ext":
      return ExternalArgument$1(env, expr);
    case "fun":
      return FunctionReference$1(env, expr);
    case "call":
      return CallExpression$1(env, expr);
    case "ref":
      {
        var message = MessageReference$1(env, expr);
        return Type$1(env, message);
      }
    case "attr":
      {
        var attr = AttributeExpression$1(env, expr);
        return Type$1(env, attr);
      }
    case "var":
      {
        var variant = VariantExpression$1(env, expr);
        return Type$1(env, variant);
      }
    case "sel":
      {
        var member = SelectExpression$1(env, expr);
        return Type$1(env, member);
      }
    case undefined:
      {
        // If it's a node with a value, resolve the value.
        if (expr.val !== null && expr.val !== undefined) {
          return Type$1(env, expr.val);
        }

        var errors = env.errors;

        errors.push(new RangeError("No value"));
        return new FluentNone$1();
      }
    default:
      return new FluentNone$1();
  }
}

/**
 * Resolve a reference to an external argument.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.name
 *    Name of an argument to be returned.
 * @returns {FluentType}
 * @private
 */
function ExternalArgument$1(env, _ref5) {
  var name = _ref5.name;
  var args = env.args,
      errors = env.errors;


  if (!args || !args.hasOwnProperty(name)) {
    errors.push(new ReferenceError("Unknown external: " + name));
    return new FluentNone$1(name);
  }

  var arg = args[name];

  // Return early if the argument already is an instance of FluentType.
  if (arg instanceof FluentType$1) {
    return arg;
  }

  // Convert the argument to a Fluent type.
  switch (typeof arg === "undefined" ? "undefined" : _typeof(arg)) {
    case "string":
      return arg;
    case "number":
      return new FluentNumber$1(arg);
    case "object":
      if (arg instanceof Date) {
        return new FluentDateTime$1(arg);
      }
    default:
      errors.push(new TypeError("Unsupported external type: " + name + ", " + (typeof arg === "undefined" ? "undefined" : _typeof(arg))));
      return new FluentNone$1(name);
  }
}

/**
 * Resolve a reference to a function.
 *
 * @param   {Object}  env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {String} expr.name
 *    Name of the function to be returned.
 * @returns {Function}
 * @private
 */
function FunctionReference$1(env, _ref6) {
  var name = _ref6.name;

  // Some functions are built-in.  Others may be provided by the runtime via
  // the `MessageContext` constructor.
  var _functions = env.ctx._functions,
      errors = env.errors;

  var func = _functions[name] || builtins$1[name];

  if (!func) {
    errors.push(new ReferenceError("Unknown function: " + name + "()"));
    return new FluentNone$1(name + "()");
  }

  if (typeof func !== "function") {
    errors.push(new TypeError("Function " + name + "() is not callable"));
    return new FluentNone$1(name + "()");
  }

  return func;
}

/**
 * Resolve a call to a Function with positional and key-value arguments.
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Object} expr
 *    An expression to be resolved.
 * @param   {Object} expr.fun
 *    FTL Function object.
 * @param   {Array} expr.args
 *    FTL Function argument list.
 * @returns {FluentType}
 * @private
 */
function CallExpression$1(env, _ref7) {
  var fun = _ref7.fun,
      args = _ref7.args;

  var callee = FunctionReference$1(env, fun);

  if (callee instanceof FluentNone$1) {
    return callee;
  }

  var posargs = [];
  var keyargs = {};

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = args[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var arg = _step3.value;

      if (arg.type === "narg") {
        keyargs[arg.name] = Type$1(env, arg.val);
      } else {
        posargs.push(Type$1(env, arg));
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  try {
    return callee(posargs, keyargs);
  } catch (e) {
    // XXX Report errors.
    return new FluentNone$1();
  }
}

/**
 * Resolve a pattern (a complex string with placeables).
 *
 * @param   {Object} env
 *    Resolver environment object.
 * @param   {Array} ptn
 *    Array of pattern elements.
 * @returns {Array}
 * @private
 */
function Pattern$1(env, ptn) {
  var ctx = env.ctx,
      dirty = env.dirty,
      errors = env.errors;


  if (dirty.has(ptn)) {
    errors.push(new RangeError("Cyclic reference"));
    return new FluentNone$1();
  }

  // Tag the pattern as dirty for the purpose of the current resolution.
  dirty.add(ptn);
  var result = [];

  // Wrap interpolations with Directional Isolate Formatting characters
  // only when the pattern has more than one element.
  var useIsolating = ctx._useIsolating && ptn.length > 1;

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = ptn[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var elem = _step4.value;

      if (typeof elem === "string") {
        result.push(elem);
        continue;
      }

      var part = Type$1(env, elem).toString(ctx);

      if (useIsolating) {
        result.push(FSI$1);
      }

      if (part.length > MAX_PLACEABLE_LENGTH$1) {
        errors.push(new RangeError("Too many characters in placeable " + ("(" + part.length + ", max allowed is " + MAX_PLACEABLE_LENGTH$1 + ")")));
        result.push(part.slice(MAX_PLACEABLE_LENGTH$1));
      } else {
        result.push(part);
      }

      if (useIsolating) {
        result.push(PDI$1);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  dirty.delete(ptn);
  return result.join("");
}

/**
 * Format a translation into a string.
 *
 * @param   {MessageContext} ctx
 *    A MessageContext instance which will be used to resolve the
 *    contextual information of the message.
 * @param   {Object}         args
 *    List of arguments provided by the developer which can be accessed
 *    from the message.
 * @param   {Object}         message
 *    An object with the Message to be resolved.
 * @param   {Array}          errors
 *    An error array that any encountered errors will be appended to.
 * @returns {FluentType}
 */
function resolve$1(ctx, args, message) {
  var errors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var env = {
    ctx: ctx, args: args, errors: errors, dirty: new WeakSet()
  };
  return Type$1(env, message).toString(ctx);
}

/**
 * Message contexts are single-language stores of translations.  They are
 * responsible for parsing translation resources in the Fluent syntax and can
 * format translation units (entities) to strings.
 *
 * Always use `MessageContext.format` to retrieve translation units from
 * a context.  Translations can contain references to other entities or
 * external arguments, conditional logic in form of select expressions, traits
 * which describe their grammatical features, and can use Fluent builtins which
 * make use of the `Intl` formatters to format numbers, dates, lists and more
 * into the context's language.  See the documentation of the Fluent syntax for
 * more information.
 */
var MessageContext$1 = function () {

  /**
   * Create an instance of `MessageContext`.
   *
   * The `locales` argument is used to instantiate `Intl` formatters used by
   * translations.  The `options` object can be used to configure the context.
   *
   * Examples:
   *
   *     const ctx = new MessageContext(locales);
   *
   *     const ctx = new MessageContext(locales, { useIsolating: false });
   *
   *     const ctx = new MessageContext(locales, {
   *       useIsolating: true,
   *       functions: {
   *         NODE_ENV: () => process.env.NODE_ENV
   *       }
   *     });
   *
   * Available options:
   *
   *   - `functions` - an object of additional functions available to
   *                   translations as builtins.
   *
   *   - `useIsolating` - boolean specifying whether to use Unicode isolation
   *                    marks (FSI, PDI) for bidi interpolations.
   *
   * @param   {string|Array<string>} locales - Locale or locales of the context
   * @param   {Object} [options]
   * @returns {MessageContext}
   */
  function MessageContext(locales) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$functions = _ref.functions,
        functions = _ref$functions === undefined ? {} : _ref$functions,
        _ref$useIsolating = _ref.useIsolating,
        useIsolating = _ref$useIsolating === undefined ? true : _ref$useIsolating;

    classCallCheck(this, MessageContext);

    this.locales = Array.isArray(locales) ? locales : [locales];

    this._terms = new Map();
    this._messages = new Map();
    this._functions = functions;
    this._useIsolating = useIsolating;
    this._intls = new WeakMap();
  }

  /*
   * Return an iterator over public `[id, message]` pairs.
   *
   * @returns {Iterator}
   */


  createClass(MessageContext, [{
    key: "hasMessage",


    /*
     * Check if a message is present in the context.
     *
     * @param {string} id - The identifier of the message to check.
     * @returns {bool}
     */
    value: function hasMessage(id) {
      return this._messages.has(id);
    }

    /*
     * Return the internal representation of a message.
     *
     * The internal representation should only be used as an argument to
     * `MessageContext.format`.
     *
     * @param {string} id - The identifier of the message to check.
     * @returns {Any}
     */

  }, {
    key: "getMessage",
    value: function getMessage(id) {
      return this._messages.get(id);
    }

    /**
     * Add a translation resource to the context.
     *
     * The translation resource must use the Fluent syntax.  It will be parsed by
     * the context and each translation unit (message) will be available in the
     * context by its identifier.
     *
     *     ctx.addMessages('foo = Foo');
     *     ctx.getMessage('foo');
     *
     *     // Returns a raw representation of the 'foo' message.
     *
     * Parsed entities should be formatted with the `format` method in case they
     * contain logic (references, select expressions etc.).
     *
     * @param   {string} source - Text resource with translations.
     * @returns {Array<Error>}
     */

  }, {
    key: "addMessages",
    value: function addMessages(source) {
      var _parse = parse$1(source),
          _parse2 = slicedToArray(_parse, 2),
          entries = _parse2[0],
          errors = _parse2[1];

      for (var id in entries) {
        if (id.startsWith("-")) {
          // Identifiers starting with a dash (-) define terms. Terms are private
          // and cannot be retrieved from MessageContext.
          if (this._terms.has(id)) {
            errors.push("Attempt to override an existing term: \"" + id + "\"");
            continue;
          }
          this._terms.set(id, entries[id]);
        } else {
          if (this._messages.has(id)) {
            errors.push("Attempt to override an existing message: \"" + id + "\"");
            continue;
          }
          this._messages.set(id, entries[id]);
        }
      }

      return errors;
    }

    /**
     * Format a message to a string or null.
     *
     * Format a raw `message` from the context into a string (or a null if it has
     * a null value).  `args` will be used to resolve references to external
     * arguments inside of the translation.
     *
     * In case of errors `format` will try to salvage as much of the translation
     * as possible and will still return a string.  For performance reasons, the
     * encountered errors are not returned but instead are appended to the
     * `errors` array passed as the third argument.
     *
     *     const errors = [];
     *     ctx.addMessages('hello = Hello, { $name }!');
     *     const hello = ctx.getMessage('hello');
     *     ctx.format(hello, { name: 'Jane' }, errors);
     *
     *     // Returns 'Hello, Jane!' and `errors` is empty.
     *
     *     ctx.format(hello, undefined, errors);
     *
     *     // Returns 'Hello, name!' and `errors` is now:
     *
     *     [<ReferenceError: Unknown external: name>]
     *
     * @param   {Object | string}    message
     * @param   {Object | undefined} args
     * @param   {Array}              errors
     * @returns {?string}
     */

  }, {
    key: "format",
    value: function format(message, args, errors) {
      // optimize entities which are simple strings with no attributes
      if (typeof message === "string") {
        return message;
      }

      // optimize simple-string entities with attributes
      if (typeof message.val === "string") {
        return message.val;
      }

      // optimize entities with null values
      if (message.val === undefined) {
        return null;
      }

      return resolve$1(this, args, message, errors);
    }
  }, {
    key: "_memoizeIntlObject",
    value: function _memoizeIntlObject(ctor, opts) {
      var cache = this._intls.get(ctor) || {};
      var id = JSON.stringify(opts);

      if (!cache[id]) {
        cache[id] = new ctor(this.locales, opts);
        this._intls.set(ctor, cache);
      }

      return cache[id];
    }
  }, {
    key: "messages",
    get: function get$$1() {
      return this._messages[Symbol.iterator]();
    }
  }]);
  return MessageContext;
}();

/*
 * CachedIterable caches the elements yielded by an iterable.
 *
 * It can be used to iterate over an iterable many times without depleting the
 * iterable.
 */
var CachedIterable$1 = function () {
  /**
   * Create an `CachedIterable` instance.
   *
   * @param {Iterable} iterable
   * @returns {CachedIterable}
   */
  function CachedIterable(iterable) {
    classCallCheck(this, CachedIterable);

    if (Symbol.asyncIterator in Object(iterable)) {
      this.iterator = iterable[Symbol.asyncIterator]();
    } else if (Symbol.iterator in Object(iterable)) {
      this.iterator = iterable[Symbol.iterator]();
    } else {
      throw new TypeError("Argument must implement the iteration protocol.");
    }

    this.seen = [];
  }

  createClass(CachedIterable, [{
    key: Symbol.iterator,
    value: function value() {
      var seen = this.seen,
          iterator = this.iterator;

      var cur = 0;

      return {
        next: function next() {
          if (seen.length <= cur) {
            seen.push(iterator.next());
          }
          return seen[cur++];
        }
      };
    }
  }, {
    key: Symbol.asyncIterator,
    value: function value() {
      var seen = this.seen,
          iterator = this.iterator;

      var cur = 0;

      return {
        next: function () {
          var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(seen.length <= cur)) {
                      _context.next = 6;
                      break;
                    }

                    _context.t0 = seen;
                    _context.next = 4;
                    return iterator.next();

                  case 4:
                    _context.t1 = _context.sent;

                    _context.t0.push.call(_context.t0, _context.t1);

                  case 6:
                    return _context.abrupt("return", seen[cur++]);

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function next() {
            return _ref.apply(this, arguments);
          }

          return next;
        }()
      };
    }

    /**
     * This method allows user to consume the next element from the iterator
     * into the cache.
     */

  }, {
    key: "touchNext",
    value: function touchNext() {
      var seen = this.seen,
          iterator = this.iterator;

      if (seen.length === 0 || seen[seen.length - 1].done === false) {
        seen.push(iterator.next());
      }
    }
  }]);
  return CachedIterable;
}();

/*
 * @overview
 *
 * Functions for managing ordered sequences of MessageContexts.
 *
 * An ordered iterable of MessageContext instances can represent the current
 * negotiated fallback chain of languages.  This iterable can be used to find
 * the best existing translation for a given identifier.
 *
 * The mapContext* methods can be used to find the first MessageContext in the
 * given iterable which contains the translation with the given identifier.  If
 * the iterable is ordered according to the result of a language negotiation
 * the returned MessageContext contains the best available translation.
 *
 * A simple function which formats translations based on the identifier might
 * be implemented as follows:
 *
 *     formatString(id, args) {
 *         const ctx = mapContextSync(contexts, id);
 *
 *         if (ctx === null) {
 *             return id;
 *         }
 *
 *         const msg = ctx.getMessage(id);
 *         return ctx.format(msg, args);
 *     }
 *
 * In order to pass an iterator to mapContext*, wrap it in CachedIterable.
 * This allows multiple calls to mapContext* without advancing and eventually
 * depleting the iterator.
 *
 *     function *generateMessages() {
 *         // Some lazy logic for yielding MessageContexts.
 *         yield *[ctx1, ctx2];
 *     }
 *
 *     const contexts = new CachedIterable(generateMessages());
 *     const ctx = mapContextSync(contexts, id);
 *
 */

/*
 * Asynchronously map an identifier or an array of identifiers to the best
 * `MessageContext` instance(s).
 *
 * @param {AsyncIterable} iterable
 * @param {string|Array<string>} ids
 * @returns {Promise<MessageContext|Array<MessageContext>>}
 */
var mapContextAsync = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(iterable, ids) {
    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value, context, remainingCount, foundContexts, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value2, _context, index, id;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (Array.isArray(ids)) {
              _context2.next = 36;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 4;
            _iterator2 = asyncIterator(iterable);

          case 6:
            _context2.next = 8;
            return _iterator2.next();

          case 8:
            _step2 = _context2.sent;
            _iteratorNormalCompletion2 = _step2.done;
            _context2.next = 12;
            return _step2.value;

          case 12:
            _value = _context2.sent;

            if (_iteratorNormalCompletion2) {
              _context2.next = 20;
              break;
            }

            context = _value;

            if (!context.hasMessage(ids)) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", context);

          case 17:
            _iteratorNormalCompletion2 = true;
            _context2.next = 6;
            break;

          case 20:
            _context2.next = 26;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 26:
            _context2.prev = 26;
            _context2.prev = 27;

            if (!(!_iteratorNormalCompletion2 && _iterator2.return)) {
              _context2.next = 31;
              break;
            }

            _context2.next = 31;
            return _iterator2.return();

          case 31:
            _context2.prev = 31;

            if (!_didIteratorError2) {
              _context2.next = 34;
              break;
            }

            throw _iteratorError2;

          case 34:
            return _context2.finish(31);

          case 35:
            return _context2.finish(26);

          case 36:
            remainingCount = ids.length;
            foundContexts = new Array(remainingCount).fill(null);
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context2.prev = 41;
            _iterator3 = asyncIterator(iterable);

          case 43:
            _context2.next = 45;
            return _iterator3.next();

          case 45:
            _step3 = _context2.sent;
            _iteratorNormalCompletion3 = _step3.done;
            _context2.next = 49;
            return _step3.value;

          case 49:
            _value2 = _context2.sent;

            if (_iteratorNormalCompletion3) {
              _context2.next = 64;
              break;
            }

            _context = _value2;
            index = 0;

          case 53:
            if (!(index < ids.length)) {
              _context2.next = 61;
              break;
            }

            id = ids[index];

            if (!foundContexts[index] && _context.hasMessage(id)) {
              foundContexts[index] = _context;
              remainingCount--;
            }

            // Return early when all ids have been mapped to contexts.

            if (!(remainingCount === 0)) {
              _context2.next = 58;
              break;
            }

            return _context2.abrupt("return", foundContexts);

          case 58:
            index++;
            _context2.next = 53;
            break;

          case 61:
            _iteratorNormalCompletion3 = true;
            _context2.next = 43;
            break;

          case 64:
            _context2.next = 70;
            break;

          case 66:
            _context2.prev = 66;
            _context2.t1 = _context2["catch"](41);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t1;

          case 70:
            _context2.prev = 70;
            _context2.prev = 71;

            if (!(!_iteratorNormalCompletion3 && _iterator3.return)) {
              _context2.next = 75;
              break;
            }

            _context2.next = 75;
            return _iterator3.return();

          case 75:
            _context2.prev = 75;

            if (!_didIteratorError3) {
              _context2.next = 78;
              break;
            }

            throw _iteratorError3;

          case 78:
            return _context2.finish(75);

          case 79:
            return _context2.finish(70);

          case 80:
            return _context2.abrupt("return", foundContexts);

          case 81:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee, this, [[4, 22, 26, 36], [27,, 31, 35], [41, 66, 70, 80], [71,, 75, 79]]);
  }));

  return function mapContextAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/*
 * @module fluent
 * @overview
 *
 * `fluent` is a JavaScript implementation of Project Fluent, a localization
 * framework designed to unleash the expressive power of the natural language.
 *
 */

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * The `Localization` class is a central high-level API for vanilla
 * JavaScript use of Fluent.
 * It combines language negotiation, MessageContext and I/O to
 * provide a scriptable API to format translations.
 */

var Localization = function () {
  /**
   * @param {Array<String>} resourceIds      - List of resource IDs
   * @param {Function}      generateMessages - Function that returns a
   *                                           generator over MessageContexts
   *
   * @returns {Localization}
   */
  function Localization(resourceIds, generateMessages) {
    classCallCheck(this, Localization);

    this.resourceIds = resourceIds;
    this.generateMessages = generateMessages;
    this.ctxs = new CachedIterable$1(this.generateMessages(this.resourceIds));
  }

  /**
   * Format translations and handle fallback if needed.
   *
   * Format translations for `keys` from `MessageContext` instances on this
   * DOMLocalization. In case of errors, fetch the next context in the
   * fallback chain.
   *
   * @param   {Array<Array>}          keys    - Translation keys to format.
   * @param   {Function}              method  - Formatting function.
   * @returns {Promise<Array<string|Object>>}
   * @private
   */


  createClass(Localization, [{
    key: "formatWithFallback",
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keys, method) {
        var translations, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, ctx, missingIds, locale, ids;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                translations = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = this.ctxs[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 19;
                  break;
                }

                ctx = _step.value;

                if (!(typeof ctx.then === "function")) {
                  _context.next = 12;
                  break;
                }

                _context.next = 11;
                return ctx;

              case 11:
                ctx = _context.sent;

              case 12:
                missingIds = keysFromContext(method, ctx, keys, translations);

                if (!(missingIds.size === 0)) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("break", 19);

              case 15:

                if (typeof console !== "undefined") {
                  locale = ctx.locales[0];
                  ids = Array.from(missingIds).join(", ");

                  console.warn("Missing translations in " + locale + ": " + ids);
                }

              case 16:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](4);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 25:
                _context.prev = 25;
                _context.prev = 26;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 28:
                _context.prev = 28;

                if (!_didIteratorError) {
                  _context.next = 31;
                  break;
                }

                throw _iteratorError;

              case 31:
                return _context.finish(28);

              case 32:
                return _context.finish(25);

              case 33:
                return _context.abrupt("return", translations);

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 21, 25, 33], [26,, 28, 32]]);
      }));

      function formatWithFallback(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return formatWithFallback;
    }()

    /**
     * Format translations into {value, attributes} objects.
     *
     * The fallback logic is the same as in `formatValues` but the argument type
     * is stricter (an array of arrays) and it returns {value, attributes}
     * objects which are suitable for the translation of DOM elements.
     *
     *     docL10n.formatMessages([
     *       ['hello', { who: 'Mary' }],
     *       ['welcome', undefined]
     *     ]).then(console.log);
     *
     *     // [
     *     //   { value: 'Hello, Mary!', attributes: null },
     *     //   { value: 'Welcome!', attributes: { title: 'Hello' } }
     *     // ]
     *
     * Returns a Promise resolving to an array of the translation strings.
     *
     * @param   {Array<Array>} keys
     * @returns {Promise<Array<{value: string, attributes: Object}>>}
     * @private
     */

  }, {
    key: "formatMessages",
    value: function formatMessages(keys) {
      return this.formatWithFallback(keys, messageFromContext);
    }

    /**
     * Retrieve translations corresponding to the passed keys.
     *
     * A generalized version of `DOMLocalization.formatValue`. Keys can
     * either be simple string identifiers or `[id, args]` arrays.
     *
     *     docL10n.formatValues([
     *       ['hello', { who: 'Mary' }],
     *       ['hello', { who: 'John' }],
     *       ['welcome']
     *     ]).then(console.log);
     *
     *     // ['Hello, Mary!', 'Hello, John!', 'Welcome!']
     *
     * Returns a Promise resolving to an array of the translation strings.
     *
     * @param   {Array<Array>} keys
     * @returns {Promise<Array<string>>}
     */

  }, {
    key: "formatValues",
    value: function formatValues(keys) {
      return this.formatWithFallback(keys, valueFromContext);
    }

    /**
     * Retrieve the translation corresponding to the `id` identifier.
     *
     * If passed, `args` is a simple hash object with a list of variables that
     * will be interpolated in the value of the translation.
     *
     *     docL10n.formatValue(
     *       'hello', { who: 'world' }
     *     ).then(console.log);
     *
     *     // 'Hello, world!'
     *
     * Returns a Promise resolving to the translation string.
     *
     * Use this sparingly for one-off messages which don't need to be
     * retranslated when the user changes their language preferences, e.g. in
     * notifications.
     *
     * @param   {string}  id     - Identifier of the translation to format
     * @param   {Object}  [args] - Optional external arguments
     * @returns {Promise<string>}
     */

  }, {
    key: "formatValue",
    value: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, args) {
        var _ref3, _ref4, val;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.formatValues([[id, args]]);

              case 2:
                _ref3 = _context2.sent;
                _ref4 = slicedToArray(_ref3, 1);
                val = _ref4[0];
                return _context2.abrupt("return", val);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function formatValue(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return formatValue;
    }()
  }, {
    key: "handleEvent",
    value: function handleEvent() {
      this.onLanguageChange();
    }

    /**
     * This method should be called when there's a reason to believe
     * that language negotiation or available resources changed.
     */

  }, {
    key: "onLanguageChange",
    value: function onLanguageChange() {
      this.ctxs = new CachedIterable$1(this.generateMessages(this.resourceIds));
    }
  }]);
  return Localization;
}();
function valueFromContext(ctx, errors, id, args) {
  var msg = ctx.getMessage(id);
  return ctx.format(msg, args, errors);
}

/**
 * Format all public values of a message into a {value, attributes} object.
 *
 * This function is passed as a method to `keysFromContext` and resolve
 * a single L10n Entity using provided `MessageContext`.
 *
 * The function will return an object with a value and attributes of the
 * entity.
 *
 * If the function fails to retrieve the entity, the value is set to the ID of
 * an entity, and attributes to `null`. If formatting fails, it will return
 * a partially resolved value and attributes.
 *
 * In both cases, an error is being added to the errors array.
 *
 * @param   {MessageContext} ctx
 * @param   {Array<Error>}   errors
 * @param   {String}         id
 * @param   {Object}         args
 * @returns {Object}
 * @private
 */
function messageFromContext(ctx, errors, id, args) {
  var msg = ctx.getMessage(id);

  var formatted = {
    value: ctx.format(msg, args, errors),
    attributes: null
  };

  if (msg.attrs) {
    formatted.attributes = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.entries(msg.attrs)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _ref5 = _step2.value;

        var _ref6 = slicedToArray(_ref5, 2);

        var name = _ref6[0];
        var attr = _ref6[1];

        var value = ctx.format(attr, args, errors);
        if (value !== null) {
          formatted.attributes.push({ name: name, value: value });
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  return formatted;
}

/**
 * This function is an inner function for `Localization.formatWithFallback`.
 *
 * It takes a `MessageContext`, list of l10n-ids and a method to be used for
 * key resolution (either `valueFromContext` or `messageFromContext`) and
 * optionally a value returned from `keysFromContext` executed against
 * another `MessageContext`.
 *
 * The idea here is that if the previous `MessageContext` did not resolve
 * all keys, we're calling this function with the next context to resolve
 * the remaining ones.
 *
 * In the function, we loop over `keys` and check if we have the `prev`
 * passed and if it has an error entry for the position we're in.
 *
 * If it doesn't, it means that we have a good translation for this key and
 * we return it. If it does, we'll try to resolve the key using the passed
 * `MessageContext`.
 *
 * In the end, we fill the translations array, and return the Set with
 * missing ids.
 *
 * See `Localization.formatWithFallback` for more info on how this is used.
 *
 * @param {Function}       method
 * @param {MessageContext} ctx
 * @param {Array<string>}  keys
 * @param {{Array<{value: string, attributes: Object}>}} translations
 *
 * @returns {Set<string>}
 * @private
 */
function keysFromContext(method, ctx, keys, translations) {
  var messageErrors = [];
  var missingIds = new Set();

  keys.forEach(function (key, i) {
    if (translations[i] !== undefined) {
      return;
    }

    if (ctx.hasMessage(key[0])) {
      messageErrors.length = 0;
      translations[i] = method(ctx, messageErrors, key[0], key[1]);
      // XXX: Report resolver errors
    } else {
      missingIds.add(key[0]);
    }
  });

  return missingIds;
}

var L10NID_ATTR_NAME = "data-l10n-id";
var L10NARGS_ATTR_NAME = "data-l10n-args";

var L10N_ELEMENT_QUERY = "[" + L10NID_ATTR_NAME + "]";

/**
 * The `DOMLocalization` class is responsible for fetching resources and
 * formatting translations.
 *
 * It implements the fallback strategy in case of errors encountered during the
 * formatting of translations and methods for observing DOM
 * trees with a `MutationObserver`.
 */

var DOMLocalization = function (_Localization) {
  inherits(DOMLocalization, _Localization);

  /**
   * @param {Window}           windowElement
   * @param {Array<String>}    resourceIds      - List of resource IDs
   * @param {Function}         generateMessages - Function that returns a
   *                                              generator over MessageContexts
   * @returns {DOMLocalization}
   */
  function DOMLocalization(windowElement, resourceIds, generateMessages) {
    classCallCheck(this, DOMLocalization);

    // A Set of DOM trees observed by the `MutationObserver`.
    var _this = possibleConstructorReturn(this, (DOMLocalization.__proto__ || Object.getPrototypeOf(DOMLocalization)).call(this, resourceIds, generateMessages));

    _this.roots = new Set();
    // requestAnimationFrame handler.
    _this.pendingrAF = null;
    // list of elements pending for translation.
    _this.pendingElements = new Set();
    _this.windowElement = windowElement;
    // _this.mutationObserver = new windowElement.MutationObserver(function (mutations) {
    //   return _this.translateMutations(mutations);
    // });
    _this.mutationObserver = {
      observe: () => { },
      takeRecords: () => {
        // Poor man implementation, returns all the data-l10n-id attributes.
        let nodes = document.querySelectorAll("*[data-l10n-id]");
        console.log(`Found ${nodes.length} l10n attributes.`);
        let records = [];
        nodes.forEach(node => {
          let record = {
            type: "attributes",
            target: node,
            attributeName: "data-l10n-id",
            oldValue: ""
          };
          records.push(record);

          // Remove the attribute to not trigger a loop...
          node.removeAttribute("data-l10n-id");
        });
        return records;
      },
      disconnect: () => { }
    };

    _this.observerConfig = {
      attribute: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: [L10NID_ATTR_NAME, L10NARGS_ATTR_NAME]
    };
    return _this;
  }

  createClass(DOMLocalization, [{
    key: "onLanguageChange",
    value: function onLanguageChange() {
      get(DOMLocalization.prototype.__proto__ || Object.getPrototypeOf(DOMLocalization.prototype), "onLanguageChange", this).call(this);
      this.translateRoots();
    }

    /**
     * Set the `data-l10n-id` and `data-l10n-args` attributes on DOM elements.
     * FluentDOM makes use of mutation observers to detect changes
     * to `data-l10n-*` attributes and translate elements asynchronously.
     * `setAttributes` is a convenience method which allows to translate
     * DOM elements declaratively.
     *
     * You should always prefer to use `data-l10n-id` on elements (statically in
     * HTML or dynamically via `setAttributes`) over manually retrieving
     * translations with `format`.  The use of attributes ensures that the
     * elements can be retranslated when the user changes their language
     * preferences.
     *
     * ```javascript
     * localization.setAttributes(
     *   document.querySelector('#welcome'), 'hello', { who: 'world' }
     * );
     * ```
     *
     * This will set the following attributes on the `#welcome` element.
     * The MutationObserver will pick up this change and will localize the element
     * asynchronously.
     *
     * ```html
     * <p id='welcome'
     *   data-l10n-id='hello'
     *   data-l10n-args='{"who": "world"}'>
     * </p>
     * ```
     *
     * @param {Element}                element - Element to set attributes on
     * @param {string}                 id      - l10n-id string
     * @param {Object<string, string>} args    - KVP list of l10n arguments
     * @returns {Element}
     */

  }, {
    key: "setAttributes",
    value: function setAttributes(element, id, args) {
      element.setAttribute(L10NID_ATTR_NAME, id);
      if (args) {
        element.setAttribute(L10NARGS_ATTR_NAME, JSON.stringify(args));
      } else {
        element.removeAttribute(L10NARGS_ATTR_NAME);
      }
      return element;
    }

    /**
     * Get the `data-l10n-*` attributes from DOM elements.
     *
     * ```javascript
     * localization.getAttributes(
     *   document.querySelector('#welcome')
     * );
     * // -> { id: 'hello', args: { who: 'world' } }
     * ```
     *
     * @param   {Element}  element - HTML element
     * @returns {{id: string, args: Object}}
     */

  }, {
    key: "getAttributes",
    value: function getAttributes(element) {
      return {
        id: element.getAttribute(L10NID_ATTR_NAME),
        args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
      };
    }

    /**
     * Add `newRoot` to the list of roots managed by this `DOMLocalization`.
     *
     * Additionally, if this `DOMLocalization` has an observer, start observing
     * `newRoot` in order to translate mutations in it.
     *
     * @param {Element}      newRoot - Root to observe.
     */

  }, {
    key: "connectRoot",
    value: function connectRoot(newRoot) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.roots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var root = _step.value;

          if (root === newRoot || root.contains(newRoot) || newRoot.contains(root)) {
            throw new Error("Cannot add a root that overlaps with existing root.");
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.roots.add(newRoot);
      this.mutationObserver.observe(newRoot, this.observerConfig);
    }

    /**
     * Remove `root` from the list of roots managed by this `DOMLocalization`.
     *
     * Additionally, if this `DOMLocalization` has an observer, stop observing
     * `root`.
     *
     * Returns `true` if the root was the last one managed by this
     * `DOMLocalization`.
     *
     * @param   {Element} root - Root to disconnect.
     * @returns {boolean}
     */

  }, {
    key: "disconnectRoot",
    value: function disconnectRoot(root) {
      this.roots.delete(root);
      // Pause and resume the mutation observer to stop observing `root`.
      this.pauseObserving();
      this.resumeObserving();

      return this.roots.size === 0;
    }

    /**
     * Translate all roots associated with this `DOMLocalization`.
     *
     * @returns {Promise}
     */

  }, {
    key: "translateRoots",
    value: function translateRoots() {
      var _this2 = this;

      var roots = Array.from(this.roots);
      return Promise.all(roots.map(function (root) {
        return _this2.translateFragment(root);
      }));
    }

    /**
     * Pauses the `MutationObserver`.
     *
     * @private
     */

  }, {
    key: "pauseObserving",
    value: function pauseObserving() {
      this.translateMutations(this.mutationObserver.takeRecords());
      this.mutationObserver.disconnect();
    }

    /**
     * Resumes the `MutationObserver`.
     *
     * @private
     */

  }, {
    key: "resumeObserving",
    value: function resumeObserving() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.roots[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var root = _step2.value;

          this.mutationObserver.observe(root, this.observerConfig);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Translate mutations detected by the `MutationObserver`.
     *
     * @private
     */

  }, {
    key: "translateMutations",
    value: function translateMutations(mutations) {
      var _this3 = this;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = mutations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var mutation = _step3.value;

          switch (mutation.type) {
            case "attributes":
              if (mutation.target.hasAttribute("data-l10n-id")) {
                this.pendingElements.add(mutation.target);
              }
              break;
            case "childList":
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = mutation.addedNodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var addedNode = _step4.value;

                  if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
                    if (addedNode.childElementCount) {
                      var _iteratorNormalCompletion5 = true;
                      var _didIteratorError5 = false;
                      var _iteratorError5 = undefined;

                      try {
                        for (var _iterator5 = this.getTranslatables(addedNode)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                          var element = _step5.value;

                          this.pendingElements.add(element);
                        }
                      } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                          }
                        } finally {
                          if (_didIteratorError5) {
                            throw _iteratorError5;
                          }
                        }
                      }
                    } else if (addedNode.hasAttribute(L10NID_ATTR_NAME)) {
                      this.pendingElements.add(addedNode);
                    }
                  }
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }

              break;
          }
        }

        // This fragment allows us to coalesce all pending translations
        // into a single requestAnimationFrame.
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (this.pendingElements.size > 0) {
        if (this.pendingrAF === null) {
          this.pendingrAF = this.windowElement.requestAnimationFrame(function () {
            _this3.translateElements(Array.from(_this3.pendingElements));
            _this3.pendingElements.clear();
            _this3.pendingrAF = null;
          });
        }
      }
    }

    /**
     * Translate a DOM element or fragment asynchronously using this
     * `DOMLocalization` object.
     *
     * Manually trigger the translation (or re-translation) of a DOM fragment.
     * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
     * with information about which translations to use.
     *
     * Returns a `Promise` that gets resolved once the translation is complete.
     *
     * @param   {DOMFragment} frag - Element or DocumentFragment to be translated
     * @returns {Promise}
     */

  }, {
    key: "translateFragment",
    value: function translateFragment(frag) {
      return this.translateElements(this.getTranslatables(frag));
    }

    /**
     * Translate a list of DOM elements asynchronously using this
     * `DOMLocalization` object.
     *
     * Manually trigger the translation (or re-translation) of a list of elements.
     * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
     * with information about which translations to use.
     *
     * Returns a `Promise` that gets resolved once the translation is complete.
     *
     * @param   {Array<Element>} elements - List of elements to be translated
     * @returns {Promise}
     */

  }, {
    key: "translateElements",
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(elements) {
        var keys, translations;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (elements.length) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 2:
                keys = elements.map(this.getKeysForElement);
                _context.next = 5;
                return this.formatMessages(keys);

              case 5:
                translations = _context.sent;
                return _context.abrupt("return", this.applyTranslations(elements, translations));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function translateElements(_x) {
        return _ref.apply(this, arguments);
      }

      return translateElements;
    }()

    /**
     * Applies translations onto elements.
     *
     * @param {Array<Element>} elements
     * @param {Array<Object>}  translations
     * @private
     */

  }, {
    key: "applyTranslations",
    value: function applyTranslations(elements, translations) {
      this.pauseObserving();

      for (var i = 0; i < elements.length; i++) {
        if (translations[i] !== undefined) {
          translateElement(elements[i], translations[i]);
        }
      }

      this.resumeObserving();
    }

    /**
     * Collects all translatable child elements of the element.
     *
     * @param {Element} element
     * @returns {Array<Element>}
     * @private
     */

  }, {
    key: "getTranslatables",
    value: function getTranslatables(element) {
      var nodes = Array.from(element.querySelectorAll(L10N_ELEMENT_QUERY));

      if (typeof element.hasAttribute === "function" && element.hasAttribute(L10NID_ATTR_NAME)) {
        nodes.push(element);
      }

      return nodes;
    }

    /**
     * Get the `data-l10n-*` attributes from DOM elements as a two-element
     * array.
     *
     * @param {Element} element
     * @returns {Array<string, Object>}
     * @private
     */

  }, {
    key: "getKeysForElement",
    value: function getKeysForElement(element) {
      return [element.getAttribute(L10NID_ATTR_NAME), JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)];
    }
  }]);
  return DOMLocalization;
}(Localization);

var fetchResource = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(locale, id) {
    var url, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = id.replace("{locale}", locale);
            _context.next = 3;
            return fetch(url);

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.text());

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchResource(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var createContext = function () {
  var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(locale, resourceIds) {
    var ctx, resources, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, resource;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ctx = new MessageContext([locale]);

            // First fetch all resources

            _context2.next = 3;
            return Promise.all(resourceIds.map(function (id) {
              return fetchResource(locale, id);
            }));

          case 3:
            resources = _context2.sent;


            // Then apply them preserving order
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 7;
            for (_iterator = resources[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              resource = _step.value;

              ctx.addMessages(resource);
            }
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 15:
            _context2.prev = 15;
            _context2.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 18:
            _context2.prev = 18;

            if (!_didIteratorError) {
              _context2.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context2.finish(18);

          case 22:
            return _context2.finish(15);

          case 23:
            return _context2.abrupt("return", ctx);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function createContext(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _marked = /*#__PURE__*/regeneratorRuntime.mark(generateMessages);

function documentReady() {
  var rs = document.readyState;
  if (rs === "interactive" || rs === "completed") {
    return Promise.resolve();
  }

  return new Promise(function (resolve) {
    return document.addEventListener("readystatechange", resolve, { once: true });
  });
}

function getMeta(elem) {
  return {
    available: elem.querySelector('meta[name="availableLanguages"]').getAttribute("content").split(",").map(function (s) {
      return s.trim();
    }),
    default: elem.querySelector('meta[name="defaultLanguage"]').getAttribute("content")
  };
}

function getResourceLinks(elem) {
  return Array.prototype.map.call(elem.querySelectorAll('link[rel="localization"]'), function (el) {
    return el.getAttribute("href");
  });
}

var meta = getMeta(document.head);

function generateMessages(resourceIds) {
  var locales, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, locale;

  return regeneratorRuntime.wrap(function generateMessages$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          locales = negotiateLanguages(navigator.languages, meta.available, {
            defaultLocale: meta.default
          });
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 4;
          _iterator2 = locales[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context3.next = 13;
            break;
          }

          locale = _step2.value;
          _context3.next = 10;
          return createContext(locale, resourceIds);

        case 10:
          _iteratorNormalCompletion2 = true;
          _context3.next = 6;
          break;

        case 13:
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](4);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t0;

        case 19:
          _context3.prev = 19;
          _context3.prev = 20;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 22:
          _context3.prev = 22;

          if (!_didIteratorError2) {
            _context3.next = 25;
            break;
          }

          throw _iteratorError2;

        case 25:
          return _context3.finish(22);

        case 26:
          return _context3.finish(19);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked, this, [[4, 15, 19, 27], [20,, 22, 26]]);
}

var resourceIds = getResourceLinks(document.head);
document.l10n = new DOMLocalization(window, resourceIds, generateMessages);
window.addEventListener("languagechange", document.l10n);

document.l10n.ready = documentReady().then(function () {
  document.l10n.connectRoot(document.documentElement);
  return document.l10n.translateRoots();
});

})));
