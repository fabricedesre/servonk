#!/system/bin/sh

# Move to the Servo directory so that it can find
# resources/* files properly.
cd /data/local/servo

./servo file:///data/local/servo/index.html $@

# ./servo https://en.wikipedia.org/wiki/Main_Page $@
# ./servo file:///data/local/servo/ui/index.html $@
# ./servo "https://www.google.com/maps?force=qVTs2FOxxTmHHo79-pwa&source=mlapk"
