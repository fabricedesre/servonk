'use strict';

(function (exports) {

    // This is copied from
    // https://mxr.mozilla.org/mozilla-central/source/dom/interfaces/events/nsIDOMKeyEvent.idl?raw=1

    var KeyEvent = {
        DOM_VK_CANCEL: 0x03,
        DOM_VK_HELP: 0x06,
        DOM_VK_BACK_SPACE: 0x08,
        DOM_VK_TAB: 0x09,
        DOM_VK_CLEAR: 0x0C,
        DOM_VK_RETURN: 0x0D,
        // DOM_VK_ENTER has been never used for representing native key events.
        // Therefore, it's removed for preventing developers being confused.
        // const unsigned long DOM_VK_ENTER          : 0x0E,
        DOM_VK_SHIFT: 0x10,
        DOM_VK_CONTROL: 0x11,
        DOM_VK_ALT: 0x12,
        DOM_VK_PAUSE: 0x13,
        DOM_VK_CAPS_LOCK: 0x14,
        DOM_VK_KANA: 0x15,
        DOM_VK_HANGUL: 0x15,
        DOM_VK_EISU: 0x16, // Japanese Mac keyboard only
        DOM_VK_JUNJA: 0x17,
        DOM_VK_FINAL: 0x18,
        DOM_VK_HANJA: 0x19,
        DOM_VK_KANJI: 0x19,
        DOM_VK_ESCAPE: 0x1B,
        DOM_VK_CONVERT: 0x1C,
        DOM_VK_NONCONVERT: 0x1D,
        DOM_VK_ACCEPT: 0x1E,
        DOM_VK_MODECHANGE: 0x1F,
        DOM_VK_SPACE: 0x20,
        DOM_VK_PAGE_UP: 0x21,
        DOM_VK_PAGE_DOWN: 0x22,
        DOM_VK_END: 0x23,
        DOM_VK_HOME: 0x24,
        DOM_VK_LEFT: 0x25,
        DOM_VK_UP: 0x26,
        DOM_VK_RIGHT: 0x27,
        DOM_VK_DOWN: 0x28,
        DOM_VK_SELECT: 0x29,
        DOM_VK_PRINT: 0x2A,
        DOM_VK_EXECUTE: 0x2B,
        DOM_VK_PRINTSCREEN: 0x2C,
        DOM_VK_INSERT: 0x2D,
        DOM_VK_DELETE: 0x2E,

        // DOM_VK_0 - DOM_VK_9 match their ascii values
        DOM_VK_0: 0x30,
        DOM_VK_1: 0x31,
        DOM_VK_2: 0x32,
        DOM_VK_3: 0x33,
        DOM_VK_4: 0x34,
        DOM_VK_5: 0x35,
        DOM_VK_6: 0x36,
        DOM_VK_7: 0x37,
        DOM_VK_8: 0x38,
        DOM_VK_9: 0x39,

        DOM_VK_COLON: 0x3A,
        DOM_VK_SEMICOLON: 0x3B,
        DOM_VK_LESS_THAN: 0x3C,
        DOM_VK_EQUALS: 0x3D,
        DOM_VK_GREATER_THAN: 0x3E,
        DOM_VK_QUESTION_MARK: 0x3F,
        DOM_VK_AT: 0x40,

        // DOM_VK_A - DOM_VK_Z match their ascii values
        DOM_VK_A: 0x41,
        DOM_VK_B: 0x42,
        DOM_VK_C: 0x43,
        DOM_VK_D: 0x44,
        DOM_VK_E: 0x45,
        DOM_VK_F: 0x46,
        DOM_VK_G: 0x47,
        DOM_VK_H: 0x48,
        DOM_VK_I: 0x49,
        DOM_VK_J: 0x4A,
        DOM_VK_K: 0x4B,
        DOM_VK_L: 0x4C,
        DOM_VK_M: 0x4D,
        DOM_VK_N: 0x4E,
        DOM_VK_O: 0x4F,
        DOM_VK_P: 0x50,
        DOM_VK_Q: 0x51,
        DOM_VK_R: 0x52,
        DOM_VK_S: 0x53,
        DOM_VK_T: 0x54,
        DOM_VK_U: 0x55,
        DOM_VK_V: 0x56,
        DOM_VK_W: 0x57,
        DOM_VK_X: 0x58,
        DOM_VK_Y: 0x59,
        DOM_VK_Z: 0x5A,

        DOM_VK_WIN: 0x5B,
        DOM_VK_CONTEXT_MENU: 0x5D,
        DOM_VK_SLEEP: 0x5F,

        // Numpad keys
        DOM_VK_NUMPAD0: 0x60,
        DOM_VK_NUMPAD1: 0x61,
        DOM_VK_NUMPAD2: 0x62,
        DOM_VK_NUMPAD3: 0x63,
        DOM_VK_NUMPAD4: 0x64,
        DOM_VK_NUMPAD5: 0x65,
        DOM_VK_NUMPAD6: 0x66,
        DOM_VK_NUMPAD7: 0x67,
        DOM_VK_NUMPAD8: 0x68,
        DOM_VK_NUMPAD9: 0x69,
        DOM_VK_MULTIPLY: 0x6A,
        DOM_VK_ADD: 0x6B,
        DOM_VK_SEPARATOR: 0x6C,
        DOM_VK_SUBTRACT: 0x6D,
        DOM_VK_DECIMAL: 0x6E,
        DOM_VK_DIVIDE: 0x6F,

        DOM_VK_F1: 0x70,
        DOM_VK_F2: 0x71,
        DOM_VK_F3: 0x72,
        DOM_VK_F4: 0x73,
        DOM_VK_F5: 0x74,
        DOM_VK_F6: 0x75,
        DOM_VK_F7: 0x76,
        DOM_VK_F8: 0x77,
        DOM_VK_F9: 0x78,
        DOM_VK_F10: 0x79,
        DOM_VK_F11: 0x7A,
        DOM_VK_F12: 0x7B,
        DOM_VK_F13: 0x7C,
        DOM_VK_F14: 0x7D,
        DOM_VK_F15: 0x7E,
        DOM_VK_F16: 0x7F,
        DOM_VK_F17: 0x80,
        DOM_VK_F18: 0x81,
        DOM_VK_F19: 0x82,
        DOM_VK_F20: 0x83,
        DOM_VK_F21: 0x84,
        DOM_VK_F22: 0x85,
        DOM_VK_F23: 0x86,
        DOM_VK_F24: 0x87,

        DOM_VK_NUM_LOCK: 0x90,
        DOM_VK_SCROLL_LOCK: 0x91,

        // OEM specific virtual keyCode of Windows should pass through DOM keyCode
        // for compatibility with the other web browsers on Windows.
        DOM_VK_WIN_OEM_FJ_JISHO: 0x92,
        DOM_VK_WIN_OEM_FJ_MASSHOU: 0x93,
        DOM_VK_WIN_OEM_FJ_TOUROKU: 0x94,
        DOM_VK_WIN_OEM_FJ_LOYA: 0x95,
        DOM_VK_WIN_OEM_FJ_ROYA: 0x96,

        DOM_VK_CIRCUMFLEX: 0xA0,
        DOM_VK_EXCLAMATION: 0xA1,
        DOM_VK_DOUBLE_QUOTE: 0xA2,
        DOM_VK_HASH: 0xA3,
        DOM_VK_DOLLAR: 0xA4,
        DOM_VK_PERCENT: 0xA5,
        DOM_VK_AMPERSAND: 0xA6,
        DOM_VK_UNDERSCORE: 0xA7,
        DOM_VK_OPEN_PAREN: 0xA8,
        DOM_VK_CLOSE_PAREN: 0xA9,
        DOM_VK_ASTERISK: 0xAA,
        DOM_VK_PLUS: 0xAB,
        DOM_VK_PIPE: 0xAC,
        DOM_VK_HYPHEN_MINUS: 0xAD,

        DOM_VK_OPEN_CURLY_BRACKET: 0xAE,
        DOM_VK_CLOSE_CURLY_BRACKET: 0xAF,

        DOM_VK_TILDE: 0xB0,

        DOM_VK_VOLUME_MUTE: 0xB5,
        DOM_VK_VOLUME_DOWN: 0xB6,
        DOM_VK_VOLUME_UP: 0xB7,

        DOM_VK_COMMA: 0xBC,
        DOM_VK_PERIOD: 0xBE,
        DOM_VK_SLASH: 0xBF,
        DOM_VK_BACK_QUOTE: 0xC0,
        DOM_VK_OPEN_BRACKET: 0xDB, // square bracket
        DOM_VK_BACK_SLASH: 0xDC,
        DOM_VK_CLOSE_BRACKET: 0xDD, // square bracket
        DOM_VK_QUOTE: 0xDE, // Apostrophe

        DOM_VK_META: 0xE0,
        DOM_VK_ALTGR: 0xE1,

        // OEM specific virtual keyCode of Windows should pass through DOM keyCode
        // for compatibility with the other web browsers on Windows.
        DOM_VK_WIN_ICO_HELP: 0xE3,
        DOM_VK_WIN_ICO_00: 0xE4,
        DOM_VK_WIN_ICO_CLEAR: 0xE6,
        DOM_VK_WIN_OEM_RESET: 0xE9,
        DOM_VK_WIN_OEM_JUMP: 0xEA,
        DOM_VK_WIN_OEM_PA1: 0xEB,
        DOM_VK_WIN_OEM_PA2: 0xEC,
        DOM_VK_WIN_OEM_PA3: 0xED,
        DOM_VK_WIN_OEM_WSCTRL: 0xEE,
        DOM_VK_WIN_OEM_CUSEL: 0xEF,
        DOM_VK_WIN_OEM_ATTN: 0xF0,
        DOM_VK_WIN_OEM_FINISH: 0xF1,
        DOM_VK_WIN_OEM_COPY: 0xF2,
        DOM_VK_WIN_OEM_AUTO: 0xF3,
        DOM_VK_WIN_OEM_ENLW: 0xF4,
        DOM_VK_WIN_OEM_BACKTAB: 0xF5,

        // Following keys are not used on most keyboards.  However, for compatibility
        // with other browsers on Windows, we should define them.
        DOM_VK_ATTN: 0xF6,
        DOM_VK_CRSEL: 0xF7,
        DOM_VK_EXSEL: 0xF8,
        DOM_VK_EREOF: 0xF9,
        DOM_VK_PLAY: 0xFA,
        DOM_VK_ZOOM: 0xFB,
        DOM_VK_PA1: 0xFD,

        // OEM specific virtual keyCode of Windows should pass through DOM keyCode
        // for compatibility with the other web browsers on Windows.
        DOM_VK_WIN_OEM_CLEAR: 0xFE,

        DOM_KEY_LOCATION_STANDARD: 0x00,
        DOM_KEY_LOCATION_LEFT: 0x01,
        DOM_KEY_LOCATION_RIGHT: 0x02,
        DOM_KEY_LOCATION_NUMPAD: 0x03,
        DOM_KEY_LOCATION_MOBILE: 0x04,
        DOM_KEY_LOCATION_JOYSTICK: 0x05
    };

    if (!exports.KeyEvent) {
        exports.KeyEvent = KeyEvent;

        for (var prop in KeyEvent) {
            if (!(prop in KeyboardEvent)) {
                exports.KeyboardEvent[prop] = KeyEvent[prop];
            }
        }
    };

}(window));
