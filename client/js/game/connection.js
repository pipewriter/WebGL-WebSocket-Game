(function connection_stuff(){
    // Create WebSocket connection.
    const {wsAddress} = window.CONFIG;
    const socket = new WebSocket(`ws://${wsAddress}`);

    // Connection opened
    socket.addEventListener('open', function (event) {
        // do nothin
        send1();
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        // console.log('Message from server ', event.data);
        const data = JSON.parse(event.data);
        // console.log(data.players[0].x)
        window.GAME.updatePlayers(data);
    });

    function send1(){
        socket.send(JSON.stringify({name: "parker"}));
    }

    let lastX = 0;
    let lastY = 0;
    setInterval(()=>{
        let {uvx, uvy} = window.GAME.getPlayerDirection();
        if(uvx === lastX && uvy === lastY)
            return;
        lastX = uvx;
        lastY = uvy;
        if(window.canvas.getMouseDown()){
            console.log('mouse down');
            socket.send(JSON.stringify({uvx, uvy}));
        }else{
            console.log('mouse up');
            socket.send(JSON.stringify({uvx: 0, uvy: 0}))
        }
    }, 17)
})();