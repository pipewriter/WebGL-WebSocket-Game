window.drawpic = {};
window.drawpic.config = {
    vertFile: "drawPicture/vert.glsl",
    fragFile: "drawPicture/frag.glsl",
    vertAttributes: [
        {
            handle: "vertPos",
            size: 3
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
        let dist = Math.sqrt(Math.pow(h/2, 2) + Math.pow(w/2, 2));
        let a = Math.atan2(h/2, w/2)
        let [a1, a2, a3, a4] = [
            a,
            Math.PI - a,
            a + Math.PI,
            -a
        ];
        let d1 = y + Math.sin(a1 + r)*(dist);
        let d2 = y + Math.sin(a2 + r)*(dist);
        let d3 = y + Math.sin(a3 + r)*(dist);
        let d4 = y + Math.sin(a4 + r)*(dist);
        let e1 = x + Math.cos(a1 + r)*(dist);
        let e2 = x + Math.cos(a2 + r)*(dist);
        let e3 = x + Math.cos(a3 + r)*(dist);
        let e4 = x + Math.cos(a4 + r)*(dist);
        const vd = [
            e4, d4, 0.9, 1.0, 0.0,
            e3, d3, 0.9, 0.0, 0.0,
            e2, d2, 0.9, 0.0, 1.0,
            e1, d1, 0.9, 1.0, 1.0
        ];
        const id= [0, 1, 2, 0, 2, 3];
        img(vd, id);
    }
}