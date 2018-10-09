var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const dynamodb = new AWS.DynamoDB();

(() => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const app = express()
    const port = 3000
    app.use(bodyParser.json());
    
    app.post('/record-new-score', (req, res) => {
        const {
            ipAddress,
            mass,
            unfilteredMass,
            time,
            planetMass,
            planetKills,
            playerMass,
            playerKills,
            gameOverReason,
            uuid
        } = req.body;

        dynamodb.putItem(
            {
                Item: {
                    testkey: {S: '2'},
                    name: {S: 'Parker'},
                    mystery: {L: [ {S: '3'}]}
                },
                TableName: 'test1'
            }, (err, data) => {
            if(err){
                console.log('Error storing data')
            }
        });

        res.send()
    })
    
    app.listen(port, () => console.log(`Private reporter hosted on port ${port}!`))
})();

(() => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const app = express()
    const port = 4000
    
    app.get('/get-score/abcdefg', (req, res) => {
        res.send('yo')
    })
    
    app.listen(port, () => console.log(`Public records hosted on port ${port}!`))
})();