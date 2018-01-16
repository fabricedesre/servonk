#!/bin/bash

set -x -e

RUST_TARGET=armv7-linux-androideabi

RUST_VERSION=`cat rust-toolchain`

rustup install $RUST_VERSION
rustup target add $RUST_TARGET
rustup override set $RUST_VERSION
