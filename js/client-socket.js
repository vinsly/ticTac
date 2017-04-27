var socket = io.connect("http://localhost:8000/",{'reconnection':true});
socket.on('connectback', function(data){
	console.log(data);
});
socket.on('cellChange',function(data){
	console.log('cellChange',data);
	$('#'+data.cellid).text('X')
})
$('.cell').click(function(e){
	console.log(e.currentTarget.id);
	socket.emit('cellClick',{cellid:e.currentTarget.id})
});