#!/bin/bash

set -x -e

adb root

adb shell mkdir /data/local/servo
adb shell rm -r /data/local/servo

adb push $ANDROID_NDK/sources/cxx-stl/llvm-libc++/libs/armeabi-v7a/libc++_shared.so /data/local/servo/libc++.so

adb push target/armv7-linux-androideabi/release/servo /data/local/servo/servo
adb push servo.sh /data/local/servo/servo.sh
adb push resources /data/local/servo/
