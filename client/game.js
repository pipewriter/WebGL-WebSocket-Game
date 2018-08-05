
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
    console.log(vertexArray)
    console.log(indexArray)
    console.log(new Float32Array(vertexArray))

    // vertexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

    // gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexArray),gl.STATIC_DRAW);
    
    // triangleBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer); //change here
    
    
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexArray),gl.STATIC_DRAW); //change here
    
    // var vertexPositionAttrib = gl.getAttribLocation(shaderProgram, "vertexPosition"); 
    // gl.enableVertexAttribArray(vertexPositionAttrib);
    // gl.vertexAttribPointer(vertexPositionAttrib,3,gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT ,0); 

    // var vertexTrianglenAttrib = gl.getAttribLocation(shaderProgram, "triangleNumber"); 
    // gl.enableVertexAttribArray(vertexTrianglenAttrib);
    // gl.vertexAttribPointer(vertexTrianglenAttrib,1,gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT ,3*Float32Array.BYTES_PER_ELEMENT); 
    
    // var elapsedUniformLocation = gl.getUniformLocation(shaderProgram, 'elapsed');
    // var mouseUniformLocation = gl.getUniformLocation(shaderProgram, 'mousePos');
    

    // const vertData = [
    //     0.8, 0.8, 10.0,     0.2, 0.3, 3.0, 
    //     0.2, 0.1, 10.0,     0.2, 0.4, 3.0, 
    //     0.1, 0.2, 10.0,     0.3, 0.8, 3.0
    // ];
    const vertData = [
        0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, 0.7, 0.2, 0.5, 0.7, 0.5,
        0.3, 0.6, 0.8, 0.3, 0.6, 0.8
    ];

    const indexData = [0, 1, 2];
    // const indexData = [0, 1, 2, 0, 1, 2, 2, 1, 3, 1, 3, 2, 4, 5, 6];
    // const indexData = [9, 3, 1, 3, 2, 1];
    // const indexData = [2, 1, 0, 2, 1,9,3, 9];

    const vd2 = [
        -0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
        -0.5, -0.7, 0.2, 0.5, 0.7, 0.5,
        -0.3, -0.6, 0.8, 0.3, 0.6, 0.8
    ];
    const id2 = [0, 1, 2];
    const dt2 = await initializeFromConfig(config);

    // const drawTri = await initializeFromConfig(config);
    console.log(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));
    var LOOP_CONSTANT = 200;
    function repeatRender(){
        function step(timestamp) {

            var seconds = timestamp/1000;
            var elapsed = (seconds%LOOP_CONSTANT)/LOOP_CONSTANT;
            // gl.uniform1f(elapsedUniformLocation, new Float32Array([elapsed]));
            // gl.uniform2fv(mouseUniformLocation, new Float32Array([mxVal, myVal]));

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            // gl.drawElements(gl.TRIANGLES, indexArray.length, gl.UNSIGNED_SHORT, 0);
            // drawTri(vertData, indexData);
            dt2(vd2, id2);
            return;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();