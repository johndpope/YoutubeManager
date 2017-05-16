var express = require('express');

var SeriesAPI = require('./series-api');

var router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

router.get('/' , function(req, res) {
    SeriesAPI.getSeries().then(function(seriesJSON) {
        res.end( JSON.stringify(seriesJSON) );
    }, function(error) {
        res.end( JSON.stringify({}) );
    })
})

router.post('/', function(req, res) {
    var seriesJSON = req.body;
    SeriesAPI.saveSeries(seriesJSON).then(function(){
        res.end()
    }, function(error){
        res.status(500).send({error: error})
    })
})

module.exports = router;