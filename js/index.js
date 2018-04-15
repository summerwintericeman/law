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
function errorModal(tip, callback,isShowCancel) {
    var template = '<div class="modal fade bs-example-modal-sm in" tabindex="-1" id="errorModal" role="dialog" aria-labelledby="mySmallModalLabel" style="display: block; padding-right: 16px;"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title" id="mySmallModalLabel">消息提示</h4></div><div class="modal-body"><span id="modalText"></span></div><div class="modal-footer"><button type="button" class="btn btn-default cancel" style="display: none" data-dismiss="modal">取消</button><button type="button" class="btn btn-primary ok" data-dismiss="modal">确定</button></div></div></div></div>';
    if($('#errorModal').length == 0) {
        $('html').append(template);
    };
    $('#errorModal').modal({
        backdrop:'static',
        show:true
    });
    var count = 1;
    $('#errorModal').on('shown.bs.modal', function(e) {
        if(count>1){
            return;
        }
        $('#modalText').html(tip);
        if(isShowCancel){
            $('#errorModal .cancel').css('display','inline-block');
        }
        $('#errorModal .ok').one('click',function(){
            if(callback){
                callback();
            }
        });
        count++;
    });
};

function caseFoud(knowledge, caseDes, callback) {
	// http://47.92.38.167:8888/  http://47.97.197.176:8888
	var URL = 'http://47.97.197.176:8888/feature_query/case_type';
	//知识产权的接口和需要的参数需要根据情况修改
    var Data = JSON.stringify({
        "text": caseDes
    });
    
    $.ajax({
        dataType: 'json',
        url: URL, 
        type: 'post',
        data: Data,
        success: function(res) {
            if(res.code == 0 && res.data) { //表示请求成功
                console.log(res.data);
                if(knowledge == 1){//知识产权案件搜索
                    var isGo = false;
                    $.each(res.data,function(i,n){
                        if(n.second_reason == '知识产权与竞争纠纷'){
                            isGo = true;
                            return false;
                        }
                    });
                    if(!isGo){
                        errorModal('当前搜索案件不属于知识产权案件，请到普通民事案件页面搜索该案件。',function(){
                            location.href='people.html?page=case';
                        });
                        return;
                    }

                }
                var isMatch = false;
                $.each(res.data,function(i,e){
                    if(e.rank_score == 1){
                        var reason = e.reason,
                            num = "reason_" + e.sub_reason_class;
                        var obj = {};
                        obj["second_reason"] = e.second_reason;
                        obj[num] = reason;
                        if(callback) {
                            callback(obj);
                        }
                        isMatch = true;
                        return false;
                    }
                });
                if(!isMatch){
                    $('#selectResModal').modal({
                        backdrop:'static',
                        show:true
                    });

                }

            } else {
                errorModal("查询案由失败，错误代码：code=" + res.code + res.msg);
            }
        },
        error: function() {
            console.error('/feature_query/case_type', arguments);
        }
    });
};
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
};

//判断能否正确匹配案由
function isMatchRes(){

}

