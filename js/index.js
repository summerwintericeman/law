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
function errorModal(tip,callback){
	var template = '<div class="modal fade bs-example-modal-sm in" tabindex="-1" id="errorModal" role="dialog" aria-labelledby="mySmallModalLabel" style="display: block; padding-right: 16px;"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title" id="mySmallModalLabel">消息提示</h4></div><div class="modal-body"><span id="modalText"></span></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">确定</button></div></div></div></div>';
	if($('#errorModal').length==0){
        $('html').append(template);
	};
    $('#errorModal').modal('show');
    $('#errorModal').on('shown.bs.modal', function (e) {
			$('#modalText').html(tip);
    });
    $('#errorModal').on('hidden.bs.modal', function (e) {
			if(callback)
				callback();
    });
};
// $.cookie('searchLawyer', '');//找律师
// $.cookie('searchCase', '');//查案件







