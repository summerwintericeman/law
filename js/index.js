$().ready(function() {
	//轮播图
	$(".area").hover(function() {

			$(this).find(".qq").show(100);
		},
		function() {

			$(this).find(".qq").hide(100);

		});
});