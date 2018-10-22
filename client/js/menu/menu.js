window.addEventListener("load", () => {
    
    const menu = document.getElementById("menu");
    const hiscores = document.getElementById("hiscores")
    
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
    
    window.GAME.displayMenu = function displayMenu({message, scoreCard}){
        window.GAME.menuHidden = false;
        menu.style.display = 'flex';
        hiscores.style.display = 'none';
        
        const [msgField] = [
            document.getElementById("menu-msg")
        ];
        
        window.GAME.fillHsTableEmpty();
        
        setTimeout(() => {
            let topTenPlayers = [];

            var oReq = new XMLHttpRequest();
            oReq.open("GET", "http://localhost:12129/get-scores");
            oReq.onload = () => {
                const {today, allTime} = JSON.parse(oReq.responseText);
                window.GAME.fillHsTable({
                    topTenPlayers: allTime,
                    playerData: scoreCard
                })
            }
            oReq.send();
        }, 500);

        msgField.innerHTML = message;
        inGame = false;
    }

    window.GAME.hideMenu = function hideMenu(){
        window.GAME.menuHidden = true;
        menu.style.display = 'none';
        hiscores.style.display = 'initial';
    }
});