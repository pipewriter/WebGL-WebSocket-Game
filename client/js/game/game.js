
(async () => {
    initializeWebGL;

    const vd3 = [
        0, 0, 0.9, 1, 0, 0, 0.0, 1.0,
        0, 1, 0.9, 1, 0, 0, 0.0, 0.0,
        1, 0, 0.9, 0, 1, 0, 1.0, 1.0,
        1, 1, 0.9, 0, 1, 0, 1.0, 0.0
    ];
    const id3= [0, 1, 2, 1, 2, 3];
    
    const d4 = await window.drawpic.init("./assets/images/cursor.png");
    const d5 = await window.drawpic.init("./assets/images/guy.png");
    const d6 = await window.drawpic.init("./assets/images/guy.png");

    let r = 0;
    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            let mp = window.canvas.getMousePos();
            // d4({x: (mp.x*2-1)*16/9, y: -(mp.y*2-1), r, h:  1, w: 1});
            // d4({x: 1*16/10, y: 0.1, r, h:  0.2, w: 0.2});
            d5({x: 0.5, y: 0.5,r, h:  1, w: 1})
            d6({x: 1, y: 0.5,r, h:  1, w: 1})
            d4({x: (mp.x*16/9) +0.02, y: (mp.y)+0.02,r, h: 0.04, w: 0.04})
            // r+= 0.05;
            x = Math.sin(r)
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();