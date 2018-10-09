(()=> {
    window.TOOLS = {};
    window.TOOLS.unit = function unit({x: x1, y: y1}, {x: x2, y: y2}, callback){
        const [dx, dy] = [x2 - x1, y2 - y1];
        const mag = Math.sqrt(dx * dx + dy * dy);
        const [ux, uy] = [dx / mag, dy / mag];
        callback({ux, uy});
    }

    window.TOOLS.radScaler = (n) => 0.05 * n / 2.5 / 2;
})();