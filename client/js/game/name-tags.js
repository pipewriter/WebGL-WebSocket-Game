(()=> {
    window.GAME.textFiller = function textPlace({
        text
    }){
        const node = document.createTextNode(text);
        const para = document.createElement("span");
        para.appendChild(node);

        window.document.body.appendChild(para);
        para.style.display = 'inline-block'

        para.style.position = 'absolute';
        
        const move = ({x, y, width, height}) => {
            const {offsetWidth: ow, offsetHeight: oh} = para;

            let heightRatio = Number.POSITIVE_INFINITY;
            heightRatio = height/oh;
            const widthRatio = width/ow;
            const scale = widthRatio < heightRatio ? widthRatio : heightRatio;
            const offset = {
                x: x-ow/2,
                y: y-oh/2
            }
            para.style.top = offset.y + 'px';
            para.style.left = offset.x + 'px';
            para.style.transform = `scale(${scale}, ${scale})`
        }
        
        const hide = () => para.style.display = 'none';
        hide();  //start by hiding it
        const show = () => para.style.display = 'initial';

        para.style.color = 'wheat';
        para.style.zIndex = '2';

        return {
            delete: () => document.body.removeChild(para),
            move,
            hide,
            show
        };
    }
})();

