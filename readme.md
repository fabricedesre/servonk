# Servo on Gonk

## Dependencies

Do a b2g build first for your device (eng or userdebug to get root access), as this is not properly setup with the Android build system yet.

## Building

First, install [rustup](https://rustup.rs/) and then run `./build.sh --release`.

## Running

- Push the bits to the device with `./push.sh`.
- Run with `adb shell servo.sh https://en.wikipedia.org/wiki/Special:Random`

## Supported devices

- The L port of the Sony Z3C is currently the only tested device.
