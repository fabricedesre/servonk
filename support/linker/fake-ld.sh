#!/usr/bin/env bash

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

set -o errexit
set -o nounset
set -o pipefail

call_gcc()
{
  # TARGET_DIR="${OUT_DIR}/../../.."

  export _ANDROID_ARCH=$1
  export _ANDROID_EABI=$2
  export _ANDROID_PLATFORM=$3
  export ANDROID_SYSROOT="$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/obj"

  ANDROID_CPU_ARCH_DIR=$4

  if echo ${_GCC_PARAMS} | grep -qv " -shared"
  then
      PIE_FLAG="-pie"
  fi

  "${_ANDROID_EABI}-gcc" \
    $PIE_FLAG -lGLESv2 -L$GONK_DIR/out/target/product/$GONK_PRODUCT_NAME/system/lib/ \
    --sysroot="${ANDROID_SYSROOT}" ${_GCC_PARAMS} -lc++\
    -o "${TARGET_DIR}/servo"

  "${_ANDROID_EABI}-strip" "${TARGET_DIR}/servo"
}
