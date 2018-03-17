$(document).ready(function() {
	var lawMess = true;
	$("#lawMess").on("click", function() {
		if(lawMess) {
			lawMess = false;
			$("#agree").addClass("forbide");

		} else {
			lawMess = true;
			$("#agree").removeClass("forbide");

		}
	})

	$("#lawyerReg").on("click", function() {
		$(".peopleReg").css({
			"display": "none"
		})
		$(".lawyerReg").css({
			"display": "block"
		})

	})
	$("#peopleReg").on("click", function() {
		$(".peopleReg").css({
			"display": "block"
		})
		$(".lawyerReg").css({
			"display": "none"
		})
	})

	//注册点击函数
	$("#agree").on("click", function() {
		var num = 0;
		if($(".lawyerReg").css("display") == "block") {
			//表示是律师的注册
			num = 1;
			var liceNum = $(".num")[0].value;
		}
		var name = $(".name")[num].value,
			account = $(".account")[num].value,
			password = $(".password")[num].value,
			passwordRep = $(".passwordRep")[num].value,
			email = $(".email")[num].value;
		if(password != passwordRep) {
			errorModal("两次输入的密码不一致！");
			return;
		} else {
			var param = JSON.stringify({
				"user_name": name,
				"account": account,
				"password": password,
				"email": email,
				"identity": num,
				"lawyer_no": ''
			})
			console.log(param);
			$.ajax({
				dataType: 'json',
				url: 'http://47.92.38.167:8889/account/regist',
				type: 'post',
				data: param,
				success: function(res) {
					console.log(res);
					if(res.code == 0) {
						errorModal("创建成功，请登录",function(){
							window.location.href = "./login.html";
						});
						
					} else {
						errorModal(res.msg);
					}
				},
				error: function() {
					errorModal('注册失败！');
					console.error('/account/regist', arguments);
				}
			});

		}
	})

})