

const fillRow = ({
    rank = '-',
    name = '-',
    time = '-',
    mass='-',
    planets='-',
    players='-',
    kills='-'}) => (
    `
    <tr>
    <td>${rank}</td>
    <td>${name}</td>
    <td>${time}</td>
    <td>${mass}</td>
    <td>${planets}</td>
    <td>${players}</td>
    <td>${kills}</td>
    </tr>
    `
);

const emptyRow = fillRow({});

(() => {
    
    let globalHsEl = document.getElementById('globalHs');

    window.GAME.fillHsTableEmpty = function initialDashMatrix(){
        let arr = [];
        for(let i = 0; i < 11; i++){
            arr.push(emptyRow);
        }
        globalHsEl.innerHTML = arr.join('');
    };

    window.GAME.fillHsTableEmpty();

    window.GAME.fillHsTable = ({top10Data, playerData}) => {
        /* top10Data
            [
                {
                    rank,
                    name,
                    time,
                    mass,
                    planets,
                    players,
                    kills
                },
                .
                .
                .
            ]
        */
        /* playerData
            {
                name,
                time,
                mass,
                planets,
                players,
                kills
            }
        */
    }
})();