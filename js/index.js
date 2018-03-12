$(document).ready(function() {
	//轮播图
	$(".area").hover(function() {

			$(this).find(".qq").show(100);
		},
		function() {

			$(this).find(".qq").hide(100);

		});
});

//获取url地址栏参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
};

//错误模态框
function errorModal(tip){
	var template = '<div class="modal fade bs-example-modal-sm in" tabindex="-1" id="errorModal" role="dialog" aria-labelledby="mySmallModalLabel" style="display: block; padding-right: 16px;"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title" id="mySmallModalLabel">消息提示</h4></div><div class="modal-body"><span id="modalText"></span></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">确定</button></div></div></div></div>';
	if($('#errorModal').length==0){
        $('html').append(template);
	};
    $('#errorModal').modal('show');
    $('#errorModal').on('shown.bs.modal', function (e) {
			$('#modalText').html(tip);
    });
};

function caseFoud(caseDes, callback) {
	var Data = JSON.stringify({
		"text": caseDes
	});
	$.ajax({
		dataType: 'json',
		url: 'http://47.92.38.167:8889/feature_query/case_type', // http://47.92.38.167:8888/  http://47.92.38.167:8889
		type: 'post',
		data: Data,
		success: function(res) {
			if(res.code == 0 && res.data) { //表示请求成功
				var reason = res.data[0].reason,
					num = "reason_" + res.data[0].sub_reason_class;
				var obj = {
					"reason2": res.data[0].second_reason
				}
				obj[num] = reason;

				if(callback) {
					callback(JSON.stringify(obj));
				}
			} else {
				alert("查询失败，错误代码：code=" + res.code + res.msg);
			}
		},
		error: function() {
			console.error('/static_query/lawyer_list', arguments);
		}
	});
}



