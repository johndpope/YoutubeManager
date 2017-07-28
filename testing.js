var PlaylistAPI = require('./source/javascript/server/playlist-api/playlist-api');

PlaylistAPI.updatePlaylistTitle('haha', 'teste').then( (response) => {
    console.log(response);
} )