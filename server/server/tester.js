let findGForce = require('./physics/gravitationalForce');
let {findNewPos, findNewVel} = require('./physics/kinematics')

let [bh1, bh2] = [{x:0, y:0, m:1}, {x:0, y:1, m:2}]

findGForce(bh1, bh2, ({fx, fy}) => {
    console.log(fx, fy);
    bh1.fx = fx;
    bh1.fy = fy;
    bh2.fx = -fx;
    bh2.fy = -fy;
});

findNewPos(bh1, 1, ({x, y}) => {
    bh1.x = x;
    bh1.y = y;
});
