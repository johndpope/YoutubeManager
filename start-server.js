/*
  Inicio http server
*/

var express = require('express');
var app = express();

app.use(express.static('build/client'));

app.listen(8081, function(){
  console.log('server running at http://localhost:8081');
})

var path = require('path');
global.appRoot = path.resolve(__dirname);


// require('./build/javascript/server/api-server')
var app2 = require('./build/server/javascript/api-server')

var server = app2.listen(8082, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Api Server listening at http://%s:%s', host, port);
})
/*
  Fim http server
*/

// var app2 = express();
// var fs = require('fs');

// /*
//   post body data
// */
// var bodyParser = require('body-parser')
// app2.use( bodyParser.json() );
// app2.use( bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 

// /*
//   end post middleware
// */

// app2.get('/youtubeExtra', function (req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   fs.readFile( __dirname + "/" + "seriesSubscriptions.json", 'utf8', function (err, data) {
// 	if(err){
// 		console.log(err);
// 		res.end('{}');
// 	}else{
//     res.end( data );
//   }
//   });
// })

// app2.post('/youtubeExtra', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   fs.readFile( __dirname + "/" + "seriesSubscriptions.json", 'utf8', function (err, data) {
//     if(err){
//       console.log(err);
//       res.end('{}');
//     }else{
//       console.log(req.body);
//       var newSeries = JSON.stringify(req.body, null , '\t')
//       fs.writeFile( __dirname + "/" + "seriesSubscriptions.json", newSeries , function(err, data){
//         if(err){
//           console.log(err);
//         }
//       })
//       res.end( newSeries );
//     }
//   });
// });

// var server = app2.listen(8082, function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log("Example app2 listening at http://%s:%s", host, port)

// })