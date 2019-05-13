var myInfo = JSON.parse(localStorage.myInfo)
		var arr = location.search.substring(1).split("&");
		var friendId = arr[0].split("=")[1]; //朋友的id	
		var friendName = arr[1].split("=")[1];//朋友的昵称
		friendName = decodeURI(friendName);
		///var friendImg = arr[2].split("=")[1];
		$("#names").html(friendName)
		$("#idh").html(friendId);

		// 删除好友
		$("#deleteFriends").click(function() {
		$(".ddds").show();
	})
		$(".qx").click(function(){
			$(".ddds").hide();
		})
		$(".qr").click(function(){
			$.ajax({
				type: "POST",
				url: "https://onlinechat.jinyingyi.com.cn/interface/removeFriend.php",
				data: {
					sign_str: myInfo.sign,
					user_id: myInfo.id,
					friend_id:friendId
				},
				success:function(res){
					location.href="Friend-List.html"
					
				},
				error:function(err){
					
				}
			})
		})