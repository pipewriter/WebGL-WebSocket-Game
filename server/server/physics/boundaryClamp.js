function boundaryClamp(blackhole, boundary, callback){
    const {x, y, r} = blackhole;
    const {x:bx, y:by, r:br} = boundary;
    const [dx, dy] = 
        [x- bx, y- by];
    const mag = Math.sqrt(dx * dx + dy * dy);
    const ret = {out: false}
    if(mag > br - r){
        //get direction
        //multiply by boundary.r
        ret.out = true;
        // ret.x = dx/mag * br + bx;
        // ret.y = dy/mag * br + by;
        ret.fux = -dx/mag;
        ret.fuy = -dy/mag;
        const f = mag + r - br
        ret.force = f * f
    }
    callback(ret);
}

module.exports = boundaryClamp;