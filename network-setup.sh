#!/bin/bash

set -e

# Set up networking on the z3c

# Start wpa_supplicant
adb shell start wpa_supplicant

# Get an ip
adb shell dhcpcd wlan0

# Use OpenDNS servers
adb shell ndc resolver setnetdns \"\" 208.67.222.222 208.67.220.220
