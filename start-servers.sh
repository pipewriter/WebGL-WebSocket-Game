#!/bin/bash

echo "running"
./kill.sh
node ./server/server/serv.js &
npx http-server ./client/ -p 8081
