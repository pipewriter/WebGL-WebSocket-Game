window.initializeWebGL = (function initializeWebGL(){
    gl = window.GAME.canvas.getContext("webgl");
    gl.clearColor(0,0,0,1.0);
    gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    window.gl = gl;
})();