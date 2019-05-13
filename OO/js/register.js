function register(){
	$.ajax({
		type:"post",
		url:"https://onlinechat.jinyingyi.com.cn/interface/reg.php",
		async:true,
		data:{
			username:$("#phone").val(),
			password:$("#paswd").val(),
			nickname:$("#nicks").val()
		},
		success:function(res){
			if(res.code==0){
				setTimeout(function(){
					alert("恭喜你注册成功！即将跳转到登录页面!")
					location.href="login.html";
				},3000);
			} else {
				console.log("no");
			}
		}
	});
}
