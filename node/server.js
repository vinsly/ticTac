console.log('server start executing...')
var http		=	require('http');
var async		=	require('async');
var url			=	require('url');
var fs			= 	require('fs');

//var workerThread = require('./exports');
//workerThread();
var router = require('./router');
var app = http.createServer(router);

var io = require('socket.io').listen(app);
app.listen(8000,'0.0.0.0', function(){
	console.log('server listening to localhost:8000');
});

var socketIDConnected = [];
var gamerInfo = [];
io.sockets.on('connection', function(socket){
	console.log('socket connected successfully',socket.id);
	socketIDConnected.push(socket.id);
	console.log('socketIDConnected', socketIDConnected);
	socket.emit('connectback', {data:socket.id});

	socket.on('gamerInfo', function(data){
		console.log(data);
		gamerInfo.push(data)
	});


	socket.on('cellClick', function(data){
		console.log(data);
		socket.broadcast.emit('cellChange',data);
	});
	socket.on('disconnect', function(){
		console.log(socketIDConnected);
		console.log('disconnect', socket.id);
		console.log('gamerInfo', gamerInfo);
		if(socketIDConnected.indexOf(socket.id) !== -1){
			var index = socketIDConnected.indexOf(socket.id);
			socketIDConnected.splice(index, 1);
		}
	});
	socket.on('typeSelected', function(data){
		console.log(data);
		socket.broadcast.emit('userSelectedType',data);
	});
	socket.on('tossChoice', function(data){
		socket.broadcast.emit('tossProgress',{flag:1});
		tossResult(data, io);
	});
});

function tossResult(data, io){
	console.log('tossResult', data);
	var oddEven = (Math.floor(Math.random() * 2) == 0);
	data.tossResult = oddEven;
	(function(data, io){
		setTimeout(function(){
			io.sockets.emit('tossResult', data);
		}, 3000);
	})(data, io);
	
}
