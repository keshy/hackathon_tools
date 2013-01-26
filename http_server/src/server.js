var http = require('http');
var argv = require('optimist').argv;
var receiver = require('../lib/receiver');
var Buffer = require('buffer');
var fs = require('fs');

function main() {
	process.on('uncaughtException', function(err){
		console.log('Uncaught exception handled in main: '+ err.message);
		console.log(err.stack);
	});

	var port = argv.port ? argv.port : 8124;

	var server = receiver.createServer();
	server.listen(port);
	console.log('Starting decorator service on port ' + port);
}

if(require.main === module){
	main();
}