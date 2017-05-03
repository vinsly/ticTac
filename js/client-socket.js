console.log(userName);
$('.after-type-select').hide();
$('#type-select-div').hide();
$('#loader').hide();
var socket = io.connect("http://localhost:8000/",{'reconnection':true});
var socketID = '';
var yourTypeSelect = 0;
var friendTypeSelect = 0;
socket.on('connectback', function(data){
	console.log(data);
	socketID = data;
});

socket.on('cellChange',function(data){
	$('#type-select-div').hide();
	console.log('cellChange',data);
	console.log(yourTypeSelect);
	console.log(friendTypeSelect);
	if(friendTypeSelect === 0)
		$('#'+data.cellid).text('O')
	else
		$('#'+data.cellid).text('X');
	$('.overlay').hide();
});

$('.cell').click(function(e){
	console.log(e.currentTarget.id);
	console.log(yourTypeSelect);
	console.log(friendTypeSelect);
	if($(e.currentTarget).text() !== ''){
		alert('Already has a value');
		return;
	}
	if(yourTypeSelect === 0)
		$(e.currentTarget).text('O');
	else
		$(e.currentTarget).text('X');
	if(ticTacGame())
		console.log('Winner');
	socket.emit('cellClick',{
		cellid:e.currentTarget.id
	});
	$('.overlay').show();
	$('#type-select-div').hide();
	$('#loader').show();
	$('.loadmessage').text('Waiting for your friend to make your move....');
});


$('#type-select').change(function(e){
	e.stopPropagation();
	console.log(e.target.value);
	$('.overlay').hide();
	if(e.target.value === '1'){
		$('#what-is-type').text('Your Type Is Knot (O)');
		yourTypeSelect = 0;
		friendTypeSelect = 1;
	}
	else{
		$('#what-is-type').text('Your Type Is Cross (X)');
		yourTypeSelect = 1;
		friendTypeSelect = 0;
	}
	$('.after-type-select').show();
	socket.emit('typeSelected', {
		typeSelect:e.target.value,
		userName: userName
	});
});

socket.on('userSelectedType', function(type){
	console.log(type);
	//console.log(socket)
	if(type.userName === userName)
		return;
	$('.overlay').show();
	$('.loadmessage').text('Waiting for your friend to make your move....');
	//friendTypeSelect = parseInt(type.typeSelect);
	if(type.typeSelect === '1'){
		yourTypeSelect = 1;
		friendTypeSelect = 0;
		$('#what-is-type').text('Your Friend Has Selected Knot, So Your Type Is Cross (X)');
	}
	else{
		yourTypeSelect = 0;
		friendTypeSelect = 1;
		$('#what-is-type').text('Your Friend Has Selected Cross, So Your Type Is Knot (O)');
	}
	$('.after-type-select').show();
});

$('#toss-select').change(function(e){
	e.stopPropagation();
	console.log(e.target.value);
	$('#toss-choice').hide();
	$('#loader').show();
	socket.emit('tossChoice',{selectedValue: e.target.value, userName: userName});
});

socket.on('tossProgress', function(data){
	console.log(data)
	if(data.flag){
		$('#toss-choice').hide();
		$('#loader').show();
	}
});

socket.on('tossResult', function(data){
	console.log(data);
	var flag = false;
	if((data.selectedValue === '1' && data.tossResult) || (data.selectedValue === '2' && !data.tossResult))
		flag =true;
	else
		flag = false;
	if((data.userName === userName && flag) || (data.userName !== userName && !flag)){
		console.log('You won');
		$('#loader').hide();
		$('#type-select-div').show();
	}
	else if((data.userName === userName && !flag) || (data.userName !== userName && flag)){
		console.log('Your Friend won');
		$('.loadmessage').text('Your Friend Won the toss, so he will make the first move!!');
	}
});

function ticTacGame(){
	var arrObj = $('#grid').children();
	if(arrObj[0].innerHTML!=='' && (arrObj[0].innerHTML==arrObj[1].innerHTML) && (arrObj[1].innerHTML==arrObj[2].innerHTML))
		return true;
	else if(arrObj[3].innerHTML!=='' && (arrObj[3].innerHTML==arrObj[4].innerHTML) && (arrObj[4].innerHTML==arrObj[5].innerHTML))
		return true;
	else if(arrObj[3].innerHTML!=='' && (arrObj[6].innerHTML==arrObj[7].innerHTML) && (arrObj[7].innerHTML==arrObj[8].innerHTML))
		return true;
	else if(arrObj[0].innerHTML!=='' && (arrObj[0].innerHTML==arrObj[3].innerHTML) && (arrObj[3].innerHTML==arrObj[6].innerHTML))
		return true;
	else if(arrObj[1].innerHTML!=='' && (arrObj[1].innerHTML==arrObj[4].innerHTML) && (arrObj[4].innerHTML==arrObj[7].innerHTML))
		return true;
	else if(arrObj[2].innerHTML!=='' && (arrObj[2].innerHTML==arrObj[5].innerHTML) && (arrObj[5].innerHTML==arrObj[8].innerHTML))
		return true;
	else if(arrObj[0].innerHTML!=='' && (arrObj[0].innerHTML==arrObj[4].innerHTML) && (arrObj[4].innerHTML==arrObj[8].innerHTML))
		return true;
	else if(arrObj[2].innerHTML!=='' && (arrObj[2].innerHTML==arrObj[4].innerHTML) && (arrObj[4].innerHTML==arrObj[6].innerHTML))
		return true;
	else
		return false;
}