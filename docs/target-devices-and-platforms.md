# Currently working devices:
Currently Servonk is targetting Gonk from B2G derived from Android Lollipop. There's also the desktop build with Glutin.

Using Gonk-L:
* Sony Xperia Z3 Compact
* LG Google Nexus 5

Using Glutin:
* Linux desktop

To do: add links to the build instructions for each of the working devices.

# Work in progress
* macOS using Glutin - build confirmed, not runing.
* Flame - @penserbjorne has stated a desire to get this working in the repo issues.

# Potential targets
## Intended targets
Long term there is a desire not to support old hardware and to make Servonk usable on new devices. These devices listed below are the intended targets for running Servonk, so if you're working on this then great!
* [Purism Librem 5](https://puri.sm/shop/librem-5/)
* Any Android phone supporting Project Treble (Android O/8.0 or later, Project Treble support must be checked and confirmed)

## Preferred alternatives
Whilst not the intended targets of Servonk, porting to these devices/platforms will probably help work on the intended targets, so efforts on these platforms are welcome.
* Non-Project Treble Android O/8.0 phones
* [LineageOS](https://github.com/LineageOS) 15.1 base
* [Halium](https://github.com/Halium)
* [postmarketOS](https://github.com/postmarketOS)
* Other GNU/Linux platforms

## Other possibilities
There are many other possible devices and platforms which could run Servonk, however work on these is unlikely to contribute much to the intended targets.
* FirefoxOS devices with a working Gonk layer derived from Android L/5.0
  * The Sony Xperia Z3 Gonk-L build should work (leo-l)
  * Other devices with work-in-progress builds based on Android L include the Fairphone 2, Flame, Nexus 6, Nexus Player, Raspberry Pi 2B and Sony Xperia E3, M2, T2U, T3, Z1, Z1 Compact, Z2, Z2 Tablet (Wifi only and LTE variants) and Z3 Tablet.
* FirefoxOS devices with a Gonk layer derived from Android KK/4.4 or earlier
  * Note that Fabrice did try to build for KK devices first but some dependencies like Spidermonkey would not compile. So, some work to be done to get this working.
* KaiOS phones, which use a Gonk layer derived from Android M/6.0...
* AOSP earlier than O/8.0
  * This includes updating Gonk to work with M or N versions of AOSP
* LineageOS/CyanogenMod bases earlier than 15.1
* Smart TVs using FirefoxTV or Panasonic's My Home Screen.
  * These were apparenetly originally based on BSD but recent [source code releases](http://www.unipf.jp/dl/EUIDTV17/) suggest they are now based on GNU/Linux (not Android).
  * It's possible therefore that making Servonk work on a hacked Panasonic TV could contribute to support on Librem 5!
* [Redox OS](https://www.redox-os.org/) is a POSIX compliant OS written entirely in Rust. Since Servo is also written in Rust there's some synergies which make building for Redox interesting, but this won't contribute to the intended platforms.
* macOS / Mac OSX desktop using Glutin
* Raspberry Pi or other SBCs using Glutin (not Gonk)
* Windows

For discussion use this issue: [Target platforms and devices #13](https://github.com/fabricedesre/servonk/issues/13)
