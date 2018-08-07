
(async () => {
    await initializeWebGL;

    const vertData = [
        0, 0, 0.5, 0.5, 0.5, 0.5,
        0, 0.7, 0.2, 0.5, 0.7, 0.5,
        0.5, 0.6, 0.8, 0.3, 0.6, 0.8
    ];

    const indexData = [0, 1, 2];

    const vd2 = [
        -0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
        -0.5, -0.7, 0.2, 0.5, 0.7, 0.5,
        -0.3, -0.6, 0.8, 0.3, 0.6, 0.8
    ];
    const id2 = [0, 1, 2];
    const dt2 = await initializeFromConfig(config);

    const vd3 = [
        0, 0, 0.9, 0, 0, 0, 1.0, 1.0,
        0, 0.3, 0.9, 1, 1, 1, 0.0, 1.0,
        0.3, 0, 0.9, 0, 0, 0, 1.0, 0.0
    ];
    const id3= [0, 1, 2];
    const dt3 = await initializeImageFromConfig(imgConfig);

    const drawTri = await initializeFromConfig(config);
    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            drawTri(vertData, indexData);
            dt2(vd2, id2);
            dt3(vd3, id3);
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();