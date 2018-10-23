(() => {
    const {servers} = window.CONFIG || {servers: [{ name: 'localhost', wsAddress: 'localhost'}]};
    const storageToken = 'preferred server'
    window.SERVERS = {
        get: function get(){
            const serverName = window.localStorage.getItem(storageToken);
            if(serverName){
                const server = servers.find(
                    server => server.name === serverName
                );
                if(server){
                    return server.wsAddress;
                }else{
                    // fall back to original plan
                }
            }
            return servers[0].wsAddress; //return first server
        },
        set: function set({serverName}){
            if(!serverName)
                throw new Error('please use the serverName property')
            window.localStorage.setItem(storageToken, serverName);
        }
    }
})();
