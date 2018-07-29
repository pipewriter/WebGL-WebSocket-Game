(() => {

    var mxVal = 0;
    var myVal = 0;
    gl = canvas.getContext("webgl");
    gl.clearColor(0,0,0,1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader,window.fragmentShader);
    gl.compileShader(fShader);
    
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader,window.vertexShader);
    gl.compileShader(vShader);

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
        gl.deleteShader(fShader);
    } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
        gl.deleteShader(vShader);
    }
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, fShader);
    gl.attachShader(shaderProgram, vShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
    }


    gl.useProgram(shaderProgram);
    
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

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

    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexArray),gl.STATIC_DRAW);
    
    triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer); //change here
    
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexArray),gl.STATIC_DRAW); //change here
    
    var vertexPositionAttrib = gl.getAttribLocation(shaderProgram, "vertexPosition"); 
    gl.enableVertexAttribArray(vertexPositionAttrib);
    gl.vertexAttribPointer(vertexPositionAttrib,3,gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT ,0); 

    var vertexTrianglenAttrib = gl.getAttribLocation(shaderProgram, "triangleNumber"); 
    gl.enableVertexAttribArray(vertexTrianglenAttrib);
    gl.vertexAttribPointer(vertexTrianglenAttrib,1,gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT ,3*Float32Array.BYTES_PER_ELEMENT); 
    
    var elapsedUniformLocation = gl.getUniformLocation(shaderProgram, 'elapsed');
    var mouseUniformLocation = gl.getUniformLocation(shaderProgram, 'mousePos');
    
    var LOOP_CONSTANT = 5;
    function repeatRender(){
        function step(timestamp) {
            var seconds = timestamp/1000;
            var elapsed = (seconds%LOOP_CONSTANT)/LOOP_CONSTANT;
            gl.uniform1f(elapsedUniformLocation, new Float32Array([elapsed]));
            gl.uniform2fv(mouseUniformLocation, new Float32Array([mxVal, myVal]));

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, indexArray.length, gl.UNSIGNED_SHORT, 0);
            
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
    repeatRender();
})();