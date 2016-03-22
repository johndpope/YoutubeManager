var http = require('http');
var fs = require('fs');
var url = require('url');

// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{	
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         var type = {}
         if(pathname.endsWith('.css')){
          type['Content-Type'] = 'text/css'
         }
         if(pathname.endsWith('.woff')){
          type['Content-Type'] = 'application/font-woff';
          type['Access-Control-Allow-Origin'] = '*';
          console.log(data);
         }
         if(pathname.endsWith('.woff2')){
          type['Content-Type'] = 'application/font-woff2';
         }
         if(pathname.endsWith('.ttf')){
          type['Content-Type'] = 'application/font-ttf';
         }

         response.writeHead(200, type);	

         
         // Write the content of the file to response body
         response.write(data);		
      }
      // Send the response body 
      response.end();
   });   
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');



/*
  Fim http server
*/

var express = require('express');
var app = express();

app.get('/youtubeExtra', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.readFile( __dirname + "/" + "seriesSubscriptions.json", 'utf8', function (err, data) {
	if(err){
		console.log(err);
		res.end('{}');
	}
    console.log( data );
    res.end( data );
  });
})
var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})