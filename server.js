// ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
// express
var app = require('express')();
var bodyParser = require('body-parser');
// request
var request = require('request');


app.use(bodyParser.json()); // for parsing application/json

var i = 0;

wss.on('connection', (ws, request) => {
    ws["id"] = i++;
    console.log('connection open with id ' + ws["id"]);

    ws.on('close', () => {
        console.log('Client ' + ws["id"] + ' closed connection');
    });


    ws.on('message', message => {
        console.log('received: %s', message);

        if (message === "send to logic") {
            ws.send(message);

            require('request').post({
                url: 'http://127.0.0.1/43242/',
                headers: { 'content-type': 'application/json' },

                // form: { "client": ws.id }
            })
                .on('error', err => {
                    console.log(err);
                });
        }
    });
});

app.listen(8080, function () {
    app.get('/', function(req, res, next) {
        res.send("hi");
    });

    app.post('/test', function (req, res, next) {
        res.send('{}');
        wss.clients.forEach(ws => {
            if (ws.id == req.body.client) {
                ws.send(req.body.test);
            }
        });
    });
});

