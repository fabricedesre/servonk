#!/bin/bash

cp -R $1/resources .
cp $1/Cargo.lock .
cp $1/rust-toolchain .

# Make sure we pick up our patched crates.
cargo update \
    -p mozjs_sys \
    -p rust-webvr \
    -p rust-webvr-api
