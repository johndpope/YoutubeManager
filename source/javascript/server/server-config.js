var path = require('path');

var root = global.appRoot || __dirname + '/../../../'

var config = {
    seriesJSONFile: path.join(root , 'seriesSubscriptions.json')
}

module.exports = config;