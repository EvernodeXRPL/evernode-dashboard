#!/bin/bash
# Installs sashi streamer in every VM as a systemd service.

bin_dir=/usr/bin/sashi-streamer

# Make script directory if not exists.
if [ ! -d $bin_dir ]; then
  mkdir -p $bin_dir || exit 1
fi

curl -fsSL https://sthotpocket.blob.core.windows.net/evernode/index.js -o $bin_dir/sashi-streamer.js || exit 1

sashi_streamer_service="sashi-streamer"
# Install sashi streamer systemd service.
# StartLimitIntervalSec=0 to make unlimited retries. RestartSec=5 is to keep 5 second gap between restarts.
echo "[Unit]
Description=Running and monitoring sashi streamer.
After=network.target
StartLimitIntervalSec=0
[Service]
User=root
Group=root
Type=simple
WorkingDirectory=$bin_dir
ExecStart=/usr/bin/node $bin_dir/sashi-streamer.js
Restart=on-failure
RestartSec=5
[Install]
WantedBy=multi-user.target" >/etc/systemd/system/$sashi_streamer_service.service

systemctl enable $sashi_streamer_service
systemctl start $sashi_streamer_service
echo "Started sashi streamer service."
