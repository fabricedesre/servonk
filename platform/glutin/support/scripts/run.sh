#!/bin/bash

set -e

HERE=`pwd`

export UI_ROOT=${HERE}/../../../../frontend/ui

../../target/release/servo \
  --resources-path ${HERE}/../../../shared/resources \
  --resolution 720x1280 \
  --user-agent "Mozilla/5.0 (Mobile; rv:60.0) Servo/1.0 Firefox/60.0" \
  http://localhost:8000/system/index.html