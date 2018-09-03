function findGuideForce({guideStrength: gs, uvx, uvy}, delta, callback){
    let [fx, fy] = [gs * uvx, gs * uvy ];
    callback({fx, fy});
}
module.exports = findGuideForce;