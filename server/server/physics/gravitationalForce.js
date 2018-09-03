const G_CONST = 1000;
const rexp = 2;

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
    const [dx, dy] = [ x2 - x1, y2 - y1 ];
    let rmag = Math.sqrt( dx * dx + dy * dy);
    if(rmag < 0.01)
        rmag = 0.01; //avoid divide by 0
    const [rux, ruy] = [dx / rmag, dy / rmag];
    const fmag = m1 * m2 * G_CONST / (Math.pow(rmag, rexp));
    const [fx, fy] =  [fmag * rux, fmag * ruy];
    callback({fx, fy});
}

module.exports = gravitationalForce;