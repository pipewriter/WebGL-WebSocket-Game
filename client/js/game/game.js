window.GAME = {};

let player = {
    x: 0,
    y: 0,
    dx: 0.8,
    dy: 0.5,
    uvx: 0,
    uvy: 0
};

let npcs = [];

window.GAME.players = [];

for(let i = 0; i < 50; i++){
    npcs.push({
        x: 500 + i * 25,
        y: 500,
        dx: -100,
        dy: -100,
        t: 0
    });
}
for(let i = 0; i < 50; i++){
    npcs.push({
        x: 500 - i * 25,
        y: 500 ,
        dx: -100,
        dy: -100,
        t: 1
    });
}
for(let i = 0; i < 50; i++){
    npcs.push({
        x: 500,
        y: 500 + i * 25,
        dx: -100,
        dy: -100,
        t: 2
    });
}
for(let i = 0; i < 50; i++){
    npcs.push({
        x: 500,
        y: 500 - i * 25,
        dx: -100,
        dy: -100,
        t: 3
    });
}
window.GAME.updatePlayer = function updatePlayer({x, y}) {
    player.x = x;
    player.y = y;
};

let serverUpdate = 0;
window.GAME.updatePlayers = function updatePlayers({players, playerId}){
    let main = players.find(element => {
        return element.id === playerId
    });
    window.GAME.updatePlayer(main);
    players.forEach(player => {
        let found = window.GAME.players.find(element => {
            element.id === player.id;
        })
        if(found){
            found.x = player.x;
            found.y = player.y;
            found.lastServerUpdate = serverUpdate;
        }else{
            window.GAME.players.push({
                x: player.x,
                y: player.y,
                dx: -100,
                dy: -100,
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

window.GAME.adjustDrawCoords = function adjustDrawCoords(){
    const xDiff = player.x;
    const yDiff = player.y;
    let mainPlayer = player;
    npcs.forEach(npc => {
        npc.dx = (npc.x - xDiff)/100 + player.dx;
        npc.dy = (npc.y - yDiff)/100 + player.dy;
        // npc.dy = (npc.y - yDiff)/100;
        // npc.dx = 0.5;
        // npc.dy = 0.5;
    });
    window.GAME.players.forEach(player => {
        player.dx = (player.x - xDiff)/100 + mainPlayer.dx;
        player.dy = (player.y - yDiff)/100 + mainPlayer.dy;
    })
};

(async () => {
    const drawGuy = await window.drawpic.init("./assets/images/mari.png");
    const d4 = await window.drawpic.init("./assets/images/face-big.png");
    const d5 = await window.drawpic.init("./assets/images/dino.png");
    const d6 = await window.drawpic.init("./assets/images/mick.png");
    const d7 = await window.drawpic.init("./assets/images/satu.png");

    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;
            
            window.GAME.adjustDrawCoords();

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            let mp = window.canvas.getMousePos();
            window.GAME.updateDirection({mp});
            // d4({x: (mp.x*16/9) +0.02, y: (mp.y)+0.02,r, h: 0.04, w: 0.04})
            // {
            //     let npc = npcs[0];
            //     d4({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2})
            //     // console.log(npc)
            // }
            npcs.forEach(npc => {
                switch(npc.t){
                    case 0: d4({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2});break;
                    case 1: d5({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2});break;
                    case 2: d6({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2});break;
                    case 3: d7({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2});break;
                }
            });
            window.GAME.players.forEach(player => {
                drawGuy({x: player.dx, y: player.dy, r: 0, h: 0.3, w: 0.3});
                console.log(player)
            })
            // drawGuy({x: 0.8, y: 0.5, r: 0, h: 0.2, w: 0.2});

            // d4({x: (mp.x*16/9) +0.02, y: (mp.y)+0.02,r, h: 0.04, w: 0.04})
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();