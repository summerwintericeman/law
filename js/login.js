$(function() {

	//点击登录函数
	$("#agreeLg").on("click", function() {
		var mess = $(".userNameLg")[0].value,
			email = null,
			account = null,
			password = $(".passWordLg")[0].value;
		if(!mess) {
			errorModal("请输入用户名或者邮箱！");
			return;
		} else if(!password) {

		} else {
			//判断是邮件还是账户
			var temp = mess.indexOf("@");
			if(temp != -1) { //表示是邮箱
				email = mess;
				account = '';
			} else {
				account = mess;
				email = '';
			}
			var param = JSON.stringify({
				"email": email,
				"account": account,
				"password": password
			})
			console.log(param);
			$.ajax({
				dataType: 'json',
				url: 'http://47.92.38.167:8889/auth/login',
				type: 'post',
				data: param,
				success: function(res) {
					console.log(res);
					if(res.code == 0) {
						errorModal("登录成功", function() {
							var userMess = JSON.stringify({
								"email": email,
								"account": account
							})
							$.cookie("userMess", userMess,{path:"/"});
							alert($.cookie("userMess"))
							window.location.href = "../index.html";
						});
					} else {
						errorModal(res.msg);
					}
				},
				error: function() {
					errorModal('登录失败！');
					console.error('/auth/login', arguments);
				}
			});

		}
	})

})