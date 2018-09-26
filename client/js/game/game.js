const garguatiaConfig = {
    x: 500,
    y: 500,
    m: 200,
    r: 11.6960709
}

let player = {
    x: 0,
    y: 0,
    dx: 0.888,
    dy: 0.5,
    uvx: 0,
    uvy: 0,
    r: 2.5
};

window.GAME.players = [];

window.GAME.planets = [];

window.GAME.setInitialConstants = function setInitialConstants(
    {
        gargantua,
        playerId
    }
){
    window.GAME.gargantua = gargantua;
    window.GAME.playerId = playerId;
};

window.GAME.updatePlayer = function updatePlayer({x, y, r, score}) {
    player = {
        ...player,
        x,
        y,
        r,
        score
    }
};

let serverUpdate = 0;
window.GAME.updatePlayers = function updatePlayers({players}){
    let main = players.find(element => {
        return element.id === window.GAME.playerId
    });
    window.GAME.updatePlayer(main);
    players.forEach(player => {
        let found = window.GAME.players.find(element => 
            element.id === player.id
        );
        if(found){
            found.x = player.x;
            found.y = player.y;
            found.r = player.r;
            found.lastServerUpdate = serverUpdate;
            found.name = player.name;
            found.score = player.score;
        }else{
            window.GAME.players.push({
                id: player.id,
                name: player.name,
                x: player.x,
                y: player.y,
                dx: -100,
                dy: -100,
                r: player.r,
                lastServerUpdate: serverUpdate,
                nameTag: window.GAME.textFiller({text:player.name}),
                score: player.score
            })
        }
    });
    let allPlayers = window.GAME.players;
    for(let i = allPlayers.length - 1; i >= 0; i--){
        let subPlayer = allPlayers[i];
        if(subPlayer.lastServerUpdate !== serverUpdate){
            // Delete an inactive player
            subPlayer.nameTag.delete();
            allPlayers.splice(i, 1);
        }
    }
    serverUpdate++;

    window.GAME.setHiscores(players, window.GAME.playerId);
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

const tileLength = 0.2;
const stars = {
    columns: Math.ceil(1.7777 / tileLength) + 1,
    rows: Math.ceil(1 / tileLength) + 1
}
starCoordList = []
console.log(stars)
for(let i = 0; i < stars.rows * stars.columns; i++){
    starCoordList.push({x: 0, y: 0});
}
console.log(starCoordList)

//translate everything
window.GAME.adjustDrawCoords = function adjustDrawCoords(){
    
    const mainPlayer = player;

    //Generate fresh starry coords
    calcNewCoords({x: -1000000, y: -1000000}, mainPlayer, ({x, y}) => {
        let translation = {
            x: (x + tileLength)%tileLength + tileLength/2,
            y: (y + tileLength)%tileLength + tileLength/2
        }
        for(let column = 0; column < stars.columns; column++){
            const columnX = tileLength * column + translation.x;
            for(let row = 0; row < stars.rows; row++){
                const rowY = tileLength * row + translation.y;
                let coord = starCoordList[column * stars.rows + row];
                coord.x = columnX;
                coord.y = rowY;
            }
        }
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
    const drawCrown = await window.drawpic.init('./assets/images/crown7.png');


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
            let mp = window.GAME.getMousePos();

            window.GAME.updateDirection({mp});

            starCoordList.forEach(starCoord => {
                drawbg({...starCoord, r: 0, h: 0.2, w: 0.2})
            })

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
            
            const {offsetX, offsetY, width, height} = window.GAME.windowInfo;
            const [gw, gh] = [ width - offsetX * 2, height - offsetY * 2];

            let highestScoredPlayer;
            let highestScore = 0;

            window.GAME.players.forEach(player => {
                if(player.score > highestScore){
                    highestScore = player.score;
                    highestScoredPlayer = player;
                }
                
                const playerDiameter = 0.05 * player.r / 2.5;
                drawGuy({x: player.dx, y: player.dy, r: 0, h: playerDiameter, w: playerDiameter});

                const textConfig = {
                    x: player.dx/16*9*gw + offsetX, 
                    y: player.dy*gh + offsetY,
                    width: playerDiameter * gh * 0.8,
                    height: playerDiameter * gh * 0.8,
                    text: player.name
                }
                const {a, b, c, d} = {
                    a: textConfig.x - offsetX < 0,
                    b: textConfig.x - offsetX + textConfig.width/2 > gw,
                    c: textConfig.y - offsetY < 0, //above the screen
                    d: textConfig.y - offsetY + textConfig.height/2> gh
                }

                if(a || b || c || d){
                    player.nameTag.hide();
                }else{
                    player.nameTag.show();
                    player.nameTag.move(textConfig);
                }
            });

            if(highestScoredPlayer){
                let player = highestScoredPlayer;
                const playerDiameter = 0.05 * player.r / 2.5;
                drawCrown({x: player.dx, y: player.dy - playerDiameter/2*1.31, r: 0, h: playerDiameter/2, w: playerDiameter/2/6*8});
            }

            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();