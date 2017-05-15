var url			=	require('url');
var qs			=	require('querystring');
var Mongolian 	=	require('mongolian');
var server 		=	new Mongolian();

var ObjectId	= 	require('mongolian').ObjectId;
var db			=	server.db('ticTacDb');
var authCollection	=	db.collection('credentials');

var router = function(req,res){
	console.log('request from client', req.method);
	if(req.method=='POST')
		serverListenPostMethods(req,res);
	else if(req.method=='GET')
		serverListenGetMethods(req,res);
}

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
	authCollection.findOne({'name':username,'pwd':password},function(err, result){
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

module.exports = router;