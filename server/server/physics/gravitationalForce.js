const G_CONST = 1;

function gravitationalForce(
    {
        x: x1,
        y: y1,
        m: m1
    },
    {
        x: x2,
        y: y2,
        m: m2
    },
    callback
){
    const [dx, dy] = [ x1 - x2, y1 - y2 ];
    const rmag = Math.sqrt( dx * dx + dy * dy);
    const [rux, ruy] = [dx / rmag, dy / rmag];
    const fmag = m1 * m2 * G_CONST / (rmag * rmag);
    const [fx, fy] =  [fmag * rux, fmag * ruy];
    callback(fx, fy);
}

module.exports = gravitationalForce;