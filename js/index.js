$(document).ready(function() {
	//轮播图
	$(".area").hover(function() {

			$(this).find(".qq").show(100);
		},
		function() {

			$(this).find(".qq").hide(100);

		});


    // errorModal('11111');

});

//获取url地址栏参数
function getUrlParam(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
};

//错误模态框
function errorModal(tip){
	var template = '<div class="modal fade bs-example-modal-sm" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><p>请求失败</p></div></div></div>';
	if($('#errorModal').length==0){
        $('html').append(template);
	};
    $('#errorModal').modal('show');
    $('#errorModal').on('shown.bs.modal', function (e) {

    });
};
$.cookie('searchLawyer', '');//找律师
$.cookie('searchCase', '');//查案件




