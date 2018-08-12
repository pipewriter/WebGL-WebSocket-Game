window.playerControls = new (function initPlayerControls(){
    let uvx = 0;
    let uvy = 0;
    this.getDirection = function(){
        return {uvx, uvy};
    }
    this.setDirection = function({uvx: dx, uvy: dy}){
        uvx = dx;
        uvy = dy;
    }
})();