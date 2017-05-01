console.log('server start executing...')
var http		=	require('http');
var async		=	require('async');
var url			=	require('url');
var Mongolian 	=	require('mongolian');
var ObjectId	= 	require('mongolian').ObjectId;
var fs			= 	require('fs');
var qs			=	require('querystring');
var server 		=	new Mongolian();
var db			=	server.db('ticTacDb');
var authCollection	=	db.collection('credentials');
//var workerThread = require('./exports');
//workerThread();
var app = http.createServer(function(req,res){
		console.log('request from client', req.method);
		if(req.method=='POST')
			serverListenPostMethods(req,res);
		else if(req.method=='GET')
			serverListenGetMethods(req,res);
	});

function serverListenPostMethods(req,res){
	var path= url.parse(req.url,true).pathname;
	var body='';
	console.log('path',path);
	req.on('data',function(data){
		try{
			body+=data;
			console.log('body',body)
		}catch(err){
			console.log(err)
		}
	});
	req.on('end',function(){
		var queryData=qs.parse(body);
		if(path=='/'){
			res.writeHead("200");
			res.end();
		}
		console.log('00000000000000000000',body)
		var queryData=JSON.parse(body);
		
		switch(path){
			case '/':
				res.writeHead("200");
				res.end();
				break;
			case '/login':
				checkAuth(req,res,queryData);
				break;
			default:
				res.writeHead('404',{
					"Content-Type":"text/plain"
				});
				res.write("404 not found\n");
				res.end();
		}
		
	})
}

function serverListenGetMethods(req, res){
	console.log("GOTCHA");
	res.writeHead('200',{
					"Content-Type":"text/plain"
				});
				res.write("sucess\n");
				res.end();
}

function checkAuth(req,res,postData){
	console.log(postData.e);
	var username=postData.e;
	var password=postData.p;
	authCollection.findOne({'username':username,'password':password},function(err, result){
		if(err){
			res.writeHead(200, {
				"Content-Type": "text/plain"
			});
			res.write("error\n");
			res.end();
		}else if(result && result!=undefined){
			console.log(result);
			res.writeHead(200, {
				"Content-Type": "text/plain"
			});
			res.write("success");
			res.end();
		}else{
			res.writeHead(200, {
				"Content-Type": "text/plain"
			});
			res.write("invalid\n");
			res.end();
		}
		
	});
	
}

var io = require('socket.io').listen(app);
app.listen(8000, function(){
	console.log('server listening to localhost:8000');
});

var socketIDConnected = [];

io.sockets.on('connection', function(socket){
	console.log('socket connected successfully',socket.id);
	socketIDConnected.push(socket.id)
	socket.emit('connectback', {data:socket.id});
	socket.on('cellClick', function(data){
		console.log(data);
		socket.broadcast.emit('cellChange',data);
	});
	socket.on('disconnect', function(){
		console.log('disconnect', socket.id);
		
	});
	socket.on('typeSelected', function(data){
		console.log(data);
		socket.broadcast.emit('userSelectedType',data);
	});
});
