#!/bin/bash

echo "running"
sudo ./kill.sh
node ./server/server/serv.js &
sudo npx http-server ./client/ -p 80
