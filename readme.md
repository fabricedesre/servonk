# Servo on Gonk

## Dependencies

You need a version of cmake that can cross compile Angle. The version shipped with Ubuntu 17.10 is *not* working, so I downgraded to cmake 3.5.2.

Do a b2g build first for your device (eng or userdebug to get root access), as this is not properly setup with the Android build system yet.

## Building

First, install [rustup](https://rustup.rs/) and then run `./build.sh --release`.

## Running

- Push the bits to the device with `push.sh`.
- Run with `adb shell /data/local/servo/servo.sh https://duckduckgo.com`

## Supported devices

- The L port of the Sony Z3C is currently the only tested device.