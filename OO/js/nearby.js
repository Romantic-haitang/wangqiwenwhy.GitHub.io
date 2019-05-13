let myInfo = JSON.parse(localStorage.myInfo);

// ---- 获取在线好友
function around(){
	$.ajax({
		type:"post",
		url:"https://onlinechat.jinyingyi.com.cn/interface/getOnlineUsers.php",
		data:{
			sign_str:myInfo.sign,
			user_id:myInfo.id
		},
	
		success:function(res){
			if(res.code == 0){
				// 界面渲染：
				render(res.data);
				//1. 给所有class="items" 这个div添加点击事件
				//2. 获取: head_logo , nickname ,user_id
				//3. 把获得数据传递过去 
				//4. 数据在 Friend-Details.html 页面显示
				var info = res.data;
				for(var i=0; i<info.length; i++)
				{
					//自定义一个属性，为了区别点击的div
					$(".items").eq(i)[0].index= i;
					$(".items").eq(i).click(function(){
						var nick = $(".nick").eq( $(this)[0].index ).html();
						var myId = $(".myId").eq( $(this)[0].index ).html();
						console.log(nick);
						console.log(myId);
						// 存储在本地
						localStorage.nick = nick;
						localStorage.myId = myId;
						// 跳转页面
						location.href = "Friend-Details.html";
					});
				}
			}else{
				alert('出错了');
			}
			
		},
		error:function(err){
			console.log('error!')
		}
	});
}
around()

// 把数据放进页面
function render(data){
	console.log(data);
	let html = '';
	for(let i=0;i<data.length;i++){
		var nick = data[i].nickname;
		var head_img = data[i].head_logo;
		var id = data[i].user_id;
		var temp =`
		<div class="items">
			<div>
			<img src="https://onlinechat.jinyingyi.com.cn${head_img}" />
			</div>
			<div>
				<p class="nick">${nick}</p>
				<p class="myId">${id}</p>
			</div>
		</div>
	`;
	html+=temp;
	}
	$('#content').html(html); 
}



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
			} else{
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
