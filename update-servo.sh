#!/bin/bash

cp -R $1/resources platform/shared

cp $1/Cargo.lock platform/gonk
cp $1/Cargo.lock platform/glutin

cp $1/rust-toolchain .

./bootstrap.sh

# Make sure we pick up our patched crates.
cd platform/gonk

cargo update \
    -p mozjs_sys \
    -p rust-webvr \
    -p rust-webvr-api
