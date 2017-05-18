var fs = require('fs');
var path = require('path');

var serverConfig = require('../server-config');

var PlaylistAPI = {
    /**
     * Methot that saves the JSON of a playlist in a new file on playlistDirectory by Promise
     * @param {String} playlistTitle String to be used as playlist title (playlist filename)
     * @param {JSON} playlistJSON JSON to be saved as playlist
     * @returns {Promise<JSON|Error>} Promise that returns saved JSON or rejects with error
     */
    createPlaylist(playlistTitle, playlistJSON) {
        return new Promise( (resolve, reject) => {
            /* check playlist title */
            var baseTitle = playlistTitle;
            if(!baseTitle) {
                baseTitle = 'playlist';
            }
            this.getPlaylistsTitleList().then( (playlistTitles) => {
                var number = 1;
                var title = baseTitle + '.json';
                while(playlistTitles.indexOf(title) !== -1) {
                    title = baseTitle + '-' + number + '.json';
                    number ++;
                }
                /* check playlist title */

                /* save playlist */
                var playlistDataString = JSON.stringify(playlistJSON, null, '\t');
                var options = {
                    flag: 'wx'
                };
                fs.writeFile(path.join(serverConfig.playlistDirectory, title), playlistDataString, options, (error, data) => {
                    if(error) {
                        reject(error);
                    } else {
                        playlistJSON.title = path.basename(title, '.json');
                        resolve(playlistJSON);
                    }
                });
                /* save playlist */
            })
        })
    },
    /**
     * Method that returns list of playlists titles saveds on playlistDirectory by Promise
     * @returns {Promise<List|Error>} List with playlists titles from playlistDirectory or rejects with error
     */
    getPlaylistsTitleList() {
        return new Promise( (resolve, reject) => {
            fs.readdir(serverConfig.playlistDirectory, (error, files) => {
                if(error) {
                    reject(error);
                } else {
                    var playlistTitles = [];
                    files.forEach( (current, index, array) => {
                        playlistTitles.push(path.basename(current, '.json'));
                    })
                    resolve(playlistTitles);
                }
            })
        })
    },
    /**
     * Method that return a playlist JSON according to the playlistTitle by Promise
     * @param {String} playlistTitle String of playlist title
     * @returns {Promise<JSON|Error>} JSON of playlist with playlistTitle or rejects with error
     */
    getPlaylist(playlistTitle) {
        return new Promise( (resolve, reject) => {
            fs.readFile(path.join(serverConfig.playlistDirectory, playlistTitle + '.json'), 'utf-8', (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    try {
                        var playlist = JSON.parse(data);
                        playlist.title = playlistTitle;
                        resolve(playlist);
                    } catch (error) {
                        reject(error);
                    }
                }
            })
        })
    },
    /**
     * Method that renames a playlist, returns the new title by Promise. The new title can differ from the parameter.
     * @param {String} playlistTitle String of the current playlist title
     * @param {String} newPlaylistTitle String of the desired new playlist title
     * @returns {Promise<String|error>} String of the new playlist title or rejects with error
     */
    updatePlaylistTitle(playlistTitle, newPlaylistTitle) {
        return new Promise( (resolve, reject) => {
            this.getPlaylistsTitleList().then( (titleList) => {
                var number = 1;
                var newTitle = newPlaylistTitle;
                while(titleList.indexOf(newTitle) !== -1) {
                    newTitle = newPlaylistTitle + '-' + number;
                    number ++;
                }
                fs.rename(path.join(serverConfig.playlistDirectory, playlistTitle + '.json'), path.join(serverConfig.playlistDirectory, newTitle + '.json'), (error) => {
                    if ( error ) {
                        reject(error);
                    } else {
                        resolve(newTitle);
                    }
                })
            }, (error) => {
                reject(error);
            })
        })
    }
};

module.exports = PlaylistAPI;