function newPos({x: oldx, y: oldy, vx, vy, fx, fy, m}, dt, callback){
    const scalar = 1/2 * dt * dt / m;
    const [axinf, ayinf] = [fx * scalar, fy * scalar];
    const [vxinf, vyinf] = [vx * dt, vy * dt];
    const [x, y] = [oldx + vxinf + axinf, oldy + vyinf + ayinf];
    callback({x, y});
}

function newVel({vx: oldvx, vy: oldvy, fx, fy, m}, dt, callback){
    const [addvx, addvy] = [fx * dt / m , fy * dt / m];
    const [vx, vy] = [addvx + oldvx, addvy + oldvy];
    callback({vx, vy});
}

module.exports = {
    findNewPos: newPos,
    findNewVel: newVel
}