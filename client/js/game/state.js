(() => {

    window.GAME.catchUnplayableGame = function catchUnplayableGame(reason){
        // const errMsg = `Error connecting to server: ${reason}`;
        renderTitleScreen(reason);
    }

    function renderTitleScreen(msg, finalScore){
        //call window.GAME.deadGame();
        //... this is the hard part
        console.log(`rendering title screen ${msg}`);
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
            msg = `You were swallowed by the player: ${reason}`;
        }else if(killerType === 1){
            msg = `You were swallowed by the supermassive black hole`;
        }

        renderTitleScreen(msg);
    }

})();