$(document).ready(function() {
    var temp = $.cookie("userMess");
//	console.log(temp)
//	if(!temp) {
////		errorModal("请先登录");
////		console.log(window.location.href)
////		var str = window.location.href;
////		var strRE = str.split("index.html");
////		console.log(str)
////		console.log(strRE)
////		var a = strRE[0] + "components/login.html";
////		console.log(a)
////		window.open(a);
//	}

    //轮播图
    $(".area").hover(function() {

            $(this).find(".qq").show(100);
        },
        function() {

            $(this).find(".qq").hide(100);

        });
});

//获取url地址栏参数
function getUrlParam(name, pare) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if(r != null) return pare ? decodeURIComponent(r[2]) : unescape(r[2]);
    return null; //返回参数值
};

//错误模态框
function errorModal(tip, callback) {
    var template = '<div class="modal fade bs-example-modal-sm in" tabindex="-1" id="errorModal" role="dialog" aria-labelledby="mySmallModalLabel" style="display: block; padding-right: 16px;"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title" id="mySmallModalLabel">消息提示</h4></div><div class="modal-body"><span id="modalText"></span></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">确定</button></div></div></div></div>';
    if($('#errorModal').length == 0) {
        $('html').append(template);
    };
    $('#errorModal').modal('show');
    $('#errorModal').on('shown.bs.modal', function(e) {
        $('#modalText').html(tip);
    });
    $('#errorModal').on('hidden.bs.modal', function(e) {
        if(callback)
            callback();
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
                var obj = {};
                obj[num] = reason;

                if(callback) {
                    callback(obj);
                }
            } else {
                errorModal("查询案由失败，错误代码：code=" + res.code + res.msg);
            }
        },
        error: function() {
            console.error('/feature_query/case_type', arguments);
        }
    });
}
//跳转登录的函数
function loginCheck() {
    var temp = $.cookie("userMess");
    console.log(temp)
    if(temp) {
        window.location.href = "../index.html"
    } else {
        errorModal("请先登录");
        //window.location.href = "./login.html"
    }
}