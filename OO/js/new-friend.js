//  长轮询     请求好友申请
var myInfo = JSON.parse(localStorage.myInfo);
$.ajax({
	type: "get",
	url: "https://onlinechat.jinyingyi.com.cn/interface/processFriendRequest.php",
	data: {
		sign_str: myInfo.sign,
		user_id: myInfo.id
	},
	success: function(res) {
		//布局
		setView(res);
	},
	error: function(err) {
		console.log(err);
	}
})
function setView(res) {
	console.log(res);
	for(var i = 0; i < res.data.length; i++) {
		var logos = res.data[i].head_logo;
		var nick = res.data[i].nickname;
		var temp = `
					<li class="imgg"><img src="https://onlinechat.jinyingyi.com.cn/${logos}"></li>
					<li class="texttwo">${nick}</li>
					<li class="xuanze">
						<button class="agree" onclick="myResult(this,1)">同意</button>
						<button class="reject" onclick="myResult(this,2)">拒绝</button>
						<button class="blackName" onclick="myResult(this,3)">黑名单</button>
						<p style="display:none">已同意</p>
					</li>
				`;
		var ul = $("<ul class='tux'></ul>");
		ul.html(temp).appendTo($("#one")).attr({
			requestId: res.data[i].request_id,
			userId: res.data[i].user_id
		});
	}

}

function myResult(el, reNum) {
	var arr = ["已同意","已拒绝","已拉黑"];
	$(el).siblings("p").html(arr[reNum-1])
	$.ajax({
		type: "post",
		url: "https://onlinechat.jinyingyi.com.cn/interface/processFriendRequest.php",
		dataType: "json",
		data: {
			sign_str: myInfo.sign,
			user_id: myInfo.id,
			from_user_id: $(el).parent().parent().attr("userId"),
			request_id: $(el).parent().parent().attr("requestId"),
			process_result: reNum
		},
		success: function(res) {
			$(el).parent().find("button").hide();
			$(el).siblings("p").show();
		},
		error: function(err) {}
	})
}