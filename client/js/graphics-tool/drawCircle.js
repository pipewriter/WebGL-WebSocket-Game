window.drawCircle = {};

(() => {
    window.drawCircle.init = async function (){
        const circleConfig = {
            vertFile: "./assets/shaders/circleVert.glsl",
            fragFile: "./assets/shaders/circleFrag.glsl",
            vertAttributes: [
                {
                    handle: "vertPos",
                    size: 3
                }
            ]
        }
        let cir = await initializeFromConfig(circleConfig);
        return function draw({x, y, r}){
            const vd = [
                -1,  1, 0.9,
                 1,  1, 0.9,
                -1, -1, 0.9,
                 1, -1, 0.9
            ]
            id = [0, 1, 2, 1, 2, 3];
            cir(vd, id);
        }
    }
})();