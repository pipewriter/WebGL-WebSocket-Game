(() => {
    function attemptConnection(){

    }

    window.GAME.catchUnplayableGame = function catchUnplayableGame(reason){
        // const errMsg = `Error connecting to server: ${reason}`;
        renderTitleScreen(reason);
    }

    function renderTitleScreen(msg, finalScore){
        //... this is the hard part
        console.log(`rendering title screen ${msg}`);
    }

    function handleKillInfo(killInfo){
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