function findGuideForce({guideStrength: gs, uvx, uvy}, delta, callback){
    let [fx, fy] = [gs * uvx * delta, gs * uvy * delta];
    callback({fx, fy});
}
module.exports = findGuideForce;