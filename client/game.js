
(async () => {
    await initializeWebGL;

    const vd3 = [
        0, 0, 0.9, 1, 0, 0, 0.0, 1.0,
        0, 1, 0.9, 1, 0, 0, 0.0, 0.0,
        1, 0, 0.9, 0, 1, 0, 1.0, 1.0,
        1, 1, 0.9, 0, 1, 0, 1.0, 0.0
    ];
    const id3= [0, 1, 2, 1, 2, 3];
    const dt3 = await initializeImageFromConfig(imgConfig);
    
    const d4 = await window.drawpic.init("guy.png");

    const drawTri = await initializeFromConfig(config);
    let r = 0;
    let x = 0;
    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            dt3(vd3, id3);
            d4({x, y: 0, r, h: Math.sin(r/3) + 1, w: Math.cos(r/3) + 1});
            r+= 0.05;
            x = Math.sin(r)
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();