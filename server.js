var express = require('express'),
    path = require('path'),
    config = require('./config');

var app = express();

app.use(express.static(path.join(__dirname, 'ui/public')));

var server = app.listen(config.site.port, function() {
    console.log('Server listening on port %d', server.address().port)
});
