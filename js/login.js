(function(){
	document.getElementById('service-login').addEventListener('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		var name=document.getElementById('username').value;
		var pwd=document.getElementById('password').value;
		var login = new LoginSession(name,pwd);
		login.submitForm();
	})

	var LoginSession= function(name,pwd){
		this.name=name;
		this.pwd=pwd;
	}
	LoginSession.prototype.submitForm = function() {
		var createOverlay = document.createElement('DIV');
		createOverlay.setAttribute('id','loader');
		createOverlay.setAttribute('class','overlay');
		document.body.appendChild(createOverlay);
		if(document.getElementById("loader")){
			document.getElementById("loader").innerHTML = '<img src="../images/loading.gif" alt="indicator" class="loader"><span class="loadmessage">Signing In...</span>';
		}
		var xhr= new XMLHttpRequest();
		xhr.open('POST','/login-service/login',true);
		xhr.onload=function(data){
			removeOverlay();
			console.log(xhr)
			if(xhr.status===200 && xhr.response=='success'){
				window.location.href = 'http://'+window.location.host+'/home'
			}
		}
		var sendData={
			e:this.name,
			p:this.pwd
		}
		xhr.send(JSON.stringify(sendData));
	};
	function removeOverlay(){
		if(document.getElementsByClassName('overlay')){
			document.body.removeChild(document.getElementsByClassName('overlay')[0]);
		}
	}
})();

