(()=>{
    const testPlayers = [
        {
            name: 'Douglas Bartholome',
            score: 8
        },
        {
            name: 'jumby',
            score:20
        },
        {
            name: 'gogo',
            score: 1
        },
        {
            name: 'ziggy',
            score:9
        },
        {
            name: 'grongo',
            score: 100
        },
        {
            name: 'dimps',
            score: 35
        }
    ];
    const thePlayer = {
        name: 'parker',
        score: 0
    }
    const hsEl = document.getElementById("hsTable");
    const generateRow = ({score, name}, place, id) => (
        `<tr ${id ? `id="${id}"` : ""}>
            <td>#${place+1}</td>
            <td>${name}</td>
            <td>${Math.ceil(score)}</td>
        </tr>`
    );

    window.GAME.setHiscores = function setHiscores(players, playerId){
        players = testPlayers;
        let main = players.find((player) => player.id === playerId); 
        let sorted = players.sort((a, b) => b.score - a.score);
        let topFive = sorted.slice(0, 5); //largest 5 biggest to smallest
        hsEl.innerHTML = `
            ${topFive.map(generateRow).join('')}
        `;
    }
})();