# Freeuently asked Questions (ordered in A-Z)

## Servonk Stack

- Hardware
- B2G (HAL for mobile)
- servonk
- Servo
- HTML Frontend

## Build failing

### don't know why
Most of the times the user is trying to build on a system with less than 8Gb
of RAM. Check in console with the testline below.

Linux | output has to be >8'000'000 as its in kB
```sh
grep MemTotal /proc/meminfo | awk '{print $2}'
```
MacOS | output has to be >8'000'000'000 as its in Byte
```sh
sysctl -a | grep hw.memsize
```