//模态框显示    请求案由
(function(){
    var allFloor = null;
    var firstFloor = [];
    var secondFloor = [];
    var thirdFloor = [];
    var forthFloor = [];
    var resNum = '';
    $('#selectResModal').on('shown.bs.modal', function(e) {
        var resNode = $('#selectResModal .valSpan i');
        var liNode;

        //请求获得案由选项的列表
        var param = {

        };

        if(!allFloor) { //判断所有的案由数据是否存在如果存在就不需要在请求
            $.ajax({
                dataType: 'json',
                url: 'http://47.97.197.176:8888/query/reason/reason_tree',
                type: 'post',
                data: param,
                success: function(res) {
                    if(res.code == 0) {
                        console.log('请求成功')
                        console.log(res.data);
                        allFloor = res.data;
                        $.each(allFloor, function(i, ele) {
                            var tempFloor1 = `<li reason="reason_1">
												  <span>${ele.name}</span>
												  <ul class="floor2 f${i}"></ul>
											  </li>`;
                            $(".floor1").append(tempFloor1);
                            if(ele.sub && ele.sub.length>0){
                                $.each(ele.sub, function(i2, ele2) {
                                    var tempFloor2 = `<li reason="reason_2">
												  <span>${ele2.name}</span>
											  </li>`;
                                    var nodeFloor2 = $(".floor2.f"+ i);
                                    if(ele2.sub && ele2.sub.length > 0) {
                                        tempFloor2 = `<li  reason="reason_2">
												  <span>${ele2.name}</span>
												  <ul class="floor3 f${i2}"></ul>
											  </li>`;
                                        nodeFloor2.append(tempFloor2);
                                        $.each(ele2.sub, function(i3, ele3) {
                                            var tempFloor3 = `<li reason="reason_3">
												  <span>${ele3.name}</span>
											  </li>`;
                                            var nodeFloor3 = nodeFloor2.find(".floor3.f" + i2);
                                            if(ele3.sub && ele3.sub.length >0) {
                                                tempFloor3 = `<li  reason="reason_3">
												  <span>${ele3.name}</span>
												  <ul class="floor4 f${i3}">
											  </li>`;
                                                nodeFloor3.append(tempFloor3);
                                                $.each(ele3.sub, function(i4, ele4) {
                                                    var tempFloor4 = `<li class="clickNode" reason="reason_4">
												  <span>${ele4}</span>										
											  </li>`;
                                                    var nodeFloor4 = nodeFloor3.find(".floor4.f" + i3);
                                                    nodeFloor4.append(tempFloor4);
                                                })

                                            }else{
                                                tempFloor3 = `<li class="clickNode"  reason="reason_3">
												  <span>${ele3.name}</span>
											  </li>`;
                                                nodeFloor3.append(tempFloor3);
                                            }

                                        });

                                    }else{
                                        tempFloor2 = `<li class="clickNode"  reason="reason_2">
												  <span>${ele2.name}</span>
											  </li>`;
                                        nodeFloor2.append(tempFloor2);
                                    }

                                })
                            }

                        });

                        //添加点击选中事件
                        liNode = $('#selectResModal ul>li.clickNode');
                        liNode.on('click', function() {
                            var selectHtml = $(this).find('span').html();
                            resNum = $(this).attr('reason');
                            resNode.html(selectHtml);
                            var secRes = $(this).parents('li[reason="reason_1"]').find('span').html();
                            $('#selectResModal .valSpan span').html(secRes);
                        });

                    } else {
                        errorModal(res.msg);
                    }
                },
                error: function() {
                    errorModal('请求失败！');
                    console.error('/query/reason/reason_tree', arguments);
                }
            });
        }
    });
//点击确定关闭模态框
    $('#selectResModal .ok').on('click', function () {
        var resVal = $('#selectResModal .valSpan i').html();
        var secRes = $('#selectResModal .valSpan span').html();
        var resObj = {
            second_reason:secRes
        };
        resObj[resNum] = resVal;
        var fromPage = getUrlParam('fromPage');
        var locHref = location.href;
        if(resVal == ''){
            $('#selectResModal span.errorTip').show();
            return;
        }
        $('#selectResModal').modal('hide');
        if(locHref.indexOf('lawyer')>-1){
            //找律师
            var getMsg =  $.cookie('searchLawyer');
            getMsg = JSON.parse(getMsg);
            getMsg.res = resObj;
            $.cookie('searchLawyer', JSON.stringify(getMsg),{path:'/'}); //找律师存储cookie
            $.cookie('all','',{ expires: -1 ,path:'/'});
            if(fromPage){
                window.location.href = 'lawyerList.html?fromPage=' + fromPage;
            }else{
                window.location.href = 'lawyerList.html';
            }
        }else{
            //查案件
            var getMsg =  $.cookie('searchCase');
            getMsg = JSON.parse(getMsg);
            getMsg.res = resObj;
            $.cookie('searchCase', JSON.stringify(getMsg),{path:'/'}); //找案件存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
            if(fromPage){
                window.location.href = 'caseList.html?fromPage=' + fromPage;
            }else{
                window.location.href = 'caseList.html';
            }
        }
    });

})();

