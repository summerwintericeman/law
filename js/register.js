$(document).ready(function() {
	var lawMess = true;
	$("#lawMess").on("click", function() {
		if(lawMess){
			lawMess = false;
			$("#agree").addClass("forbide");
			
			
		}else{
			lawMess = true;
			$("#agree").removeClass("forbide");
			
		}
	})

	$("#lawyerReg").on("click", function() {
		$(".peopleReg").css({
			"display":"none"
		})
		$(".lawyerReg").css({
			"display":"block"
		})
		
	})
	$("#peopleReg").on("click", function() {
		$(".peopleReg").css({
			"display":"block"
		})
		$(".lawyerReg").css({
			"display":"none"
		})
	})
	
	//注册点击函数
	$("#agree").on("click", function(){
		var num = 0;
		if($(".lawyerReg").css("display") == "block"){
			//表示是律师的注册
			num = 1;
			var liceNum = $(".num")[0].value;
		}
		var name = $(".name")[num].value,
			account = $(".account")[num].value,
			password = $(".password")[num].value,
			passwordRep = $(".passwordRep")[num].value,
			email = $(".email")[num].value;
		if(password != passwordRep){
			errorModal("两次输入的密码不一致！",function(){
				
			});
			return;
		}
		
		
		
	})
	
	
	
	
	
})