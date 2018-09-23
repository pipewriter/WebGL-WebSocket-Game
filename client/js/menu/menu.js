window.addEventListener("load", () => {
    
    const menu = document.getElementById("menu");
    
    const input = document.getElementById("user-name");
    const colorBorder = () => {
        if(input.value !== ""){
            input.style.borderBottomColor = "indianred";
        } else {
            input.style.borderBottomColor = "blueviolet";
        }
    }
    input.onkeydown = colorBorder;
    input.onkeyup = colorBorder;



    const playButton = document.getElementById("play-button");
    
    playButton.onclick = () => {
        window.GAME.attemptConnection({dirtyUserName: input.value});
    }
    
    window.GAME.displayMenu = function displayMenu({message, hiscore}){

        menu.style.display = 'flex';

        const [hsField, msgField] = [
            document.getElementById("menu-hs"),
            document.getElementById("menu-msg")
        ];

        if(hiscore){
            hsField.innerHTML = `Hiscore: ${hiscore}`;
            hsField.style.color = "indianred";
        }else{
            hsField.innerHTML = "";
        }
        msgField.innerHTML = message;
    }

    window.GAME.hideMenu = function hideMenu(){
        menu.style.display = 'none';
    }
});