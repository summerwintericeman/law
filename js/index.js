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
function errorModal(tip, callback, isShowCancel) {
	var template = '<div class="modal fade bs-example-modal-sm in" tabindex="-1" id="errorModal" role="dialog" aria-labelledby="mySmallModalLabel" style="display: block; padding-right: 16px;"><div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title" id="mySmallModalLabel">消息提示</h4></div><div class="modal-body"><span id="modalText"></span></div><div class="modal-footer"><button type="button" class="btn btn-default cancel" style="display: none" data-dismiss="modal">取消</button><button type="button" class="btn btn-primary ok" data-dismiss="modal">确定</button></div></div></div></div>';
	if($('#errorModal').length == 0) {
		$('html').append(template);
	};
	$('#errorModal').modal({
		backdrop: 'static',
		show: true
	});
	var count = 1;
	$('#errorModal').on('shown.bs.modal', function(e) {
		if(count > 1) {
			return;
		}
		$('#modalText').html(tip);
		if(isShowCancel) {
			$('#errorModal .cancel').css('display', 'inline-block');
		}
		$('#errorModal .ok').one('click', function() {
			if(callback) {
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
	var caseDesVal = caseDes.replace(/\s+/g, ''),
		is15 = false,
		isMatch = false; //对于小于十五个情况是否有匹配到合适的案由
	if(caseDesVal.length >= 15) {
		//效字符大于15默认是不大于十五个
		console.log("字数小于十五字");
		is15 = true;
	}
	$.ajax({
		dataType: 'json',
		url: URL,
		type: 'post',
		data: Data,
		success: function(res) {
			if(res.code == 0 && res.data) { //表示请求成功
				console.log(res.data);
				var reason = ''; //案由的内容
				var obj = {}; //案由的级别
				if(knowledge == 1) { //知识产权案件搜索
					var isGo = false;
					$.each(res.data, function(i, n) {
						if(n.second_reason == '知识产权与竞争纠纷') {
							isGo = true;
							return false;
						}
					});
					if(!isGo) {
						errorModal('当前搜索案件不属于知识产权案件，请到普通民事案件页面搜索该案件。', function() {
							location.href = 'people.html?page=case';
						});
						return;
					}

				}
				if(!is15) {
					//小于十五个字的情况需要根据是否有返回来进行判断是否展示选择框
					$.each(res.data, function(i, e) {
						if(e.rank_score == 1) { //表示匹配到为概率1的数据了，可以用这个案由数据进行下一步的搜索了
							//找到匹配到的案由的
							reason = e.reason,
							num = "reason_" + e.sub_reason_class;
							obj["second_reason"] = e.second_reason;
							obj[num] = reason;
							if(callback) {
								callback(obj);
							}
							isMatch = true;
						}
					});
					if(!isMatch) {
						//表示没有匹配的需要模态框来进行选择
						$('#selectResModal').modal({
							backdrop: 'static',
							show: true
						});
					}
				} else {
					//大于十五个字的直接用返回的第一个案由进行搜索
					reason = res.data[0].reason;
					num = "reason_" + res.data[0].sub_reason_class;
					obj["second_reason"] = res.data[0].second_reason;
					obj[num] = reason;
					if(callback) {
						callback(obj);
					}
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

//模态框显示    请求案由
(function() {
	var allFloor = null;
	// var firstFloor = [];
	// var secondFloor = [];
	// var thirdFloor = [];
	// var forthFloor = [];
	var firstFloor, secondFloor, thirdFloor, forthFloor;
	var idx1, idx2, idx3, idx4;

	var resNum = '';
	$('#selectResModal').on('shown.bs.modal', function(e) {
		var resNode = $('#selectResModal .valSpan i');
		var liClickNode;
		var ul1 = $('#selectResModal .floorWrap .floor1'),
			ul2 = $('#selectResModal .floorWrap .res2'),
			ul3 = $('#selectResModal .floorWrap .res3'),
			ul4 = $('#selectResModal .floorWrap .res4');
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
                        					    <span>${i+1}. ${ele.name}</span>
                        				        </li>`;
							$(".floor1").append(tempFloor1);
						});
						$('li[reason="reason_1"]').on('mouseenter', function() {
							ul2.empty();
							ul3.empty();
							ul4.empty();
							idx1 = $(this).index();
							secondFloor = allFloor[idx1].sub;
							$.each(secondFloor, function(i2, e2) {
								var liNode = `<li reason="reason_2">
                        					    <span>${i2+1}. ${e2.name}</span>
                        				        </li>`;

								ul2.append(liNode);
							});
							$('li[reason="reason_2"]').on('mouseenter', function() {
                                //清空下级数据
								ul3.empty();
								ul4.empty();
								idx2 = $(this).index();
								thirdFloor = allFloor[idx1].sub[idx2].sub;
								if(thirdFloor.length == 0) {
									$(this).addClass('clickNode');
								}
								$.each(thirdFloor, function(i3, e3) {
									var liNode = `<li reason="reason_3">
                        					    <span>${i3+1}. ${e3.name}</span>
                        				        </li>`;

									ul3.append(liNode);
								});
								$('li[reason="reason_3"]').on('mouseenter', function() {

									ul4.empty();
									idx3 = $(this).index();
									forthFloor = allFloor[idx1].sub[idx2].sub[idx3].sub;
									if(forthFloor.length == 0) {
										$(this).addClass('clickNode');
									}
									$.each(forthFloor, function(i4, e4) {
										var liNode = `<li reason="reason_4" class="clickNode">
                        					    <span>${i4+1}. ${e4}</span>
                        				        </li>`;
										ul4.append(liNode);
									});

								});

							});

						});

						//hover下一级时保留上一级的hover效果
                        ul1.on('mouseenter',function(){
                            $(this).find('li')
                                .removeClass('active')
                                .on('mouseleave',function(){
                                    $(this).removeClass('active');
                                });
						});
                        ul1.on('mouseleave',function(){
                            $(this).find('li').off('mouseleave');
                        });
                        ul2.on('mouseenter',function(){
                            ul1.find('li').eq(idx1).addClass('active');
                            $(this).find('li')
								.removeClass('active')
								.on('mouseleave',function(){
                            	$(this).removeClass('active');
							});
						});
                        ul2.on('mouseleave',function(){
                            $(this).find('li').off('mouseleave');
                        });
                        ul3.on('mouseenter',function(){
                            ul2.find('li').eq(idx2).addClass('active');
                            $(this).find('li')
                                .removeClass('active')
                                .on('mouseleave',function(){
                                    $(this).removeClass('active');
                                });
                        });
                        ul3.on('mouseleave',function(){
                            $(this).find('li').off('mouseleave');
                        });
                        ul4.on('mouseenter',function(){
                            ul3.find('li').eq(idx3).addClass('active');
                        });


						//添加点击选中事件
						$('body').on('click', '#selectResModal ul.clickUl>li', function() {
							var selectHtml = $(this).find('span').html();
							selectHtml = selectHtml.substring(3, selectHtml.length);
							resNum = $(this).attr('reason');
							resNode.html(selectHtml);
                            var secRes = ul1.find('li').eq(idx1).find('span').html();
                            secRes = secRes.substring(3, secRes.length);

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
	$('#selectResModal .ok').on('click', function() {
		var resVal = $('#selectResModal .valSpan i').html();
		var secRes = $('#selectResModal .valSpan span').html();
		var resObj = {
			second_reason: secRes
		};
		resObj[resNum] = resVal;
		var fromPage = getUrlParam('fromPage');
		var locHref = location.href;
		if(resVal == '') {
			$('#selectResModal span.errorTip').show();
			return;
		}
		$('#selectResModal').modal('hide');
		if(locHref.indexOf('lawyer') > -1) {
			//找律师
			var getMsg = $.cookie('searchLawyer');
			getMsg = JSON.parse(getMsg);
			getMsg.res = resObj;
			$.cookie('searchLawyer', JSON.stringify(getMsg), {
				path: '/'
			}); //找律师存储cookie
			$.cookie('all', '', {
				expires: -1,
				path: '/'
			});
			if(fromPage) {
				window.location.href = 'lawyerList.html?fromPage=' + fromPage;
			} else {
				window.location.href = 'lawyerList.html';
			}
		} else {
			//查案件
			var getMsg = $.cookie('searchCase');
			getMsg = JSON.parse(getMsg);
			getMsg.res = resObj;
			$.cookie('searchCase', JSON.stringify(getMsg), {
				path: '/'
			}); //找案件存储cookie
			$.cookie('caseList', '', {
				expires: -1,
				path: '/'
			});
			if(fromPage) {
				window.location.href = 'caseList.html?fromPage=' + fromPage;
			} else {
				window.location.href = 'caseList.html';
			}
		}
	});

})();