(() => {

    window.GAME.catchUnplayableGame = function catchUnplayableGame(reason){
        // const errMsg = `Error connecting to server: ${reason}`;
        renderTitleScreen(reason);
    }

    function renderTitleScreen(msg, scoreCard){
        window.GAME.displayMenu({message: msg, scoreCard});
    }

    window.GAME.startGame = function startGame(){
        renderTitleScreen('Welcome to noescape.io. Press your mouse 1 button to control your character.');
    }

    window.GAME.handleKillInfo = function handleKillInfo(killInfo){
        const {
            endingType,
            endingString,
            scoreCard
        } = killInfo;

        let msg;
        if(endingType === 'Gargantua'){
            msg = `You were swallowed by the supermassive black hole`;
        }else if(endingType === 'Player'){
            msg = `You were swallowed by the player: ${endingString}`;
        }else if(endingType === 'MaxMass'){
            msg = 'You reached 1000 mass! You win!';
        }else{
            msg = 'error ending game';
        }

        renderTitleScreen(msg, scoreCard);
    }

})();