var fs = require('fs');

var seriesJSONFile = __dirname + '/seriesSubscriptions.json';
console.log(process.env.NODE_PATH)

var SeriesAPI = {
    /**
     * Method that returns series JSON from seriesFile by Promise
     * @returns {Promise<JSON>} JSON of series obtained from seriesFile
     */
    getSeries: function () {
        return new Promise(function (resolve, reject) {
            console.log(process.env.NODE_PATH)
            console.log(__dirname)
            fs.readFile(seriesJSONFile, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                    resolve({});
                } else {
                    resolve(JSON.parse(data));
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
            fs.writeFile(seriesJSONFile, seriesString, function (err) {
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