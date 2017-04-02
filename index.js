//External Dependencies
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');
var http = require('http');

//Internal Dependencies

//Declarations

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.ws("/socket",function(ws,req){
    console.log(req.query.q);
    ws.on('message',function(msg){
        console.log(msg);
        ws.send("succ");
    });
});


app.listen(process.env.PORT || 8080);