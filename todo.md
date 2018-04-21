Servonk feature list
====================

## General
- [x] switch to fontawesome.

## Lockscreen
- [x] lock after 1min of inactivity or when pressing the power button.

## Virtual Keyboard
(see attachResizeListener)
- [ ] script injection to listen to focus/blur events for now.
- [ ] open keyboard... how to send back events?

## Window manager
- [x] frames are layout side by side.
- [ ] split frames horizontally or vertically (subtiles), with one active at a time.
- [x] the homescreen is a frame like any other.
- [x] Side swipes to change app with snapping.
- [x] the window title is displayed in the status bar.
- [ ] the favicon is displayed in the status bar.
- [ ] pressing the status bar opens details/action for the site (eg. bookmarking).

## Homescreen
- [ ] basic grid of bookmarked sites.
- [ ] reorganize icons by dragging them around.
- [ ] grouping by folders / sections?
- [ ] automatic grouping by origin?

## Menu (short press on the menu icon)
- [ ] opens a panel with the search field at the bottom and quick settings on top.
- [ ] search results replace settings once we start searching.

## Frame list (long press on the menu icon)
- [x] grid.
- [x] display title and (x) to close frames.
- [x] tapping on a frame selects it.
- [ ] display favicon.

## API server
- [x] web-view bridge
  - [x] get title & favicon.
  - [x] commands: back, forward, reload.
- [ ] inputMethod API.
- [ ] hardware key handling.
- [ ] data store for the homescreen.
- [ ] data store for the global search.
- [ ] basic HAL
  - [ ] turning screen on/off, sleep mode.
  - [ ] wifi (open and wpa/wpa2).
  - [ ] vibration?
  - [ ] lights?

# Notifications
- [ ] from the desktop notifications api.
- [ ] when the title or favicon of a frame changes after load complete?

## WebView
- [x] Make the special iframe proper top-level windows.

## Multiprocess support
- [x] Enable on Glutin.
- [ ] Enable on Gonk (see https://github.com/servo/ipc-channel/issues/143).

## Themes
- [ ] Reorganize css and asset files.
- [ ] API to list and select themes.

## l18n & l10n
- [ ] include l20n.js

## Content Filtering & Adaptation
- [ ] https everywhere.
- [ ] tracking protection.
- [ ] reader mode.

## Desktop dev version
- [x] Embedding api implementation.
- [ ] subset of the HAL to demo multi platform support.
- [ ] Keyboard support (bindings to actions).

## Packaging
- [ ] Z3C manifest.
- [x] Desktop packages (Linux).
- [ ] Desktop packages (Windows & Mac).


## Tests
- [ ] Embedding tests.
- [ ] Frontend tests.
