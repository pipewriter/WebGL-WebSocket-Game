(() => {

    window.GAME.attemptConnection = function connection_stuff({dirtyUserName}){
        // Create WebSocket connection.
        const wsAddress = SERVERS.get();
        const socket = new WebSocket(`ws://${wsAddress}:8080`);

        let freshlyOpened = false;

        socket.onerror = () => {
            console.log("SOCKET ERROR");
            let err;
            if(freshlyOpened){
                err = "Error during game";
                freshlyOpened = false;
            }else{
                err = "Error connecting to game";
            }
            window.GAME.catchUnplayableGame(err);
        }

        socket.onopen = () => {
            freshlyOpened = true;
            // do nothin
            send1();
            let lastX = 0;
            let lastY = 0;
            setInterval(()=>{
                let {uvx, uvy} = window.GAME.getPlayerDirection();
                lastX = uvx;
                lastY = uvy;
                if(socket.readyState === 1){
                    if(window.GAME.getMouseDown()){
                        socket.send(JSON.stringify({uvx, uvy}));
                    }else{
                        socket.send(JSON.stringify({uvx: 0, uvy: 0}))
                    }
                }
            }, 17)
            setTimeout(window.GAME.hideMenu, 100); //Delete this line if you add hideMenu somewhere else
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === 0){
                window.GAME.setInitialConstants(data);
            }else if(data.type === 1){
                window.GAME.updatePlayers(data);
                window.GAME.updatePlanets(data);
            }else if(data.type === 2){
                console.log(data)
                window.GAME.handleKillInfo(data);
            }else{
                throw new Error('unrecognized data type')
            }
        }

        function send1(){
            try{
                socket.send(JSON.stringify({name: dirtyUserName}));
            }catch(e){
                console.log('Couldn\'t send name');
            }
        }

        socket.onclose = () => {
            //nuthin
        }
    }
})();