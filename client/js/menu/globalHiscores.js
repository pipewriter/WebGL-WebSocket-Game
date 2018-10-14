const fillScoreRow = (player = {}, className) => (
    fillRow(
        ['rank', 'name', 'time', 'mass', 'planets', 'players', 'kills']
            .map(prop => player[prop]),
        'td',
        className
    )
)

const fillRow = (labelArray = [], tagType = 'td', className) => {
    return [
        `<tr ${className && `class="${className}"`}>`,
        labelArray.map(label => (
            `<${tagType}>${label|| '-'}</${tagType}}>`
        )).join(''),
        `</tr>`
    ].join('');
}

const emptyRow = fillScoreRow();
const titleRow = fillRow(['Rank', 'Name', 'Time', 'Mass', 'Planets', 'Players', 'Kills'], 'th');

(() => {
    
    let globalHsEl = document.getElementById('globalHs');

    window.GAME.fillHsTableEmpty = function initialDashMatrix(){
        let arr = [];
        arr.push(titleRow)
        for(let i = 0; i < 11; i++){
            arr.push(emptyRow);
        }
        globalHsEl.innerHTML = arr.join('');
    };

    window.GAME.fillHsTableEmpty();

    window.GAME.fillHsTable = ({top10Players, playerData}) => {
        let top10Data = [];
        for(let i = 0; i < 10; i++){
            top10Data.push(top10Players[i]);
        }
        const yourId = playerData.id;
        const rows = top10Data.map(top10Player => fillScoreRow(top10Player,
                top10Player && (top10Player.id === yourId ? 'yourScore': undefined)
            ));
        rows.push(fillScoreRow(playerData, 'yourScore'));
        rows.unshift(titleRow);
        globalHsEl.innerHTML = rows.join('')
    }

    (function test(){
        window.GAME.fillHsTable({
            top10Players: [
                {
                    rank: '1',
                    name: 'Bob',
                    time: '4:54',
                    mass: '999',
                    planets: '100%',
                    players: '0%',
                    kills: '0',
                    id: 8
                },
                {
                    rank: '2',
                    name: 'Bill',
                    time: '5:39',
                    mass: 786,
                    planets: '100%',
                    players: '0%',
                    kills: '0',
                    id: 7
                },
                {
                    rank: '3',
                    name: 'Jamie',
                    time: '6:32',
                    mass: 721,
                    planets: '100%',
                    players: '0%',
                    kills: '0',
                    id: 10
                }
            ],
            playerData: {
                rank: ' ',
                name: 'Bill',
                time: '5:39',
                mass: 786,
                planets: '100%',
                players: '0%',
                kills: '0',
                id: 7
            }
        })
    })();
})();