Servonk MVP feature list
========================

Current icons are from https://icons8.com/icon/set/stop/small
- [ ] switch to fontawesome.

## Lockscreen
- [x] always start with screen locked.
- [ ] lock after 1min of inactivity or when pressing the power button.

## Keyboard
see attachResizeListener
- [ ] script injection to listen to focus/blur events for now.
- [ ] open keyboard... how to send back events?

## Window manager
- [x] frames are layout side by side
- [x] the homescreen is a frame like any other
- [ ] Side swipes to change app with snapping.
- [ ] the window title is displayed in the status bar.
- [ ] pressing the status bar opens details/action for the site (eg. bookmarking)

## Homescreen
- [ ] basic grid of bookmarked sites.

## Menu (short press on the menu icon)
- [ ] opens a panel with the search field on the bottom and quick settings on top.
- [ ] search results replace settings once we start searching.

## Frame list (long press on the menu icon)
- [x] grid.
- [x] display title and (x) to close frames.
- [x] tapping on a frame selects it.

## API server
- [ ] web-view bridge
  - [ ] get title & favicon.
  - [ ] commands: back, forward, reload, stop.
- [ ] inputMethod API
- [ ] hardware key handling
- [ ] basic HAL
  - [ ] turning screen on/off, sleep mode.
  - [ ] wifi (open and wpa/wpa2)
  - [ ] vibration

## Multiprocess support
- [ ] Check `--content-process` command line flag.

## Themes
- [ ] Reorganize css and asset files.
- [ ] API to list and select themes.

## l18n & l10n
- [ ] include l20n.js

## Desktop dev version
- [ ] Embedding api implementation.
- [ ] subset of the HAL to demo multi platform support.
- [ ] Keyboard support.

## Packaging
- [ ] Z3C manifest
- [ ] Z3C images
- [ ] Desktop packages
