
let player = {
    x: 0,
    y: 0,
    dx: 0.8,
    dy: 0.5,
    uvx: 0,
    uvy: 0
};

let npcs = [];

for(let i = 0; i < 50; i++){
    npcs.push({
        x: 500 + i * 25,
        y: 500,
        dx: -100,
        dy: -100
    });
}

window.GAME = {};
window.GAME.updatePlayer = function updatePlayer({x, y}) {
    player.x = x;
    player.y = y;
};

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
    npcs.forEach(npc => {
        npc.dx = (npc.x - xDiff)/100 + player.dx;
        npc.dy = (npc.y - yDiff)/100 + player.dy;
        // npc.dy = (npc.y - yDiff)/100;
        // npc.dx = 0.5;
        // npc.dy = 0.5;
    });
};

(async () => {
    const drawGuy = await window.drawpic.init("./assets/images/guy.png");
    const d4 = await window.drawpic.init("./assets/images/face-big.png");
    const d5 = await window.drawpic.init("./assets/images/guy.png");
    const d6 = await window.drawpic.init("./assets/images/guy.png");
    const d7 = await window.drawpic.init("./assets/images/guy.png");

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
                d4({x: npc.dx, y: npc.dy, r: 0, h: 0.2, w: 0.2})
            });

            // d4({x: (mp.x*16/9) +0.02, y: (mp.y)+0.02,r, h: 0.04, w: 0.04})
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();