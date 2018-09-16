(()=> {
    window.GAME.textFiller = function textPlace({
        text,
        x: centerX, y: centerY,
        width: finalWidth,
        maxHeight
    }){
        const node = document.createTextNode(text);
        const para = document.createElement("span");
        para.appendChild(node);
        // para.style.display='none';
        window.document.body.appendChild(para);
        para.style.display = 'inline-block'
        const {offsetWidth: ow, offsetHeight: oh} = para;
        let heightRatio = Number.POSITIVE_INFINITY;
        if(maxHeight){
            heightRatio = maxHeight/oh;
        }
        const widthRatio = finalWidth/ow;
        const scale = widthRatio < heightRatio ? widthRatio : heightRatio;
        const offset = {
            x: centerX-ow/2,
            y: centerY-oh/2
        }
        // para.style.transform = `translate(${offset.x}px, ${offset.y}px)`
        para.style.position = 'absolute';
        para.style.top = offset.y + 'px';
        para.style.left = offset.x + 'px';
        para.style.color = 'wheat';
        para.style.transform = `scale(${scale}, ${scale})`
        para.style.zIndex = '2';
        return () => {
            document.body.removeChild(para);
        };
    }
})();

