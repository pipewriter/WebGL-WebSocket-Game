function calculateOrbitalVelocity(
    {
        x: x1,
        y: y1
    },
    {
        x: x2,
        y: y2,
        m: M
    },
    G,
    callback
){
    const [x3,y3] = [x2-x1, y2-y1];
    const r = Math.sqrt(x3*x3+y3*y3);
    const [rx, ry] = [x3/r,y3/r];
    const vmag = Math.sqrt(G * M / r);
    const [vx, vy] = [ -1 * vmag * ry, vmag * rx];
    callback({vx, vy});
}

module.exports = calculateOrbitalVelocity;