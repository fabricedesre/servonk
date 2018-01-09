#!/system/bin/sh

cd /data/local/servo

# Tweak LD_LIBRARY_PATH to find our libc++
export LD_LIBRARY_PATH=`pwd`:$LD_LIBRARY_PATH

./servo
