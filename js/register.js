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
	$("#agree").on("click", function() {
		console.log("aaa")
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
})