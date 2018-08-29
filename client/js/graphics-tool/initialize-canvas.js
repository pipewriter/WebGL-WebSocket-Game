// Exposes canvas.width, canvas.height, canvas.el

(function createCanvas(){
    let canvas = document.getElementById("canvas");
    window.canvas.el = canvas;
    const aspectX = 16;
    const aspectY = 9;
    let mouseX = 0;
    let mouseY = 0;
    let mousedown = false;
    window.canvas.getMousePos = function getMousePos(){
        return {x: mouseX, y: mouseY};
    }
    window.canvas.getMouseDown = function getMouseDown(){
        return mousedown;
    }
    let filter;
    function setFilterVars({offsetX, offsetY, width, height}){
        filter = {offsetX, offsetY, width, height};
    }
    function setMousePos({x: curMX, y: curMY}){
        mouseX = (curMX - filter.offsetX) / filter.width;
        mouseY = (curMY - filter.offsetY) / filter.height;
    }
    function setCanvasToSize(width, height){
        //width of window
        //height of window 

        // canvas.style.width = width + "px";
        // canvas.style.height = height + "px";
        //maintain a 2 x 1 aspect ratio
        const calc = width * aspectY - height * aspectX;
        if(calc > 0){
            //width is too large
            //height is the bottleneck
            canvas.height = height;
            canvas.width = height * aspectX / aspectY;
            canvas.offsetX = (width - canvas.width)/2;
            canvas.offsetY = 0;
            canvas.el.style.left = canvas.offsetX + 'px';
            canvas.el.style.top = '0px';
        } else {
            canvas.width = width;
            canvas.height = width * aspectY / aspectX;
            canvas.offsetX = 0;
            canvas.offsetY = (height - canvas.height)/2;
            canvas.el.style.top = canvas.offsetY + 'px';
            canvas.el.style.left = '0px';
        }
        setFilterVars(canvas);
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