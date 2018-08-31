function collidedWith(
    {
        x: x1,
        y: y1,
        r: r1,
    },
    {
        x: x2,
        y: y2,
        r: r2 
    },
    callback
){
    const [dx, dy] = [x2 - x1, y2 - y1];
    let rmag = Math.sqrt( dx * dx + dy * dy);
    if(rmag < r1 + r2){
        callback({collided: true});
    }else{
        callback({collided: false});
    }
}

module.exports = collidedWith;