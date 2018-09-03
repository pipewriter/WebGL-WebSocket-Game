window.drawCircle = {};

(() => {
    window.drawCircle.init = async function (
            {
                x: bx,
                y: by,
                r: br
            }
        ){
        const circleConfig = {
            vertFile: "./assets/shaders/circleVert.glsl",
            fragFile: "./assets/shaders/circleFrag.glsl",
            vertAttributes: [
                {
                    handle: "vertPos",
                    size: 3
                }
            ],
            uniforms: [
                {
                    handle: 'dist',
                    type: 'vec2'
                },
                {
                    handle: 'radius',
                    type: 'float'
                }
            ]
        }
        let cir = await initializeFromConfig(circleConfig);
        return function draw({x: px, y: py}){
            const [dx, dy] = [bx - px, by - py];
            const uniformData = {dist: [dx, dy], radius: br};
            const vd = [
                -1,  1, 0.9,
                 1,  1, 0.9,
                -1, -1, 0.9,
                 1, -1, 0.9
            ]
            id = [0, 1, 2, 1, 2, 3];
            cir(vd, id, uniformData);
        }
    }
})();