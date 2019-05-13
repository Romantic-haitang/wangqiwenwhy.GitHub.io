function login() {
	if($("#phone").val() && $("#paswd").val()) {
		$.ajax({
			type: "post",
			url: "https://onlinechat.jinyingyi.com.cn/interface/login.php",
			async: true,
			data: {
				username: $("#phone").val(),
				password: $("#paswd").val()
			},
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					var obj = {
						nickName: res.data.nickname,
						headLogo: res.data.head_logo,
						id: res.data.id,
						sign: res.data.sign_str,
						username:res.data.username
					}
					localStorage.myInfo = JSON.stringify(obj);
					location.href = "index.html";
				} else {
					console.log("用户名或密码错误")
				}

			},
			error: function(err) {
				console.log("用户名或密码错误")
			}
		});
	} else {
		console.log("请输入用户名")
	}
}