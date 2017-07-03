var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./api-routes');

var app = express()

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
    extended: true
}))

app.use('/', routes);

// var server = app.listen(8082, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Api Server listening at http://%s:%s', host, port);
// });

module.exports = app;