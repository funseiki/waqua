var express = require('express'),
    config = require('./config');

var app = express();

app.get('/', function(req, res) {
    res.send('Waquafied Now');
});

var server = app.listen(config.site.port, function() {
    console.log('Server listening on port %d', server.address().port)
});
