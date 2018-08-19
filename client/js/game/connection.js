(function connection_stuff(){
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', function (event) {
        // do nothin
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    function send1(){
        socket.send(JSON.stringify({name: "parker"}));
    }
    function send2(){
        socket.send(JSON.stringify({uvx:1, uvy: 0}));        
    }
})();