#!/bin/bash

set -e

export RUST_TARGET=armv7-linux-androideabi

# Update the Rust toolchain if needed.
# TODO: checkt the current version and only call rustup if needed.
RUST_VERSION=`cat rust-toolchain`

rustup install $RUST_VERSION
rustup target add $RUST_TARGET
rustup override set $RUST_VERSION

# Install bindgen if needed.
command -v bindgen >/dev/null 2>&1 || {
    cargo install -f bindgen
}
