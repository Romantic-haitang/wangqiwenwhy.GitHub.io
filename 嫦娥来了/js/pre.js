function preLoad(hanshu){
	$('.preload')[0].style.width = window.innerWidth + 'px';
	$('.preload')[0].style.height = window.innerHeight + 'px';
	var time=0;
	var timer=setInterval(function(){
		if(time==110){
			clearInterval(timer);
			hanshu();
		}else{
			$('.jiazai')[0].innerHTML=time+"%";
		}
		
		time+=10;
	},100);
	
	
}


