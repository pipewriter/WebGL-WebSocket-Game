window.GAME = {};

(function createCanvas(){
    window.GAME.canvas = document.getElementById("canvas");
    const shell = document.getElementById('shell');
    const aspectX = 16;
    const aspectY = 9;
    let mouseX = 0;
    let mouseY = 0;
    let mousedown = false;
    window.GAME.getMousePos = function getMousePos(){
        return {x: mouseX, y: mouseY};
    }
    window.GAME.getMouseDown = function getMouseDown(){
        return mousedown;
    }
    let filter;
    function setFilterVars({offsetX, offsetY, width, height}){
        filter = {offsetX, offsetY, width, height};
        window.GAME.windowInfo = filter;
    }
    function setMousePos({x: curMX, y: curMY}){
        mouseX = (curMX) / filter.width;
        mouseY = (curMY) / filter.height;
    }
    function setCanvasToSize(width, height){
        
        let values = {
            width,
            height
        };

        const calc = width * aspectY - height * aspectX;
        values.offsetX = 0;
        values.offsetY = 0;
        if(calc > 0){
            values.gameWidth = height * aspectX / aspectY;
            values.gameHeight = height;
            values.offsetX = (width - values.gameWidth)/2;
        } else {
            values.gameWidth = width;
            values.gameHeight = width * aspectY / aspectX;
            values.offsetY = (height - values.gameHeight)/2;

        }
        const {gameWidth, gameHeight, offsetX, offsetY} = values;
        shell.style.width = gameWidth + 'px';
        shell.style.height = gameHeight + 'px';
        shell.style.left = offsetX + 'px';
        shell.style.top = offsetY + 'px';

        const {canvas} = window.GAME;
        canvas.width = gameWidth;
        canvas.height = gameHeight;

        setFilterVars(values);
    };
    setCanvasToSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function windowResize(resizeEvent){
        const {innerHeight:height, innerWidth:width} = resizeEvent.currentTarget || {};
        setCanvasToSize(width, height);
    });
    window.onmousemove = (event) => {
        setMousePos({x: event.clientX, y: event.clientY});
    };
    window.onmousedown = (event) => {
        mousedown = true;
    }
    window.onmouseup = (event) => {
        mousedown = false;
    }
})();