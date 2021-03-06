var PORT = 3000;

var http = require('http');
var url = require('url');
var fs = require('fs');
var mime = require('./mime').types;
var path = require('path');

var server = http.createServer(function(request, response){
	var pathname = url.parse(request.url).pathname;
	var realPath = path.join("webapp",pathname);
	console.log(realPath);
	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';
	fs.exists(realPath, function(exists){
		if(!exists){
			response.writeHead(404,{
				'Content-Type' : 'text/plain'
			});
			response.write("This request URL" + pathname + "was not found on this server.");
			response.end();
		}else{
			if(ext == 'unknown'){
				var data = {a:1,b:2}
				response.write(JSON.stringify(data));
				response.end();
				return;
			}
			fs.readFile(realPath, "binary", function(err, file){
				if(err){
					response.writeHead(500, {
						'Content-Type' : 'text/plain'
					});
					response.end(err);
				}else{
					var contentType = mime[ext] || "text/plain";
					console.log(contentType)
					response.writeHead(200, {
						'Content-Type' : contentType
					});
					response.write(file, "binary");
					response.end();
				}
			});
		}
	});
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");