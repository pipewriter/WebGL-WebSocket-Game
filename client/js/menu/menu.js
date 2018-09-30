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
    
    let inGame = false;
    playButton.onclick = () => {
        if(!inGame){
            inGame = true;
            window.GAME.attemptConnection({dirtyUserName: input.value});
        }
    }
    window.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            playButton.click();
        }
    });
    
    window.GAME.displayMenu = function displayMenu({message, hiscore}){
        window.GAME.menuHidden = false;
        menu.style.display = 'flex';
        
        const [hsField, msgField] = [
            document.getElementById("menu-hs"),
            document.getElementById("menu-msg")
        ];
        
        if(hiscore){
            hsField.innerHTML = `Hiscore: ${Math.ceil(hiscore)}`;
            hsField.style.color = "indianred";
        }else{
            hsField.innerHTML = "";
        }
        msgField.innerHTML = message;
        inGame = false;
    }

    window.GAME.hideMenu = function hideMenu(){
        window.GAME.menuHidden = true;
        menu.style.display = 'none';
    }
});