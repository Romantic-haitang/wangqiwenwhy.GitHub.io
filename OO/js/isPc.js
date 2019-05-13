//是否是PC端

var mobileArr = ["iOS", "iPhone", "iPad", "iPod", "Android", "iPhone5"];

function isPc() {
	var isPc = true;
	for(var i = 0; i < mobileArr.length; i++) {
		if(navigator.userAgent.indexOf(mobileArr[i]) != -1) {
			isPc = false;
			break;
		}
	}
	return isPc;
}

var sw = 320;
var sh = 568;
//如果是移动端那么改变sw 和 sh
if(!isPc()) {
	sw = window.innerWidth;
	sh = window.innerHeight;
}

$("#box").css({
	width: sw + 'px',
	height: sh + 'px',
})