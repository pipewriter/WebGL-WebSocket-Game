const WebSocket = require('ws');
const now = require("performance-now")
let findGForce = require('./physics/gravitationalForce');
let boundaryClamp = require('./physics/boundaryClamp');
let {findNewPos, findNewVel} = require('./physics/kinematics');
let findGuideForce = require('./physics/guideForce');
let collidedWith = require('./physics/collidedWith');
let spawnControl = require('./physics/spawnControl');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

const INIT_X = 500;
const INIT_Y = 500;

boundary = {
    x: 500,
    y: 500,
    r: 500,
}


let id = 0;
const MassToRad = 2;
function getRad(mass){
    return MassToRad * Math.pow(mass, 1/3);
}


planets = [
    {
        type: 0,
        x: 800,
        y: 500,
        m: 2,
        r: getRad(2),
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0
    },
    {
        type: 1,
        x: 850,
        y: 500,
        m: 3,
        r: getRad(3),
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0
    }
] 

for(let i = 0; i < 100; i++){
    let m = Math.random() * 2.5 + 0.5 
    planets.push({
        type: Math.floor(Math.random() * 8),
        x: 500,
        y: 500,
        m,
        r: getRad(m),
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0
    });
}

const gargantuaConfig = {
    x: 500,
    y: 500,
    m: 200,
    r: 11.6960709
}

function respawn(thing){
    spawnControl.getSpawn(({x, y}) => {
        thing.x = x;
        thing.y = y;
        thing.fx = 0;
        thing.fy = 0;
        thing.vx = 0;
        thing.vy = 0;
    });
}

wss.on('connection', function connection(ws) {
    function Client() {
        this.state = 'JOINED';
        this.uvx = 0;
        this.uvy = 0;
        spawnControl.getSpawn(({x, y}) => {
            this.x = x;
            this.y = y;
        })
        this.vx = 0;
        this.vy = 0;
        this.m = 4;
        this.fx = 0;
        this.fy = 0;
        
        this.r = getRad(this.m);
        this.id = id++;
        this.guideStrength = 100;
        this.isSwallowed = false;

        if(id % 2 === 0){
            this.m = 2.1;
        }

        let messageListener = (message) => {
            try {
                let playerData = JSON.parse(message);
                if (this.state === 'JOINED') {

                    if (playerData.name) {
                        this.name = playerData.name
                    } else {
                        this.name = 'unnamed horse';
                    }

                    this.sendMessage(JSON.stringify({type: 0, gargantua: gargantuaConfig}));

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
            findGForce(this, gargantuaConfig, ({fx, fy}) => {
                sumfx += fx;
                sumfy += fy;
            });
            findGuideForce(this, delta, ({fx, fy}) => {
                sumfx += fx * 0.3 * this.m;
                sumfy += fy * 0.3 * this.m;
            });
            boundaryClamp(this, boundary, ({out, fux, fuy, force}) => {
                if(out){
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
            blackholes.forEach(blackhole => {
                if(this != blackhole){
                        collidedWith(this, blackhole, ({collided}) => {
                        if(collided){
                            if(this.m > blackhole.m && !blackhole.isSwallowed){
                                this.m += blackhole.m;
                                this.r = getRad(this.m);
                                console.log('GROW!');
                                // blackhole.isSwallowed = true;
                                respawn(blackhole);
                            }
                        }
                    });
                }
            });
            planets.forEach(planet => {
                collidedWith(this, planet, ({collided}) => {
                    if(collided){
                        this.m += planet.m;
                        this.r = getRad(this.m);
                        respawn(planet);
                    }
                })
            });
            collidedWith(this, gargantuaConfig, ({collided}) => {
                const blackhole = gargantuaConfig;
                if(collided){
                    console.log('gargantuad!');
                    respawn(this);
                }
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
        planets.forEach(planet => {
            collidedWith(planet, gargantuaConfig, ({collided}) => {
                if(collided){
                    respawn(planet);
                }
            })
        })
        let dataObj = {
            type: 1,
            players: [],
            planets
        };
        clients.forEachPlaying(client => {
            const {x, y, name, id, r} = client;
            dataObj.players.push({
                x,
                y,
                name,
                id,
                r
            })
        });
        clients.forEachPlaying(client => {
            dataObj.playerId = client.id;
            client.sendMessage(JSON.stringify(dataObj));
        })
    }
})();