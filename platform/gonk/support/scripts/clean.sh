#!/bin/bash

set -e

cd ../..
cargo clean
make -C mtdev/mtdev-1.1.5 clean

