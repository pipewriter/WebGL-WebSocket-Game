(() => {
    const {servers} = window.CONFIG;
    const buttons = [];
    const selectedClass = 'selected';
    const buttonContainer = document.getElementById('serverPicker');
    
    const unselectAllButtons = () => {
        buttons.forEach(button => {
            button.classList.remove(selectedClass);
        });
    };
    servers.forEach(server => {
        let wsAddress = window.SERVERS.get();
        let button = document.createElement('div');
        button.innerHTML = server.name;
        if(wsAddress === server.wsAddress){
            button.classList.add(selectedClass);
        }
        button.classList.add('serverChoice');
        button.onclick = () => {
            window.SERVERS.set({serverName: server.name});
            unselectAllButtons();
            button.classList.add(selectedClass);
        }
        buttons.push(button);
        buttonContainer.appendChild(button);
    });
})();