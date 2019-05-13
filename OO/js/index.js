//-------------------------消息页面
if(!localStorage.homeInfo) {
	localStorage.homeInfo = '[]';
}
var myInfo = JSON.parse(localStorage.myInfo); //转对象     parse  JSON的方法

//console.log(localStorage.homeInfo);
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
				dealHomeInfo(res.data);
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

//处理未读消息
function dealHomeInfo(data1) {
	var arr = JSON.parse(localStorage.homeInfo);
	console.log(arr);
	data1.forEach(function(item1) {
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
		} else {
			//			首页中已有该信息,那么把新的信息添加到已有的obj中就可以了
			var obj = arr[myIndex];
			obj.message.push({
				message: item1.message,
				message_send_time: item1.message_send_time
			})
		}
	})

	setMyFriends(arr);
	localStorage.homeInfo = JSON.stringify(arr); //转字符串     stringify  JSON的方法

}

var messageCount = 0;
//检测homeInfo中的未读信息
function getMessages() {
	var arr = JSON.parse(localStorage.homeInfo);
	arr.forEach(function(item) {
		messageCount += item.message.length
	})
	if(messageCount == 0) {
		$("#news .dot").hide();
	} else {
		$("#news .dot").show();
	}
}
getMessages();

function setMyFriends(arr) {
	for(var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		var str = `[fid=${obj.user_id}]`;

		if($(str)[0]) {
			//			该聊天人已经存在在首页,那么我们需要进行内容的修改
			if(obj.message.length == 0) {
				//				如果未读消息数量为0,那么不显示
				$(str).find(".mark").hide();
			} else {
				$(str).find(".mark").html(obj.message.length).show();
			}
		} else {
			//			聊天人不存在首页,是个新的,那么需要创建
			$(`<div class='items' fname=${obj.nickname} fid=${obj.user_id}></div>`).html(`<div onclick="heads()">
						<img src="https://onlinechat.jinyingyi.com.cn/${obj.head_logo}" />
					</div>
					<div>
						<p class="names" class="firendList">${obj.nickname}</p>
						<p class="advices"></p>
					</div>
					<div class="mark">${obj.message.length}</div>`).appendTo($("#content"));
			if(obj.message.length == 0) {
				$(str).find(".mark").hide();
			}
		}
		//		每个联系人上应该显示最后一条message消息,如果message消息为0,那么显示history的最后一条消息
		if(obj.message.length == 0) {
			$(str).find(".advices").html(obj.history[obj.history.length - 1].message)
		} else {
			$(str).find(".advices").html(obj.message[obj.message.length - 1].message)
		}
		messageCount += obj.message.length;

	}

	//如果未读消息为空就不显示 小红点 ，
	if(messageCount == 0) {
		$("#dot").hide();

	} else {
		$("#dot").show();
	}

	$(".items").click(function() {

		//		找到点击的item的下标
		var thisId = $(this).attr("fid")
		var arr = JSON.parse(localStorage.homeInfo);
		var ind = 0;
		for(var i = 0; i < arr.length; i++) {
			var obj = arr[i];
			if(thisId == obj.user_id) {
				ind = i;
				break;
			}
		}

		//拿到对应的数据obj
		var obj = arr[ind];

		//将message中的内容复制到history
		for(var i = 0; i < obj.message.length; i++) {
			obj.history.push(obj.message[i]);
		}

		//message置空
		obj.message = [];

		//重新生成homeInfo
		localStorage.homeInfo = JSON.stringify(arr);

		var str = "Chat.html?friendId=" + $(this).attr("fid") + "&fname=" + $(this).attr("fname");
		console.log(str);
		location.href = str;
	})
}

setMyFriends(JSON.parse(localStorage.homeInfo))


//判断是否有新人+我
function getNewFriends() {
	$.ajax({
		type: "GET",
		url: "https://onlinechat.jinyingyi.com.cn/interface/processFriendRequest.php",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id
		},
		success: function(res) {
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