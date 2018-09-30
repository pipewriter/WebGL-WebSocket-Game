const WebSocket = require('ws');
const now = require("performance-now")
let findGForce = require('./physics/gravitationalForce');
let specialGravity = require('./physics/specialGravity');
let boundaryClamp = require('./physics/boundaryClamp');
let {findNewPos, findNewVel} = require('./physics/kinematics');
let findGuideForce = require('./physics/guideForce');
let collidedWith = require('./physics/collidedWith');
let spawnControl = require('./physics/spawnControl');
let orbitalVelocity = require('./physics/orbitalVelocity');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

const INIT_X = 500;
const INIT_Y = 500;

boundary = {
    x: 500,
    y: 500,
    r: 500,
}

planetBoundary = {
    x: 500,
    y: 500,
    r: 600,
}


let id = 0;
const MassToRad = 2;
function getRad(mass){
    return MassToRad * Math.pow(mass, 1/3);
}

planets = [];

for(let i = 0; i < 400; i++){
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

const gargMass = 1000;
const gargantuaConfig = {
    x: 500,
    y: 500,
    m: gargMass,
    r: getRad(gargMass)
}

function increaseMass(blackhole, loser){

    blackhole.unlimitedMass += loser.m;
    let newMass = gargMass - gargMass * Math.exp(-blackhole.unlimitedMass/1000);

    let deltaM = newMass - blackhole.m; //how much bigger;
    blackhole.vx = (blackhole.vx * blackhole.m +  loser.vx * deltaM)/newMass;
    blackhole.vy = (blackhole.vy * blackhole.m +  loser.vy * deltaM)/newMass;

    blackhole.m = newMass;
}

function respawn(thing, isPlanet){
    if(thing.im){
        thing.m = thing.im;
        thing.r = getRad(thing.m);
    }
    spawnControl.getSpawn(({x, y}, isPlanet) => {
        thing.x = x;
        thing.y = y;
        thing.fx = 0;
        thing.fy = 0;
        thing.vx = 0;
        thing.vy = 0;
    });
    orbitalVelocity(thing, gargantuaConfig, 1000, ({vx, vy}) => {
        if(isPlanet){
            vx *= 0.5;
            vy *= 0.5;
        }
        thing.vx = vx;
        thing.vy = vy;
    })
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
        this.m += Math.random() /1000;
        this.unlimitedMass = this.m;
        this.fx = 0;
        this.fy = 0;
        
        this.r = getRad(this.m);
        this.id = id++;
        this.guideStrength = 100;
        this.isSwallowed = false;

        respawn(this);

        let messageListener = (message) => {
            try {
                let playerData = JSON.parse(message);
                if (this.state === 'JOINED') {

                    if (playerData.name) {
                        this.name = playerData.name
                    } else {
                        this.name = 'unnamed';
                    }

                    this.sendMessage(JSON.stringify(
                        {
                            type: 0,
                            gargantua: gargantuaConfig,
                            playerId: this.id
                        }
                    ));

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
            specialGravity(this, gargantuaConfig, ({fx, fy}) => {
                sumfx += fx;
                sumfy += fy;
            });
            findGuideForce(this, delta, ({fx, fy}) => {
                sumfx += fx * 0.3 * this.m / (1 + this.m/250);
                sumfy += fy * 0.3 * this.m / (1 + this.m/250);
            });
            boundaryClamp(this, boundary, ({out, fux, fuy, force}) => {
                if(out){
                    if (force > 1000)
                    force = 1000
                    sumfx += fux * this.m * force;
                    sumfy += fuy * this.m * force;
                    this.vx *= .99;
                    this.vy *= .99;
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
                                increaseMass(this, blackhole);
                                this.r = getRad(this.m);
                                blackhole.sendFinal = true
                                blackhole.results = {
                                    type: 2,
                                    killerType: 1,
                                    reason: this.name,
                                    finalScore: blackhole.m
                                }
                                blackhole.isDead = true
                            }
                        }
                    });
                }
            });
            planets.forEach(planet => {
                collidedWith(this, planet, ({collided}) => {
                    if(collided){
                        increaseMass(this, planet);
                        this.r = getRad(this.m);
                        respawn(planet, true);
                    }
                })
            });
            collidedWith(this, gargantuaConfig, ({collided}) => {
                const blackhole = gargantuaConfig;
                if(collided){
                    console.log('gargantuad!');
                    this.isDead = true
                    this.sendFinal = true
                    this.results = {
                        type: 2,
                        killerType: 0,
                        reason: 'Gargantua',
                        finalScore: this.m
                    }
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
            try{
                if(this.sendFinal){
                    const tombstone = JSON.stringify(this.results);
                    ws.send(tombstone);
                }
            }catch(e){}
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
        // clients.forEachPlaying(blackhole => {
        //     blackhole.m *= .999;
        // });
        planets.forEach(planet => {
            (function planetUpdate(){
                let sumfx = 0;
                let sumfy = 0;
                findGForce(planet, gargantuaConfig, ({fx, fy}) => {
                    const tweak = .5;
                    sumfx += fx * tweak;
                    sumfy += fy * tweak;
                });
                clients.forEach(blackhole => {
                    findGForce(planet, blackhole, ({fx, fy}) => {
                        sumfx += fx;
                        sumfy += fy;
                    }); 
                })
                planet.fx = sumfx;
                planet.fy = sumfy;
                findNewPos(planet, delta, ({x, y}) => {
                    planet.x = x;
                    planet.y = y;
                });
                findNewVel(planet, delta, ({vx, vy}) => {
                    planet.vx = vx;
                    planet.vy = vy;
                });
                collidedWith(planet, gargantuaConfig, ({collided}) => {
                    if(collided){
                        respawn(planet, true);
                    }
                });
                boundaryClamp(planet, boundary, ({out, fux, fuy, force}) => {
                    if(out){
                        respawn(planet, true);
                    }
                })
            })();
        });
        let truncateN = n => Number(Number(n).toFixed(4));
        let gameData = JSON.stringify({
            type: 1,
            planets: planets.map(({type, x, y, r}) => ({
                type,
                x: truncateN(x),
                y: truncateN(y),
                r: truncateN(r),
            })),
            players: clients.map(client => ({
                x: client.x,
                y: client.y,
                name: client.name,
                id: client.id,
                r: client.r,
                score: client.m
            })) 
        })
        clients.forEachPlaying(client => {
            client.sendMessage(gameData);
        })
    }
})();