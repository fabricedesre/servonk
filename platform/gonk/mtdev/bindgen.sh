#!/bin/bash

set -e

mkdir -p src/generated

bindgen --whitelist-function "mtdev_new_open" \
        --whitelist-function "mtdev_close_delete" \
        --whitelist-function "mtdev_get" \
        --whitelist-function "mtdev_get_abs_minimum" \
        --whitelist-function "mtdev_has_mt_event" \
        --output src/generated/ffi.rs \
        --no-layout-tests \
        --with-derive-default \
        mtdev-1.1.5/include/mtdev.h \
        -- -I $GONK_DIR/prebuilts/ndk/9/platforms/android-19/arch-arm/usr/include

