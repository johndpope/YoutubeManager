const fs = require('fs');

const PlaylistAPI = require('./playlist-api');
const ServerConfig = require('../server-config');

const testDirectory = './test/';

beforeAll(() => {
    return new Promise( (resolve, reject) => {
        fs.mkdir(testDirectory, (error) => {
            if(error) {
                console.error(error);
                reject(error);
            }else {
                ServerConfig.playlistDirectory = testDirectory;
                resolve();
            }
        })
    })
})

afterAll( () => {
    return new Promise( (resolve, reject) => {
        fs.readdir(testDirectory, (error, fileList) => {
            if(error) {
                console.error(error);
                reject(error);
            }else {
                fileList.forEach( (value, index, array) => {
                    fs.unlinkSync(testDirectory + value)
                })
                fs.rmdir(testDirectory, (error) => {
                    if(error) {
                        console.error(error);
                        reject(error);
                    }else {
                        resolve();
                    }
                })
            }
        })
    })
})

test('creates a playlist passing no name', () => {
    return PlaylistAPI.createPlaylist({}).then( (playlist) => {
        expect(playlist.title).toBe('playlist');
    })
})

test('creates a playlist passing a name', () => {
    return PlaylistAPI.createPlaylist({title: 'playlist-test', test: true}).then( (playlist => {
        expect(playlist.title).toBe('playlist-test');
        expect(playlist.test).toBe(true);
    }))
})

test('creates a second playlist passing no name, must save new with different name', () => {
    return PlaylistAPI.createPlaylist({second: true}).then( (playlist) => {
        expect(playlist.title).toBe('playlist-1');
        expect(playlist.second).toBe(true);
    })
})