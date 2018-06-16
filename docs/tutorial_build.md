# Tutorial to build Servonk

This tutorial was made using Antergos, an Arch distro based, but can be expanded to other distros.

## Servo stuffs

Building servo requires [rustup](https://rustup.rs/), version 1.8.0 or more recent.
If you have an older version, run `rustup self update`. [Oficial Servo documentation](https://github.com/servo/servo/blob/master/README.md#setting-up-your-environment)

Run:

```sh
curl https://sh.rustup.rs -sSf | sh
```

This will also download the current stable version of Rust, which Servo won’t use.

To skip that step, run instead:

```
curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain none
```

Proceed with the installation, option 1.

Install Arch dependencies.

``` sh
# Update system
sudo pacman -Syudd

# Install dependencies
sudo pacman -S --needed --force base-devel git python2 python2-virtualenv python2-pip mesa cmake bzip2 libxmu glu pkg-config ttf-fira-sans harfbuzz ccache clang
```

## B2G stuffs

You need to do a B2G build for your device (eng or userdebug to get root access), as this is not properly setup with the Android build system yet. If you need more info, [this is a good first place to start](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/B2G_OS_build_prerequisites).

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

Enable [multilib on Arch](https://wiki.archlinux.org/index.php/Multilib) and install dependencies.

```sh
sudo pacman -S --needed alsa-lib autoconf2.13 bison ccache curl firefox flex gcc-multilib git gperf libnotify libxt libx11 mesa multilib-devel wget wireless_tools yasm zip lib32-mesa lib32-mesa-libgl lib32-ncurses lib32-readline lib32-zlib lzop
```

Configure Python.

```sh
sudo pacman -S python-virtualenvwrapper
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
yaourt -S android-sdk
```

Optionally you can install all the Android development tools.

```sh
yaourt -S android-sdk android-sdk-build-tools android-sdk-platform-tools android-platform
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

## Servonk stuffs

Install rustup.

```sh
sudo pacman -S rustup
```

Clone the repo and enter to the servonk directory

```sh
cd .. && git clone https://github.com/fabricedesre/servonk.git && cd servonk
```

Run to install the Rust toolchain

```sh
./bootstrap.sh
```

Set the next environment variables:

```sh
export GONK_DIR=/path/to/b2g/repository
export GONK_PRODUCT_NAME=product_name
```

The product name for **Android devices** can bee seen [here](https://support.google.com/googleplay/answer/1727131?hl=en-GB) in the _Device_ column.

The product name for **FirefoxOS devices** can bee seen [here](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/Building_and_installing_B2G_OS/Compatible_Devices) and [here](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/Phone_guide/Phone_specs) in the _nickname_ or _Name/Codename_ cell. This may not work depending on the device.

Build running:

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
