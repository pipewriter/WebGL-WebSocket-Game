
(async () => {
    var mxVal = 0.5;
    var myVal = 0.5;
    await initializeWebGL;

    var vertexArray = [];
    var indexArray = [];
    for(var i = 0; i < 3000; i++){
        var triNum = Math.floor(i/3);
        if(i%3 == 0){
            vertexArray.push(0.05,-0.07,0,triNum);
        }
        if(i%3 == 1){
            vertexArray.push(-0.05,-0.07,0,triNum);            
        }
        if(i%3 == 2){
            vertexArray.push(0,0.07,0,triNum);
            indexArray.push(i-2, i-1, i);
        }
    }

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
        0, 0, 0.9, 0.5, 0.5, 0.5, 1.0, 1.0,
        0, 0.3, 0.9, 0.5, 0.7, 0.5, 0.0, 1.0,
        0.3, 0, 0.9, 0.3, 0.6, 0.8, 1.0, 0.0
    ];
    const id3= [0, 1, 2];
    const dt3 = await initializeImageFromConfig(imgConfig);

    const drawTri = await initializeFromConfig(config);
    console.log(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));
    var LOOP_CONSTANT = 200;
    function repeatRender(){
        function step(timestamp) {

            var seconds = timestamp/1000;
            var elapsed = (seconds%LOOP_CONSTANT)/LOOP_CONSTANT;

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            drawTri(vertData, indexData);
            dt2(vd2, id2);
            dt3(vd3, id3);
            return;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();