#!/bin/bash

set -e

# Check that the GONK_DIR environment variable is set.
if [ -z ${GONK_DIR+x} ];
then
    echo "Please set GONK_DIR to the root of your Gonk directory first.";
    exit 1;
else
    echo "Using '$GONK_DIR'";
fi

export RUST_TARGET=armv7-linux-androideabi

export PATH=$GONK_DIR/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.9/bin/:$PATH

SYSROOT=$GONK_DIR/prebuilts/ndk/current/platforms/android-18/arch-arm/
GONK_LIBS=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib/

ARCH_DIR="arch-arm"

export gonkdir=$GONK_DIR
export GONK_PRODUCT=$GONK_PRODUCT_NAME

STLPORT_CPPFLAGS="-I$gonkdir/external/libcxx/include \
-I$gonkdir/external/libcxx/include/ext \
-I$gonkdir/ndk/sources/cxx-stl/system/include"

export CFLAGS="-DANDROID -DTARGET_OS_GONK \
-DANDROID_VERSION=23 \
-DGR_GL_USE_NEW_SHADER_SOURCE_SIGNATURE=1 \
-isystem $GONK_DIR/bionic \
-isystem $GONK_DIR/bionic/libc/$ARCH_DIR/include \
-isystem $GONK_DIR/prebuilts/ndk/9/platforms/android-21/arch-arm/usr/include \
-isystem $GONK_DIR/bionic/libc/include/ \
-isystem $GONK_DIR/bionic/libc/kernel/common \
-isystem $GONK_DIR/bionic/libc/kernel/$ARCH_DIR \
-isystem $GONK_DIR/bionic/libc/kernel/uapi/ \
-isystem $GONK_DIR/bionic/libc/kernel/uapi/asm-arm/ \
-isystem $GONK_DIR/bionic/libm/include \
-I$GONK_DIR/frameworks/native/include \
-I$GONK_DIR/system \
-I$GONK_DIR/system/core/include \
-I$GONK_DIR/external/zlib"

export CPPFLAGS="-O2 -mandroid -fPIC \
-isystem $GONK_DIR/api/cpp/include \
$STLPORT_CPPFLAGS \
$CFLAGS"

export CXXFLAGS="$CPPFLAGS -std=c++11"

export LDFLAGS="-mandroid -L$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib \
-Wl,-rpath-link=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/lib \
--sysroot=$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj/"

# Install and do a static build of openssl, since we can't use boringssl.
export ANDROID_NDK=$GONK_DIR/prebuilts/ndk/current
export ANDROID_PLATFORM=android-21

OPENSSL_DIR=`pwd`/target/$RUST_TARGET/native/openssl
mkdir -p $OPENSSL_DIR
cp support/android/openssl.makefile $OPENSSL_DIR
cp support/android/openssl.sh $OPENSSL_DIR
export OPENSSL_VERSION="1.0.2k"
export CROSS_COMPILE="arm-linux-androideabi-"

HERE=`pwd`
cd $OPENSSL_DIR
make -j8 -f openssl.makefile
cd $HERE

OPENSSL_DIR=$OPENSSL_DIR/openssl-$OPENSSL_VERSION
export OPENSSL_LIB_DIR=$OPENSSL_DIR
export OPENSSL_INCLUDE_DIR=$OPENSSL_DIR/include
export OPENSSL_STATIC='TRUE'

OPT=debug
for arg in "$@"
do
    case $arg in
        --release)
            OPT=release
            ;;
    esac
done

export TARGET_DIR=`pwd`/target/$RUST_TARGET/$OPT/

cargo build --target $RUST_TARGET $@
