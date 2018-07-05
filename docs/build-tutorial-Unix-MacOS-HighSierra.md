# Tutorial to build Servonk on MacOS High Sierra

This tutorial was made for MacOS, an Unix based distro, but can be expanded to other distros.
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

Here we use Homebrew allthroug its possible to use any Package Manager
distributing the same packages.

Install Homebrew
```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Install dependencies
```sh
brew install automake pkg-config python@2 cmake yasm
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

## B2G steps

FirefoxOS was built on the older HTML Renderer Gecko. It's
early development name was Boot to Gecko (B2G).
As technology changes the HTML Renderer of Firefox changed and Gecko was
succeded by Servo. Therefore this Project aims to change the
Hardwareabstractionlayer (HAL) which was caled Gonk and its toolchain to
boot a mobile in to the new HTML Renderer Servo what also gives this project
the name servonk. You need to do a B2G build for your device
(eng or userdebug to get root access), as this is not properly setup with
the Android build system yet. If you need more info, [this is a good first place to start](https://developer.mozilla.org/en-US/docs/Archive/B2G_OS/B2G_OS_build_prerequisites).

For MacOS and OSX its realy hard to build B2G as it depends on a case-sensitive
System. If you feel educated enough you can try to install MacOS on a
case-sensitive Partitition. Described here: [TODO]

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
