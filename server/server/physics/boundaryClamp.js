function boundaryClamp(blackhole, boundary, callback){
    const {x, y, r} = blackhole;
    const {x:bx, y:by, r:br} = boundary;
    const [dx, dy] = 
        [x- bx, y- by];
    const mag = Math.sqrt(dx * dx + dy * dy);
    const ret = {out: false}
    const distOut = mag - (br - r) //maybe not use r here????
    if(distOut > 0){ 
        ret.out = true;
        ret.fux = -dx/mag;
        ret.fuy = -dy/mag;
        ret.force = Math.pow(distOut, 2);
    }
    callback(ret);
}

module.exports = boundaryClamp;