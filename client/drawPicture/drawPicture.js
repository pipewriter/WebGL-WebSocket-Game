window.drawpic = {};
window.drawpic.config = {
    vertFile: "drawPicture/vert.glsl",
    fragFile: "drawPicture/frag.glsl",
    imageUrl: "guy.png",
    vertAttributes: [
        {
            handle: "vertPos",
            size: 3
        },
        {
            handle: "vertColor",
            size:3
        },
        {
            handle: "textureCord",
            size: 2
        }
    ]
}

window.drawpic.stateSchema = {
    x: 0,
    y: 0,
    r: 0, //rotation in radians
    h: 1,
    w: 1,
}
window.drawpic.init = async function initDrawPic(imageUrl){
    let img = await initializeImageFromConfig({...window.drawpic.config, imageUrl});
    return function draw({x, y, r, h, w}){
        let sq2 = Math.sqrt(2);
        let d1 = Math.sin(Math.PI/4*1 + r)*sq2*(h/2);
        let d2 = Math.sin(Math.PI/4*2 + r)*sq2*(h/2);
        let d3 = Math.sin(Math.PI/4*3 + r)*sq2*(h/2);
        let d4 = Math.sin(Math.PI/4*4 + r)*sq2*(h/2);
        let e1 = Math.cos(Math.PI/4*1 + r)*sq2*(w/2);
        let e2 = Math.cos(Math.PI/4*2 + r)*sq2*(w/2);
        let e3 = Math.cos(Math.PI/4*3 + r)*sq2*(w/2);
        let e4 = Math.cos(Math.PI/4*4 + r)*sq2*(w/2);
        const vd = [
            e4, d4, 0.9, 1, 0, 0, 0.0, 1.0,
            e3, d3, 0.9, 1, 0, 0, 0.0, 0.0,
            e2, d2, 0.9, 0, 1, 0, 1.0, 1.0,
            e1, d1, 0.9, 0, 1, 0, 1.0, 0.0
        ];
        const id= [0, 1, 2, 1, 2, 3];
        img(vd, id);
    }
}