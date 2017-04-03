//External Dependencies
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');
var http = require('http');
//Internal Dependencies

//Declarations
var connectedClients = [];

var size = 1000;
var values = [];
for (var i = 0; i < size / 10; i++) {
    values.push(new Array(size / 10));
    for (var j = 0; j < size / 10; j++) {
        values[i][j] = -1;//parseInt(Math.random() * 9 -1);
    }
}


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.ws("/socket", function (ws, req) {
    connectedClients.push(ws);
    ws.send(JSON.stringify(values));
    ws.on('message', function (msg) {
        var pixel = JSON.parse(msg);
        if (!pixel.x || !pixel.y || !pixel.color) return;
        values[pixel.x][pixel.y] = pixel.color;
        connectedClients.forEach((ws) => {
            ws.send(JSON.stringify(pixel));
        });
    });
    ws.on('close', function() {
        for(var i = 0; i < connectedClients.length;i++){
            if(!connectedClients[i] || connectedClients[i].readyState == 3)
                delete connectedClients[i];
        }
    });
});


app.listen(process.env.PORT || 8080);