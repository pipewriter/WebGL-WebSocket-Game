#!/bin/bash

sudo -u $LOGNAME git pull
sh ~/io-game/kill.sh
sh ~/io-game/go.sh
