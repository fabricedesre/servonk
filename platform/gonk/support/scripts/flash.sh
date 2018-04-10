#!/bin/bash

set -e

BLUE='\033[1;34m'
NC='\033[0m'

KIND=${1:-release}

echo -e "${BLUE}Pushing $KIND version to device...${NC}"

adb root && adb remount

# Create the local directory and clean it up if needed.
adb shell mkdir /data/local/servo
adb shell rm -r /data/local/servo/*

# Push the wrapper script and the executable.
adb push servo.sh /system/bin/servo.sh
adb push ../../target/armv7-linux-androideabi/$KIND/servo /data/local/servo/servo

# Push common resources and the android fonts definitions.
adb push ../../../shared/resources /data/local/servo/
adb push ../../resources/fonts.xml /system/etc/system_fonts.xml

# Push the frontend.
adb push ../../../../frontend/ui /data/local/servo/ui

echo -e "${BLUE}Flashing done!${NC}"
