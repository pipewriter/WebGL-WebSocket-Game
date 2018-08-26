let findGForce = require('./physics/gravitationalForce');

let [bh1, bh2] = [{x:0, y:0, m:1}, {x:0, y:1, m:2}]

findGForce(bh1, bh2, ({fx, fy}) => {
    console.log(fx, fy);
});