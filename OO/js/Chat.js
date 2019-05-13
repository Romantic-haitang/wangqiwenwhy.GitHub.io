var myInfo = JSON.parse(localStorage.myInfo);
var arr = location.search.substring(1).split("&");
var friendId = arr[0].split("=")[1]; //朋友的id	
var friendName = arr[1].split("=")[1]; //朋友的昵称
friendName = decodeURI(friendName);
$("#middle").html(friendName);


$("#right").click(function() {
	var str = "delete_friend.html?friendId=" + friendId + "&fname=" + friendName;
	location.href = str;
})
//（1）点击” 发送 “ 按钮 ，发送给朋友消息
function send() {
	//如果消息为空，结束掉循环
	if($("#message").val() == "") {
		return;
	}
	var myMessage = $("#message").val();
	$.ajax({
		type: "post",
		url: "https://onlinechat.jinyingyi.com.cn/interface/sendMessage.php",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id,
			receive_user_id: friendId,
			message: $("#message").val()
		},
		success: function(res) {
			console.log(res)
			// 如果将消息发送成功的话，就将我自己的 ”头像、昵称、我说的话“ ，显示在界面上
			
//			1. 存储历史纪录
			var obj = {
				message: myMessage
			}
			saveMyMessageToHistory(obj);
//			2. 布局
			var html =
				`<div class="message">
					<div class="tx"><img src='https://onlinechat.jinyingyi.com.cn/${myInfo.headLogo}' /></div>
					<div class="sr">
						<p class="nam">${myInfo.nickName}</p>
						<div class='text'>${$("#message").val()}</div>
					</div>
				</div>`;
			$('#center')[0].innerHTML += html;
			$("#message").val("");
		},
		error: function(err) {}
	})
}

$("#dl").click(function() {
	send();
})

// （2）接受朋友给我发送的消息
function obtain() {
	$.ajax({
		type: "get",
		url: "https://onlinechat.jinyingyi.com.cn/interface/getMessages.php",
		async: true,
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id
		},
		success: function(res) {
			// 朋友的id 和 接受消息的id做比较

			if(res.data.length == 0) {
				return;
			}

			var arr = location.search.substring(1).split("&");
			var friendId = arr[0].split("=")[1]; //朋友的id	

			dealData(res.data);

			obtain();
		},
		error: function(err) {
			console.log(err);
			obtain();
		}
	});
}
obtain();
var myIndex = -1;
function saveMyMessageToHistory(myMessage) {
	var arr = JSON.parse(localStorage.homeInfo);
	for(var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		if(obj.user_id == friendId) {
			myIndex = i;
			break;
		}
	}
	if(myIndex != -1) {
		//		判断homeinfo中是否存在
		var obj = arr[myIndex];
		obj.history.push(myMessage)
	} else {
		//如果不存在那么创建obj,并且消息放到history中
		var obj = {
			nickname: myInfo.nickname,
			user_id: myInfo.id,
			head_logo: myInfo.head_logo,
			history: [myMessage],
			message: []
		}
		arr.push(obj);
	}
	localStorage.homeInfo = JSON.stringify(arr);
}

function saveToHistory(item) {
	var arr = JSON.parse(localStorage.homeInfo);
	console.log(arr);
	for(var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		if(obj.user_id == item.user_id) {
			myIndex = i;
			break;
		}
	}
	if(myIndex != -1) {
		//		判断homeinfo中是否存在
		var obj = arr[myIndex];
		obj.history.push({
			message: item.message,
			message_send_time: item.message_send_time
		})
	} else {
		//如果不存在那么创建obj,并且消息放到history中
		var obj = {
			nickname: item.nickname,
			user_id: item.user_id,
			head_logo: item.head_logo,
			history: [{
				message: item.message,
				message_send_time: item.message_send_time
			}],
			message: []
		}
		arr.push(obj);
	}
	localStorage.homeInfo = JSON.stringify(arr);
}

function saveToMessage(item) {
	var arr = JSON.parse(localStorage.homeInfo);
	var myIndex = -1;
	for(var i = 0; i < arr.length; i++) {
		var obj = arr[i];
		if(obj.user_id == item.user_id) {
			myIndex = i;
			break;
		}
	}
	if(myIndex != -1) {
		//		判断homeinfo中是否存在
		var obj = arr[myIndex];
		obj.message.push({
			message: item.message,
			message_send_time: item.message_send_time
		})
	} else {
		//如果不存在那么创建obj,并且消息放到history中
		var obj = {
			nickname: item.nickname,
			user_id: item.user_id,
			head_logo: item.head_logo,
			message: [{
				message: item1.message,
				message_send_time: item.message_send_time
			}],
			history: []
		}
		arr.push(obj);
	}
	localStorage.homeInfo = JSON.stringify(arr);
}

function dealData(data) {
	console.log(data);
	//	因为data是个数组,不能保证只有一条数据
	data.forEach(function(item) {
		if(friendId == item.user_id) {
			//是当前的聊天人,那么消息存到history中,并且显示在页面中
			//1. 将消息存储到history
			saveToHistory(item);
			//2. 布局
			console.log(item);
			var html =
				`<div class="right">
							<div class="tx"><img src='https://onlinechat.jinyingyi.com.cn/${item.head_logo}' /></div>
							<div class="sr">
								<p class="nam">${item.nickname}</p>
								<div class='text'>${item.message}</div>
							</div>
						</div>`;
			$('#center')[0].innerHTML += html;
		} else {
			//别人发来的消息,放到message中
			saveToMessage(item);
		}
	})
}

$("#left").click(function() {
	location.href = "index.html";
})




//本地存储 : 数据拿到 ----- 有种感觉，好像存储出现错误了
var localArr = JSON.parse(localStorage.homeInfo);
console.log(localArr);
//找到历史记录当中的朋友的id ,来确定我拿到的消息
for(var i=0; i<localArr.length; i++)
{
	// 跳转页面带过来的id  跟 本地存储里面的id 相等 ，就将历史记录读取出来
	if(localArr[i].user_id == friendId)
	{
		// 消息的长度
		var messageHis = localArr[i].history;
		for(var j=0;j<messageHis.length;j++)
		{
			// 区分消息 ，显示
			if(messageHis[j].message_send_time)
			{
				// 如果为真 ， 朋友发送的
				var html =
				`<div class="right">
							<div class="tx"><img src='https://onlinechat.jinyingyi.com.cn/${localArr[i].head_logo}' /></div>
							<div class="sr">
								<p class="nam">${localArr[i].nickname}</p>
								<div class='text'>${messageHis[j].message}</div>
							</div>
						</div>`;
				$('#center')[0].innerHTML += html;
			}else{
				//如果为假，我自己发的
				//2. 布局
				var html =
					`<div class="message">
						<div class="tx"><img src='https://onlinechat.jinyingyi.com.cn/${localArr[i].head_logo}' /></div>
						<div class="sr">
							<p class="nam">${localArr[i].nickname}</p>
							<div class='text'>${messageHis[j].message}</div>
						</div>
					</div>`;
				$('#center')[0].innerHTML += html;
			}
		}
		
	}
}


