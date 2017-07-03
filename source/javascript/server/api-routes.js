var express = require('express');

var SeriesAPIRoute = require('./series-api/series-api-route');

var router = express.Router();

router.use('/series', SeriesAPIRoute);

module.exports = router;

