window.GAME = {};

const garguatiaConfig = {
    x: 500,
    y: 500,
    m: 200,
    r: 11.6960709
}

let player = {
    x: 0,
    y: 0,
    dx: 0.8888,
    dy: 0.5,
    uvx: 0,
    uvy: 0,
    r: 2.5
};

let npcs = [];

window.GAME.players = [];

window.GAME.planets = [];

for(let j = 0; j < 51; j++){
    for(let i = 0; i < 51; i++){
        npcs.push({
            x: 0 + i * 20,
            y: 0 + j * 20,
            dx: -100,
            dy: -100,
            t: 0
        });
    }
}

window.GAME.setInitialConstants = function setInitialConstants(
    {
        gargantua,
        playerId
    }
){
    window.GAME.gargantua = gargantua;
    window.GAME.playerId = playerId;
    console.log('GOT EM', gargantua, playerId);
};

window.GAME.updatePlayer = function updatePlayer({x, y, r}) {
    player = {
        ...player,
        x,
        y,
        r
    }
};

let serverUpdate = 0;
window.GAME.updatePlayers = function updatePlayers({players}){
    let main = players.find(element => {
        return element.id === window.GAME.playerId
    });
    window.GAME.updatePlayer(main);
    players.forEach(player => {
        let found = window.GAME.players.find(element => {
            element.id === player.id;
        })
        if(found){
            found.x = player.x;
            found.y = player.y;
            found.r = player.r;
            found.lastServerUpdate = serverUpdate;
        }else{
            window.GAME.players.push({
                x: player.x,
                y: player.y,
                dx: -100,
                dy: -100,
                r: player.r,
                lastServerUpdate: serverUpdate
            })
        }
    });
    let allPlayers = window.GAME.players;
    for(let i = allPlayers.length - 1; i >= 0; i--){
        let subPlayer = allPlayers[i];
        if(subPlayer.lastServerUpdate !== serverUpdate){
            allPlayers.splice(i, 1);
        }
    }
    serverUpdate++;
}

window.GAME.updatePlanets = function updatePlanets({planets}){
    window.GAME.planets = planets;
}

window.GAME.updateDirection = function updateDirection({mp}){
    let [x, y] = [mp.x - 0.5, mp.y - 0.5];
    let mag = Math.sqrt(x * x + y * y); 
    let [uvx, uvy] = [x/mag, y/mag];
    player = {
        ...player,
        uvx,
        uvy
    }
};

window.GAME.getPlayerDirection = function getPlayerDirection(){
    return {
        uvx: player.uvx,
        uvy: player.uvy
    }
};

function calcNewCoords ({x:nx, y:ny}, {x:px, dx, y:py, dy}, callback){
    const xDiff = px;
    const yDiff = py;
    x = (nx - xDiff)/100 + dx;
    y = (ny - yDiff)/100 + dy;
    callback({x, y});
}

window.GAME.adjustDrawCoords = function adjustDrawCoords(){
    
    const mainPlayer = player;
    npcs.forEach(npc => {
        calcNewCoords(npc, mainPlayer, ({x, y}) =>  {
            // npc = {...npc, dx:x, dy:y};
            npc.dx = x;
            npc.dy = y;
        })
    });
    window.GAME.players.forEach(player => {
        calcNewCoords(player, mainPlayer, ({x, y}) => {
            player.dx = x;
            player.dy = y;
        })
    })
    if(window.GAME.gargantua) {
        const {gargantua} = window.GAME;
        calcNewCoords(gargantua, player, ({x, y}) => {
            gargantua.dx = x;
            gargantua.dy = y;
        });
    }
    window.GAME.planets.forEach(planet => {
        calcNewCoords(planet, mainPlayer, ({x, y}) => {
            planet.dx = x;
            planet.dy = y;
        });
    })
};

(async () => {

    const drawGuy = await window.drawpic.init("./assets/images/blackhole.png");
    const drawbg = await window.drawpic.init("./assets/images/starryspace.png");
    const drawGargantua = await window.drawpic.init('./assets/images/supermassive.png');

    const drawPlanets = [
        await window.drawpic.init('./assets/images/planets/Planet1.png'),
        await window.drawpic.init('./assets/images/planets/Planet2.png'),
        await window.drawpic.init('./assets/images/planets/Planet3.png'),
        await window.drawpic.init('./assets/images/planets/Planet4.png'),
        await window.drawpic.init('./assets/images/planets/Planet5.png'),
        await window.drawpic.init('./assets/images/planets/Planet6.png'),
        await window.drawpic.init('./assets/images/planets/Planet7.png'),
        await window.drawpic.init('./assets/images/planets/Planet8.png')
    ]

    const drawCircle = await window.drawCircle.init({x: 500, y: 500, r: 500});

    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;
            
            window.GAME.adjustDrawCoords();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            let mp = window.canvas.getMousePos();

            window.GAME.updateDirection({mp});

            npcs.forEach(npc => {
                if(npc.dx+0.2 > 0 && npc.dx < 2.0
                    && npc.dy + 0.2 > 0 && npc.dy < 1.2){
                        drawbg({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2});
                    }
            });

            drawCircle({x: player.x, y: player.y})

            if(window.GAME.gargantua){
                const {gargantua} = window.GAME;
                drawGargantua({x: gargantua.dx, y: gargantua.dy, r: 0, h: 0.05 * 2 * gargantua.r / 2.5,
                    w: 0.05 * 2 * gargantua.r / 2.5});
            }

            window.GAME.planets.forEach(planet => {
                drawPlanets[planet.type](
                    {
                        x: planet.dx,
                        y: planet.dy,
                        r: 0,
                        h: 0.05 * planet.r / 2.5,
                        w: 0.05 * planet.r / 2.5
                    }
                )
            });
            
            window.GAME.players.forEach(player => {
                drawGuy({x: player.dx, y: player.dy, r: 0, h: 0.05 * player.r / 2.5, w: 0.05 * player.r / 2.5});
            });
            
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();