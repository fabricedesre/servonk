#!/bin/bash

set -e

BLUE='\033[1;34m'
NC='\033[0m'

echo -e "${BLUE}Updating frontend on device...${NC}"

adb root && adb remount

# Create the local directory and clean it up if needed.
adb shell mkdir /data/local/servo
adb shell rm -r /data/local/servo/ui

# Push the frontend.
adb push ../../../../frontend/ui /data/local/servo/ui

echo -e "${BLUE}Frontent update done!${NC}"
