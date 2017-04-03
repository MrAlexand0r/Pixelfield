//External Dependencies
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var path = require('path');
var http = require('http');
//Internal Dependencies

//Declarations
var size = 1000;
var values = [];
for(var i = 0; i < size/10;i++){
    values.push(new Array(size/10));
    for(var j = 0; j < size/10;j++){
        values[i][j] = parseInt(Math.random() * 9 -1);
    }
}


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.ws("/socket",function(ws,req){
    var timeb4 = Math.round(new Date().getTime());
    ws.send(JSON.stringify(values));
    var timeafter8 = Math.round(new Date().getTime());
    console.log(timeafter8-timeb4);
    ws.on('message',function(msg){
        console.log(msg);
        ws.send("succ");
    });
});


app.listen(process.env.PORT || 8080);