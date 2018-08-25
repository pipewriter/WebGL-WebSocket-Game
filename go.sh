#!/bin/bash

echo "running"

node ./server/server/serv.js &
sudo npx http-server ./client/ -p 80