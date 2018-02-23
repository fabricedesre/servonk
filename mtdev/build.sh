#!/bin/bash
if [ -z "${C_LIBRARY_DIR}" ] || [ -z "${C_BUILD_DIR}" ];
then
	echo "This script is supposed to be run by \`build.rs\`!" >&2
	exit 1
fi

cmd() {
	echo " • Running: $* …" >&2
	"$@"
}

set -e

if [ "${TARGET}" = "armv7-linux-androideabi" ];
then
	if [ -z "${GONK_DIR}" ];
	then
		echo "Please set GONK_DIR to the root of your Gonk directory first.";
		exit 1;
	else
		# Get the product name from .config
		source $GONK_DIR/.config
	fi
	export CC=arm-linux-androideabi-gcc
	SYSROOT="$GONK_DIR/out/target/product/$PRODUCT_NAME/obj/"
	CFLAGS="-I$GONK_DIR/prebuilts/ndk/9/platforms/android-21/arch-arm/usr/include"
	EXTRA="--host=arm-linux-androideabi"
else
	CC=cc
fi

cd "${C_LIBRARY_DIR}"

# Switch to Cargo-provided build directory
mkdir -p "${C_BUILD_DIR}"

echo "Current dir: `pwd`"
./configure --prefix="${C_BUILD_DIR}" --with-sysroot="${SYSROOT}" ${EXTRA}
make
make install
