#!/bin/bash

set -e

HERE=`pwd`

export UI_ROOT=${HERE}/../../../../frontend/ui
export SERVO_RESOURCES=${HERE}/../../../shared/resources

DEST=/tmp/servonk

mkdir -p ${DEST}
rm -rf ${DEST}/*

cp -R ${UI_ROOT}/ ${DEST}
cp -R ${SERVO_RESOURCES}/ ${DEST}
cp ../../target/release/servo ${DEST}
strip ${DEST}/servo
cp ./run-servonk ${DEST}/servonk
chmod +x ${DEST}/servonk

tar -cjf ${HERE}/servonk-`date "+%d%m%y-%H%M%S"`-`uname -s`.tar.bz2 -C /tmp servonk/

rm -rf ${DEST}/*
