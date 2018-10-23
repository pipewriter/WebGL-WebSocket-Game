# [noescape.io - Play it Live](http://noescape.io)

![no escape io open source javascript game](https://github.com/pipewriter/noescape.io/raw/master/noescape.png)

This Repo contains the core server and client found in their respective folders:

* /server
* /client



noescape.io uses the following technologies:

* Node packages: ws, performance-now, axios, uuid
* Raw WebGL Calls

Everything else is new code written for this project.



## Running Locally

```bash
cd ./server
npm i
cd ..
cd ./client
npm i
cd ..
./start-servers.sh
# You may also need to run sudo ./kill.sh to kill both servers
```

### Now visit http://localhost

viola!

(https://github.com/pipewriter/noescape.io/raw/master/localhost.png)
