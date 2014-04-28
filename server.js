var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    config = require('./config');

var app = express();

app.engine('jade', require('jade').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

['about', 'search', 'contaminants', 'action', 'home'].forEach(function(route) {
    app.get('/' + route, function(req, res) {
        //res.sendfile('ui/public/' + route + '.html')
        res.render(route);
    });
});

app.get('/', function(req, res) {
    res.render('home');
});

app.use(express.static(path.join(__dirname, 'ui/public')));
var server = app.listen(config.site.port, function() {
    console.log('Server listening on port %d', server.address().port)
});
