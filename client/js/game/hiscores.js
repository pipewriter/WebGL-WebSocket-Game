(()=>{
    const hsEl = document.getElementById("hsTable");
    const personalEl = document.getElementById("personalStats");
    const generateRow = ({score, name}, place, id) => (
        `<tr ${id ? `id="${id}"` : ""}>
            <td>#${place+1}</td>
            <td>${name}</td>
            <td>${Math.ceil(score)}</td>
        </tr>`
    );
    window.GAME.setHiscores = function setHiscores(players, playerId){
        let main = players.find((player) => player.id === playerId); 
        let sorted = players.sort((a, b) => b.score - a.score);
        let topFive = sorted.slice(0, 5); //largest 5 biggest to smallest
        hsEl.innerHTML = `
            ${topFive.map(generateRow).join('')}
        `;
        personalEl.innerHTML = `Mass: ${Math.ceil(main.score)}`;
    }
})();