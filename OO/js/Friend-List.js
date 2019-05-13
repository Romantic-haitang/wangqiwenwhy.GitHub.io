//（1） 查看有没有人添加我为好友（上面的尖括号）
$("#pal").click(function() {
	location.href = "new-friend.html"
})

//（2）自己的所有信息 
var myInfo = JSON.parse(localStorage.myInfo);

//（3）获取好友申请
function getNewFriends() {
	$.ajax({
		type: "GET",
		url: "https://onlinechat.jinyingyi.com.cn/interface/processFriendRequest.php",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id
		},
		success: function(res) {
			$("#newNumber").html(res.data.length + ">");
			if(res.data.length != 0) {
				$("#friend .dot").show()
			} else {
				$("#friend .dot").hide()
			}
			getNewFriends();
		},
		error: function(err) {
			getNewFriends();
			console.log(err);
		}
	})
}

getNewFriends();

//获取好友列表 ，获取数据后  ，布局
function getMyFriends() {
	//	console.log(myInfo)
	$.ajax({
		type: "get",
		typeData: "json",
		url: "https://onlinechat.jinyingyi.com.cn/interface/getFriends.php",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id
		},
		success: function(res) {
			setMyFriends(res)
		},
		error: function(err) {
			//			console.log(err);
		}
	})
}
getMyFriends();

function setMyFriends(res) {
	// 将数据补充到 界面上。
	for(var i = 0; i < res.data.length; i++) {
		var obj = res.data[i];
		$(`<div class='items' fname=${obj.nickname} fid=${obj.user_id} f_img=${obj.head_logo} ></div>`).html(
			`<div class="enterDetails">
						<img src="https://onlinechat.jinyingyi.com.cn/${obj.head_logo}" />
					</div>
					<div class="enterChat">
						<p id="names" class="firendList">${obj.nickname}</p>						
					</div>`).appendTo($("#content"));
	}

	$(".items").click(function() {
		var str = "Chat.html?friendId=" + $(this).attr("fid") + "&fname=" + $(this).attr("fname") + "&img=" + $(this).attr("f_img");
		location.href = str;
		
		/* 动态点击 “好友列表” ，获取好友id 
 		遍历本地存储,比较id是否存在,存在则显示*/
	})

	$(".items .enterDetails img").click(function() {
		location.href = "Friend-Details.html";
		return false;
	})

}

function heads() {
	location.href = "Friend-Details.html"
}

//接受朋友给我发送的消息
function obtain() {
	$.ajax({
		type: "get",
		url: "https://onlinechat.jinyingyi.com.cn/interface/getMessages.php",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id
		},
		success: function(res) {
			// 如果朋友给我发送消息
			if(res.code == 3) {
				alert("签名过期了，请重新登录");
				localStorage.myInfo = "";
				location.href = "login.html";
			}
			if(res.data.length != 0) {
				setMessagetoLocal(res.data);
			}
			obtain();
		},
		error: function(err) {
			console.log(err);
			obtain();
		}
	});
}
obtain();

var messageCount = 0;
//检测homeInfo中的未读信息
function getMessages() {
	var arr = JSON.parse(localStorage.homeInfo);
	arr.forEach(function(item) {
		messageCount += item.message.length
	})
	if (messageCount == 0) {
		$("#news .dot").hide();
	} else {
		$("#news .dot").show();
	}
}
getMessages();

function setMessagetoLocal(data) {

	var arr = JSON.parse(localStorage.homeInfo);
	data.forEach(function(item1) {
		var myIndex = -1; //如果homeinfo中不存在那么就是-1，如果存在返回下标
		for(var i = 0; i < arr.length; i++) {
			var item2 = arr[i];
			if(item2.user_id == item1.user_id) {
				//					该用户已经存在首页聊天信息中了
				myIndex = i;
				break;
			}
		}

		//如果是一个新的好友发来的消息，那么创建后再存入
		if(myIndex == -1) {
			var obj = {
				nickname: item1.nickname,
				user_id: item1.user_id,
				head_logo: item1.head_logo,
				history: [],
				message: [{
					message: item1.message,
					message_send_time: item1.message_send_time
				}]
			}
			arr.push(obj);
			messageCount += obj.message.length;
		} else {
			//			首页中已有该信息,那么把新的信息添加到已有的obj中就可以了
			var obj = arr[myIndex];
			obj.message.push({
				message: item1.message,
				message_send_time: item1.message_send_time
			})
			messageCount += obj.message.length;
		}
	})
	localStorage.homeInfo = JSON.stringify(arr);
	
	if (messageCount == 0) {
		$("#news .dot").hide();
	} else {
		$("#news .dot").show();
	}
}



 