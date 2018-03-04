$().ready(function() {
	//轮播图
	$(".area").hover(function() {

			$(this).find(".qq").show(100);
		},
		function() {

			$(this).find(".qq").hide(100);

		});
});
function loadCommonHtml(url, targetId) {
    $.ajax({
        url: url,
        dataType: "html",
        async: false,
        success: function(msg) {
            $("#" + targetId).html(msg);
        }
    })
}