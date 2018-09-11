# Tutorial to build Servonk on Debian distros

This tutorial was made for Ubuntu, an Debian based distro, but can be expanded to other distros.
Keep in mind there are different ways to use this technology.
1. mobile
2. desktop

The technology stack is depending on different blocks as the hardware is never the same.

1. Servonk Stack for mobile:
- Hardware
- B2G
- servonk
- Servo
- HTML Frontend

2. Servonk Stack for desktop:
- Hardware
- servonk
- Servo
- HTML Frontend

thats why you can leave out the B2G Layer when building for desktop.

## General Dependencies

Your Machnine will need at least 8Gb of RAM and 5Gb of Harddisk space
to build for desktop and 80Gb to build for a mobile successfully.

```sh
sudo apt -y update  && sudo apt -y upgrade && sudo apt -y update && \
    sudo apt -y install git curl wget autoconf libx11-dev \
    libfreetype6-dev libgl1-mesa-dri libglib2.0-dev xorg-dev \
    gperf g++ build-essential cmake virtualenv python-pip \
    libssl1.0-dev libbz2-dev libosmesa6-dev libxmu6 libxmu-dev \
    libglu1-mesa-dev libgles2-mesa-dev libegl1-mesa-dev libdbus-1-dev \
    libharfbuzz-dev ccache clang llvm-dev libclang-dev
```
Install Rustup the dependency manager of Rustup
```sh
curl https://sh.rustup.rs -sSf | sh && \
export PATH="$HOME/.cargo/env:$PATH" && \
source $HOME/.cargo/env
```
Download servonk to the directory {YOUR_USER}/Servonk or change it to what you like...
```sh
git clone https://github.com/fabricedesre/servonk.git && \
cd ~/servonk/
```
Install the toolchain
```sh
./bootstrap.sh
```

## B2G steps (unverified! please file a Pullrequest (PR) if it works or open an issue)

In earlyer days FirefoxOS was built on the older HTML Renderer Gecko. It's
early development name was Boot to Gecko (B2G).
As technology changes the HTML Renderer of Firefox changed and Gecko was
succeded by Servo. Therefore this Project aims to change the
Hardwareabstractionlayer (HAL) which was caled Gonk and its toolchain to
boot a mobile in to the new HTML Renderer Servo what also gives this project
the name servonk. You need to do a B2G build for your device
(eng or userdebug to get root access), as this is not properly setup with
the Android build system yet. If you need more info, [this is a good first place to start](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/B2G_OS_build_prerequisites).

Clone the B2G repository and enter to b2g directory.

```sh
git clone https://github.com/mozilla-b2g/B2G && cd b2g
```

Configure USB access.

```sh
wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee >/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules
```

Configure ccache

```sh
ccache -M 50G
```

install B2G dependencies

```sh
sudo apt install -y alsa-lib autoconf2.13 bison firefox flex
    gcc-multilib libnotify libxt libx11 mesa multilib-devel
    wireless_tools yasm zip lib32-mesa lib32-mesa-libgl lib32-ncurses
    lib32-readline lib32-zlib lzop
```

Configure Python. Remember to use virtualenv every time you try to compile.

```sh
sudo apt install python-virtualenvwrapper
source /usr/bin/virtualenvwrapper.sh
mkvirtualenv -p `which python2` firefoxos
workon firefoxos
```

Verify that all works.

```sh
python --version
```

Gives as result `Python 2.7.XX`.

Install Android tools.

```sh
sudo apt install android-sdk
```

Optionally you can install all the Android development tools.

```sh
sudo apt install android-sdk android-sdk-build-tools android-sdk-platform-tools android-platform
```

Plug your phone and make a copy of propietary blobs. Ensure you device has [Remote Debugging](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/Debugging/Developer_settings#Remote_debugging) enabled in [Developer settings](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/Debugging/Developer_settings). Confirm your device is visible with the `adb devices` command, you should see something similar to this:

```sh
$ adb devices
List of devices attached
ABCXXXXXXX       device
```

If no device is listed, check your UDEV rules.

If you have permission issues, check that your screen is unlocked and that you have authorized access to your phone. You see a message on your device for that. If the issue persists used `adb root` and `adb remount`.

Back up the phone's partitions with the adb pull command:

```sh
adb pull /system <backup target dir>/system
```

Depending on the phone, you may also need to pull the /data and /vendor directories:

```sh
adb pull /data <backup target dir>/data
adb pull /vendor <backup target dir>/vendor
```

If the pull commands fail with an _insufficient permission_ message, try the following:

- Check you have granted root permissions within your custom ROM (e.g. under CyanogenMod, change Settings > System > Developer Options > Root Access to Apps and ADB or ADB only).
- Verify that you have set up the udev rule correctly (see For Linux: configure the udev rule for your phone).

Remember to plug your phone. Now config, build and flash B2G on your phone. This is only necessary to build gonk, not gecko or gaia. A simple way to remove these from the build after running ./config.sh is to edit b2g.mk in gonk-misc repository and comment out the gecko and gaia lines, as shown in this git diff: https://pastebin.com/sdQG3Tki

```sh
./config.sh <device_platform_name>
./build.sh
./flash.sh
```

## Servonk steps

To build, run:

```sh
# For a Gonk build
./servonk build gonk --release

# Or for a desktop version
./servonk build glutin --release
```

## Running

On desktop run:

```sh
./servonk run glutin
```

On mobile/Gonk, you first need to flash your device with B2G before running:

```sh
./servonk flash gonk
./servonk run gonk
```

The lockscreen code is 4242.
