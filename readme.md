# Servonk

This is an experimental project, aiming at providing a web based environment for phones and other devices. The main goals are to:
- Build an alternative to current dominant mobile OSes and browsers.
- Encourage contributions to [Servo](https://servo.org) outside of the mandate of its corporate backers.
- Scratch an itch and have fun.

It currently runs on Gonk based devices and on desktop platforms (tested on Linux only so far, let me know if you get it to run on Windows or Mac). Another potential target will be the [Librem 5 from Purism](https://puri.sm/shop/librem-5/).

It is in very early stages and not really usable yet. There is an incomplete [todo list](todo.md) if you want to help!

## Dependencies

You need to do a b2g build for your device (eng or userdebug to get root access), as this is not properly setup with the Android build system yet.

## Building

First, install [rustup](https://rustup.rs/) and then run `./bootstrap.sh` to install the Rust toolchain.

You can then build for the platform of your choice by running:
`./servonk.sh build gonk --release` for a Gonk build, or `./servonk.sh build glutin --release` for a desktop version.

## Running

On desktop, just run `./servonk.sh run glutin`. On Gonk, you first need to flash your device before running:
1. `./servonk.sh flash gonk`
2. `./servonk.sh run gonk`

## Supported devices

- The L port of the Sony Z3C is currently the only tested device.
