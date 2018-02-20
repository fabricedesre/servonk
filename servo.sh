#!/system/bin/sh

# Move to the Servo directory so that it can find
# resources/* files properly.
cd /data/local/servo

./servo $@
