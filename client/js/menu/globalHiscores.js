const fillScoreRow = (player = {}, className) => (
    fillRow(
        ['rank', 'name', 'mass', 'time', 'planets', 'players', 'kills']
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
const titleRow = fillRow(['Rank', 'Name', 'Mass', 'Time', 'Planets', 'Players', 'Kills'], 'th');

(() => {
    
    let globalHsEl = document.getElementById('globalHs');
    let titlEl = document.getElementById('menu-title');
    let switcherEl = document.getElementById('hs-switcher');

    (() => {
        const divs = document.querySelectorAll('#hs-switcher > div');
        
        const deselectDivs = () => {
            divs.forEach(div => {
                div.classList.remove("selected");
            })
        };
        
        divs.forEach(div => {
            div.onclick = () => {
                deselectDivs();
                div.classList.add("selected");
            }

            
        });

    })();
    
    window.GAME.fillHsTableEmpty = function initialDashMatrix(){
        globalHsEl.style.display = 'initial';
        switcherEl.style.display = 'initial';
        titlEl.style.display = 'none';
        let arr = [];
        arr.push(titleRow)
        for(let i = 0; i < 11; i++){
            arr.push(emptyRow);
        }
        globalHsEl.innerHTML = arr.join('');
    };

    // window.GAME.fillHsTableEmpty();

    const formatPlayer = (unformattedPlayer, index) => {
        const mins = unformattedPlayer.time/60/1000;
        const sec = Math.floor(unformattedPlayer.time/1000 % 60);
        const time = `${Math.floor(mins)}:${(sec < 10 ? '0' + sec : sec)}`;
        const {unlimitedMass, massPlanets, massPlayers} = unformattedPlayer;
        const players = massPlayers / unlimitedMass;
        const formattedPlayer = {
            rank: typeof index == 'string' ? index : index + 1,
            name: unformattedPlayer.name,
            time,
            mass: Math.ceil(unformattedPlayer.mass),
            players: `${Math.ceil(players)}%`,
            planets: `${Math.floor(100-players)}%`,
            kills: unformattedPlayer.killCount + '',
            id: unformattedPlayer.id
        };
        return formattedPlayer;
    };

    window.GAME.fillHsTable = ({topTenPlayers, playerData}) => {

        topTenPlayers = topTenPlayers.map(
            formatPlayer
        );
        playerData = formatPlayer(playerData, ' ');

        let top10Data = [];
        for(let i = 0; i < 10; i++){
            top10Data.push(topTenPlayers[i]);
        }
        const yourId = playerData.id;
        const rows = top10Data.map(topTenPlayers => fillScoreRow(topTenPlayers,
            topTenPlayers && (topTenPlayers.id === yourId ? 'yourScore': undefined)
            ));
        rows.push(fillScoreRow(playerData, 'yourScore'));
        rows.unshift(titleRow);
        globalHsEl.innerHTML = rows.join('')
    }

    (function test(){
        window.GAME.fillHsTable({
            topTenPlayers: [
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
                    name: 'Jamie kjhjkhkjhkjhkjhkhkjh',
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
                time: 897,
                mass: 786,
                planets: '100%',
                players: '0%',
                kills: '0',
                id: 7
            }
        })
    });
})();