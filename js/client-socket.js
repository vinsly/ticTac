console.log(userName);
$('.after-type-select').hide();
var socket = io.connect("http://localhost:8000/",{'reconnection':true});

socket.on('connectback', function(data){
	console.log(data);
});

socket.on('cellChange',function(data){
	console.log('cellChange',data);
	$('#'+data.cellid).text('X')
});

$('.cell').click(function(e){
	console.log(e.currentTarget.id);
	socket.emit('cellClick',{cellid:e.currentTarget.id})
});


$('#type-select').change(function(e){
	e.stopPropagation();
	console.log(e.target.value);
	$('.overlay').hide();
	if(e.target.value === '1'){
		$('#what-is-type').text('Knot (O)');
	}
	else{
		$('#what-is-type').text('Cross (X)');
	}
	$('.after-type-select').show();
	socket.emit('typeSelected', {typeSelect:e.target.value});
});
socket.on('typeTriggered', function(type){
	console.log(type);
});