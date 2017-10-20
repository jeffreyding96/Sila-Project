var express = require('express');
var app = express();

var path = require('path');

var port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, function() {
    console.log("Listening on port " + port);
});
