(function connection_stuff(){
    // Create WebSocket connection.
    const {wsAddress} = window.CONFIG;
    const socket = new WebSocket(`ws://${wsAddress}`);
    let state = {
        closed: false
    }

    // Connection opened
    socket.addEventListener('open', function (event) {
        // do nothin
        send1();
        let lastX = 0;
        let lastY = 0;
        setInterval(()=>{
            let {uvx, uvy} = window.GAME.getPlayerDirection();
            // if(uvx === lastX && uvy === lastY)
                // return;
            lastX = uvx;
            lastY = uvy;
            if(!state.closed){
                if(window.GAME.getMouseDown()){
                    socket.send(JSON.stringify({uvx, uvy}));
                }else{
                    socket.send(JSON.stringify({uvx: 0, uvy: 0}))
                }
            }
        }, 17)
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if(data.type === 0){
            window.GAME.setInitialConstants(data);
        }else if(data.type === 1){
            window.GAME.updatePlayers(data);
            window.GAME.updatePlanets(data);
        }else if(data.type === 2){
            console.log('tombstone FOUND!')
            console.log(data);
        }else{
            throw new Error('unrecognized data type')
        }
    });

    function send1(){
        try{
            socket.send(JSON.stringify({name: "parker"}));
        }catch(e){
            console.log('Couldn\'t send name');
        }
    }

    socket.onclose = () => state.closed = true;

})();