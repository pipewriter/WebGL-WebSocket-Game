(() => {
    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.backgroundColor = "black";
    window.cw = canvas.width;
    window.ch = canvas.height;
})();

//Outputs: ch cw 