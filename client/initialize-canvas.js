// Exposes canvas.width, canvas.height, canvas.el

(function createCanvas(){
    let canvas = document.getElementById("canvas");
    window.canvas.el = canvas;
    function setCanvasToSize(width, height){
        canvas.width = width;
        canvas.height = height;
        // canvas.style.width = width + "px";
        // canvas.style.height = height + "px";
        window.canvas.width = canvas.width;
        window.canvas.height = canvas.height;
    };
    setCanvasToSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function windowResize(resizeEvent){
        const {innerHeight:height, innerWidth:width} = resizeEvent.currentTarget || {};
        setCanvasToSize(width, height);
    });
})();