#!/bin/bash

set -x -e

export PATH=$GONK_DIR/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.9/bin/:$PATH

RUST_TARGET=armv7-linux-androideabi

SYSROOT=$GONK_DIR/prebuilts/ndk/current/platforms/android-18/arch-arm/
GONK_LIBS=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib/

ARCH_DIR="arch-arm"

export GONKDIR=$GONK_DIR
export GONK_PRODUCT=$GONK_PRODUCT_NAME

# export NDK_ANDROID_VERSION=18
# export ANDROID_NDK=$GONK_DIR/prebuilts/ndk/current

export CFLAGS="-DANDROID -DTARGET_OS_GONK \
-DANDROID_VERSION=18 \
-DGR_GL_USE_NEW_SHADER_SOURCE_SIGNATURE=1 \
-isystem $GONK_DIR/bionic \
-isystem $GONK_DIR/bionic/libc/$ARCH_DIR/include \
-isystem $GONK_DIR/bionic/libc/include/ \
-isystem $GONK_DIR/bionic/libc/kernel/common \
-isystem $GONK_DIR/bionic/libc/kernel/$ARCH_DIR \
-isystem $GONK_DIR/bionic/libm/include \
-I$GONK_DIR/system \
-I$GONK_DIR/system/core/include \
-I$GONK_DIR/frameworks/native/opengl/include \
-I$GONK_DIR/external/zlib"

export CPPFLAGS="-O2 -mandroid -fPIC \
-isystem $GONK_DIR/api/cpp/include \
-isystem $GONK_DIR/external/stlport/stlport \
-isystem $GONK_DIR/bionic/libstdc++/include \
$CFLAGS"

export CXXFLAGS="$CPPFLAGS -std=c++11"

export LDFLAGS="-mandroid -L$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib \
-Wl,-rpath-link=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib \
--sysroot=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/"

# Needed to cross-compile openssl-sys
export OPENSSL_DIR=$GONK_DIR/external/openssl
export OPENSSL_LIB_DIR=$GONK_LIBS

cargo build --target $RUST_TARGET $@
