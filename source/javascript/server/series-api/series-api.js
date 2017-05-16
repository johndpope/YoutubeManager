var fs = require('fs');

var serverConfig = require('../server-config');

var SeriesAPI = {
    /**
     * Method that returns series JSON from seriesFile by Promise
     * @returns {Promise<JSON|Error>} JSON of series obtained from seriesFile
     */
    getSeries: function () {
        return new Promise(function (resolve, reject) {
            fs.readFile(serverConfig.seriesJSONFile, 'utf8', function (error, data) {
                if (error) {
                    console.error(error.message);
                    reject(error);
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        if (error instanceof SyntaxError){
                            console.error(error.message);
                            reject(error);
                        }else {
                            console.error(error);
                            reject(error);
                        }
                    }
                }
            })
        })
    },
    /**
     * Method that saves the JSON on seriesFile
     * @param {JSON} seriesJSON JSON to be saved on seriesFile
     * @returns {Promise<null|Error>} Promise that rejects if error
     */
    saveSeries: function (seriesJSON) {
        return new Promise(function (resolve, reject) {
            var seriesString = JSON.stringify(seriesJSON, null, '\t');
            fs.writeFile(serverConfig.seriesJSONFile, seriesString, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = SeriesAPI;