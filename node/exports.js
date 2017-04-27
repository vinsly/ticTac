var cluster		=	require('cluster');
var http		=	require('http');
//var os			=	require('os');
//var noCpu = os.cpus().length;

var createWorkerThreads =function(){
	console.log('master'+cluster.isMaster);
	console.log('worker'+cluster.isWorker);
	if(cluster.isMaster){
		for (var i = 0; i < 2; i++) {
			console.log("master is forking the worker")
			cluster.fork();
		}
		cluster.on('fork', function(worker){
			console.log("master: fork event(worker "+worker.id+")");
		});
		cluster.on('online', function(worker){
			console.log("master: online event(worker "+worker.id+")");
		});
		cluster.on('listening', function(worker,address){
			console.log("master: online event(worker "+worker.id+",pid "+worker.process.pid+","+address.address+":"+address.port+")");
		});
		cluster.on('exit', function(worker,address){
			console.log("master: exit event(worker "+worker.id+")");
		});
	}
	else{
		console.log('worker: worker#'+cluster.worker.id+'ready!');
		var count = 0;
		http.createServer(function(req,res){
			res.writeHead(200,{
				'Content-Type':'text/plain'
			});
			count++;
			console.log('count',count)
			res.write("this is:"+cluster.worker.id);
			res.end();
			//if(count === 3)
				//cluster.worker.destroy();
		}).listen(8000)
	}
}

module.exports = createWorkerThreads;