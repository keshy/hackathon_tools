var http = require('http');
var util = require('util');
var utils = require('./utils.js');

function createServer() {
	var receiver = new ReceiverServer();
	var server = http.createServer(function(req, res) {
		receiver.handleHttpRequest(req, res);
	});

	// Must explicitly handle upgrade
	server.on('upgrade', function(req, socket, head) {
		res = new http.ServerResponse(req);
		res.assignSocket(socket);
		receiver.handleHttpRequest(req, res);
	});
	return server;
}
exports.createServer = createServer;

function ReceiverServer() {
	this.handlers = {
		// add more methods and method name
		// 'http method' : function()
		'method' : onMethodInvocation,
	};
};

exports.ReceiverServer = ReceiverServer;

ReceiverServer.prototype.handleHttpRequest = function(req, res) {
	console.log("Handling request: " + req.url);

	var parsedUrl = utils.parseUrl(req);
	console.log("Request target URL : " + parsedUrl.href);

	this.handlerFor(parsedUrl).call(null, req, res, parsedUrl, this.handled);

}

ReceiverServer.prototype.handlerFor = function(targetUrl) {

	var handler = this.handlers[targetUrl.handler];
	if (handler) {
		return handler;
	}

	return function(req, res, targetUrl, callback) {
		util.debug("No handler found for " + targetUrl.href);
		res.writeHead(404);
		res.end("No handler was found for the requested resource");
	};
};

ReceiverServer.prototype.handled = function(e, req, res, targetUrl) {
	if (e) {
		console.trace("Error in handler: " + e.message);
		var msg = e.message + '\n' + e.stack;
		res.writeHead(500, {
			'Content-Type': 'text/javascript'
		});
		res.end(e.message);
	} else {
		util.debug("Completed request : " + req.url);
	}

};

// function to receive cursor x y coordinates on screen
function onMethodInvocation(req, res, targetUrl, callback){
	params = targetUrl.params;
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<h2><center>Title goes here</center></h2>\n');
	// prints out all the parameters being sent in the requst
	// handles comma separated list of values for the same key
	for (i in params){
		res.write('</br></br><p><center>' + i+': ' + params[i] + '</center></p></br>');
	}
	res.end('');
	callback(null, params);
	return;
	
}
