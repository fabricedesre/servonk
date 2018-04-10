#!/bin/bash

. "$GONK_DIR/.config"
if [ $? -ne 0 ]; then
	echo Could not load .config. Did you run config.sh?
	exit -1
fi

if [ -f "$GONK_DIR/.userconfig" ]; then
	. "$GONK_DIR/.userconfig"
fi

VARIANT=${VARIANT:-eng}
PRODUCT_NAME=${PRODUCT_NAME:-full_${DEVICE}}
DEVICE=${DEVICE:-${PRODUCT_NAME}}
LUNCH=${LUNCH:-${PRODUCT_NAME}-${VARIANT}}
DEVICE_DIR=${DEVICE_DIR:-device/*/$DEVICE}
