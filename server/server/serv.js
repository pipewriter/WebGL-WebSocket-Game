const WebSocket = require('ws');
const now = require("performance-now")
let findGForce = require('./physics/gravitationalForce');
let boundaryClamp = require('./physics/boundaryClamp');
let {findNewPos, findNewVel} = require('./physics/kinematics');
let findGuideForce = require('./physics/guideForce');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

const MIN_X = 0;
const MIN_Y = 0;
const MAX_X = 1000;
const MAX_Y = 1000;
const INIT_X = 500;
const INIT_Y = 500;

const clampAdd = (val1, val2, max, min) => {
    let ret = val1 + val2;
    if (max < ret) {
        return max;
    }
    if (min > ret) {
        return min;
    }
    return ret;
}

boundary = {
    x: 500,
    y: 500,
    r: 500,
}

let id = 0;
wss.on('connection', function connection(ws) {
    function Client() {

        this.state = 'JOINED';
        this.uvx = 0;
        this.uvy = 0;
        this.x = INIT_X;
        this.y = INIT_Y;
        this.vx = 0;
        this.vy = 0;
        this.m = 1;
        this.fx = 0;
        this.fy = 0;
        this.r = 4;
        this.id = id++;
        this.guideStrength = 10000;

        let messageListener = (message) => {
            try {
                let playerData = JSON.parse(message);
                if (this.state === 'JOINED') {

                    if (playerData.name) {
                        this.name = playerData.name
                    } else {
                        this.name = 'unnamed horse';
                    }

                    this.state = 'PLAYING';
                } else {
                    let uvx = new Number(playerData.uvx);
                    let uvy = new Number(playerData.uvy);
                    if (uvx <= 1.01 && uvx >= -1.01 && uvy <= 1.01 && uvy >= -1.01 &&
                        Math.sqrt(uvx * uvx + uvy * uvy) <= 1.01) {
                        //assign only if it's valid
                        this.uvx = uvx;
                        this.uvy = uvy;
                    }
                }
            } catch (err) {
                console.log("error, input from client was not json");
            }
        };

        ws.on('message', messageListener);

        this.update = (delta, blackholes) => {
            // this.x = clampAdd(this.x, this.uvx * delta * this.vel, MAX_X, MIN_X);
            // this.y = clampAdd(this.y, this.uvy * delta * this.vel, MAX_Y, MIN_Y);
            let [sumfx, sumfy] = [0,0];
            blackholes.forEach(blackhole => {
                if(this != blackhole){
                    findGForce(this, blackhole, ({fx, fy}) => {
                        sumfx += fx;
                        sumfy += fy;
                    });
                }
            });
            findGuideForce(this, delta, ({fx, fy}) => {
                sumfx += fx;
                sumfy += fy;
            });
            boundaryClamp(this, boundary, ({out, fux, fuy, force}) => {
                if(out){
                    console.log(fux, fuy)
                    if (force > 1000)
                    force = 1000
                    sumfx += fux * this.m * force;
                    sumfy += fuy * this.m * force;
                }
            })
            this.fx = sumfx;
            this.fy = sumfy;
            findNewPos(this, delta, ({x, y}) => {
                this.x = x;
                this.y = y;
            });
            findNewVel(this, delta, ({vx, vy}) => {
                this.vx = vx;
                this.vy = vy;
            });
        }

        this.sendMessage = (message) => {
            try {
                ws.send(message);
            } catch (unableToSendError) {
                console.log("flagging client for disconnection");
                this.isDead = true;
            }
        }

        this.destroy = () => {
            console.log("closing websocket and removing listener");
            ws.removeListener("message", messageListener);
            ws.close();
        }

    }

    let client = new Client();
    clients.push(client);
});



let _firstSample = now();
let _ticks = 0;
const FREQ = 60;

async function burnTime() {
    function sleep(mili) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, mili);
        });
    }
    let current = now();
    let shouldWait = (_ticks + 1) * (1000 / FREQ) - (current - _firstSample);
    _ticks++;
    if (shouldWait > 0) {
        await sleep(shouldWait);
    }
}

// RETURNS DELTA T
function* getDelta() {

    let lastCheck = now();
    while (true) {
        //fall inline with the 60 hz

        let current = now();
        let delta = current - lastCheck;
        lastCheck = current;
        yield delta;
    }
}

Array.prototype.forEachPlaying = (func) => {
    clients.forEach(client => {
        if (client.state === 'PLAYING') {
            func(client);
        }
    });
};

//where the loop code goes
(async function mainLoop() {
    let timer = getDelta();
    while (true) {
        await burnTime();
        let delta = timer.next().value / 1000; // in seconds
        for (let i = clients.length - 1; i >= 0; i--) {
            if (clients[i].isDead) {
                clients[i].destroy();
                clients.splice(i, 1);
            }
        }
        clients.forEachPlaying(client => {
            client.update(delta, clients);
        });
        let dataObj = {
            players: []
        };
        clients.forEachPlaying(client => {
            dataObj.players.push({
                x: client.x,
                y: client.y,
                name: client.name,
                id: client.id
            })
        });
        clients.forEachPlaying(client => {
            dataObj.playerId = client.id;
            client.sendMessage(JSON.stringify(dataObj));
        })
    }
})();