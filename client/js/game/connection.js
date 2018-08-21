(function connection_stuff(){
    // Create WebSocket connection.
    const socket = new WebSocket('ws://memoval.com:8080');

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
        socket.send(JSON.stringify({uvx, uvy}))
    }, 17)
})();