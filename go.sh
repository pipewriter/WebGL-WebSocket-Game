#!/bin/bash

echo "running"

node ~/io-game/server/server/serv.js &
npx http-server ~/io-game/client/ -p 8081
