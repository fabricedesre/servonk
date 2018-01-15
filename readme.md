# Servo on Gonk

## Dependencies

You need an android NDK (the recommended version is 12b), and a version of cmake that can cross compile Angle. The version shipped with Ubuntu 17.10 is *not* working, so I downgraded to cmake 3.5.2.

Do a b2g build first for you device (eng or userdebug to get root access), as this is not properly setup with the Android build system yet.

## Building

### Option 1: using the Gonk prebuilt toolchain
- Set the `GONK_DIR` environement variable to the location of your B2G checkout.
- Set the `GONK_PRODUCT_NAME` environement variable to the codename of the device (eg: aries for the KK z3c build).
- build with `./build.sh`. If you add parameters they will be passed to `cargo`, so for instance to only build Spidermonkey, run `./build.sh -p mozjs_sys`.

### Option 2: using the Android ndk as does Servo
- Set the `ANDROID_NDK` environment variable to the location of your NDK.
- Set the `GONK_DIR` environement variable to the location of your B2G checkout.
- Build with `./mach build -r --android`

## Running

- Push the bits to the device with `push.sh`.
- Run with `adb shell /data/local/servo/servo.sh`

## Enjoy!

Well, not yet, as this doesn't start :)

- We need to build with the gonk c++ library instead of the NDK one. I haven't figured out the right build config for that yet... any help appreciated, see [python/servo/build_commands.py](python/servo/build_commands.py).
- The Rust side is incomplete (no event loop).
