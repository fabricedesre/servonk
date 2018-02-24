#!/bin/bash

set -e

KIND=${1:-release}

echo "Pushing $KIND version to device"

adb root && adb remount

adb shell mkdir /data/local/servo
adb shell rm -r /data/local/servo

adb push target/armv7-linux-androideabi/$KIND/servo /data/local/servo/servo
adb push servo.sh /system/bin/servo.sh
adb push resources /data/local/servo/
adb push fonts.xml /system/etc/system_fonts.xml
