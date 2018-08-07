window.initializeWebGL = (async function initializeWebGL(){
    let fragmentShaderCode = await window.utils.makeRequest("GET", "fragmentShader.glsl");
    let vertexShaderCode = await window.utils.makeRequest("GET", "vertexShader.glsl");
    gl = window.canvas.el.getContext("webgl");
    gl.clearColor(0.8,0.5,0,1.0);
    gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderCode);
    gl.compileShader(fShader);
    
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderCode);
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
    
    gl.viewport(0, 0, window.canvas.width, window.canvas.height);
    window.addEventListener("resize", () => {
        gl.viewport(0, 0, window.canvas.width, window.canvas.height);
    })
    
    window.shaderProgram = shaderProgram;
    window.gl = gl;
})();