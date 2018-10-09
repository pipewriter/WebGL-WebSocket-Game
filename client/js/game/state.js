(() => {

    window.GAME.catchUnplayableGame = function catchUnplayableGame(reason){
        // const errMsg = `Error connecting to server: ${reason}`;
        renderTitleScreen(reason);
    }

    function renderTitleScreen(msg, finalScore){
        window.GAME.displayMenu({message: msg, hiscore: finalScore});
    }

    window.GAME.startGame = function startGame(){
        renderTitleScreen('Welcome to noescape.io. Press your mouse 1 button to control your character.');
    }

    window.GAME.handleKillInfo = function handleKillInfo(killInfo){
        const {
            killerType,
            reason,
            finalScore
        } = killInfo;

        let msg;
        if(killerType === 0){
            msg = `You were swallowed by the supermassive black hole`;
        }else if(killerType === 1){
            msg = `You were swallowed by the player: ${reason}`;
        }

        renderTitleScreen(msg, finalScore);
    }

})();