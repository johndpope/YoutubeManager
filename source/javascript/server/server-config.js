var path = require('path');

var root = global.appRoot || __dirname + '/../../../'
var userDataDirectory = path.join(root, '/user_data')

var config = {
    seriesJSONFile: path.join(userDataDirectory , 'seriesSubscriptions.json'),
    playlistDirectory: path.join(userDataDirectory, '/playlists')
}

module.exports = config;