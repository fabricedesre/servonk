adb shell kill -9 `adb shell ps|grep servo|cut -c 10-15`
