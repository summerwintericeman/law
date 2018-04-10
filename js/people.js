/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {
	var lawyerInput = $('#lawyer textarea'),
		caseInput = $('#case textarea');
	var searchType = 'lawyer';
	var resNum;

	//判断当前显示找律师 还是显示查案件
	(function() {
		var pageActive = getUrlParam('page');
		if(pageActive && pageActive == 'case') {
			$('#profile-tab').tab('show');
		}
	})();

	var lawyerBtn = $('#lawyer .searchBtn'),
		caseBtn = $('#case .searchBtn');

	//找律师
	lawyerBtn.on('click', function() {
		var cityMsg = getCity();
		var caseDescription = $('#lawyer .caseDescription').val();

		if(!caseDescription && !name) {
			$('#lawyer .errorTip').html('*请输入案件描述');
		} else {
			var lawyerInputVal = lawyerInput.val().replace(/\s+/g, '');
			if(lawyerInputVal.length < 15) {
				//效字符少于15
				$('#selectResModal').modal({
					backdrop: 'static',
				});
				searchType = 'lawyer';
				return;
			}

			var template = JSON.stringify({
				des: caseDescription,
				province: cityMsg.province,
				city: cityMsg.city,
				region: cityMsg.region
			});

			$.cookie('searchLawyer', template, {
				path: '/'
			}); //找律师存储cookie
			$.cookie('all', '', {
				expires: -1,
				path: '/'
			});
			window.location.href = 'lawyerList.html';
		};
	});

	$('#lawyer .caseDescription,#lawyer .name').focus(function() {
		$('#lawyer .errorTip').html('');
	});

	//查案件
	caseBtn.on('click', function() {

		var cityMsg = getCity();
		var caseDescription = $('#case .caseDescription').val();

		if(!caseDescription) {
			$('#case .errorTip').html('　*请输入案件描述');
		} else {
			var caseInputVal = caseInput.val().replace(/\s+/g, ''); //全局替换空格
			if(caseInputVal.length < 15) { //效字符少于15
				$('#selectResModal').modal({
					backdrop: 'static',
				});
				searchType = 'case';
				return;
			}

			var template = JSON.stringify({
				des: caseDescription,
				province: cityMsg.province,
				city: cityMsg.city,
				region: cityMsg.region
			});

			$.cookie('searchCase', template, {
				path: '/'
			}); //找律师存储cookie
			$.cookie('caseList', '', {
				expires: -1,
				path: '/'
			});
			window.location.href = 'caseList.html';

		}
	});

	$('#case .caseDescription,#case .name,#case .corporation').focus(function() {
		$('#case .errorTip').html('');
	});

	//获取城市字段
	function getCity() {
		var cityNode = $('#cityPicker .title span'),
			obj = {
				province: '',
				city: '',
				region: ''
			};
		if(cityNode[0]) {
			obj.province = cityNode.eq(0).html();
		};
		if(cityNode[1]) {
			obj.city = cityNode.eq(1).html();
		};
		if(cityNode[2]) {
			obj.region = cityNode.eq(2).html();
		};

		return obj;
	};

	//模态框显示    当输入少于十五个字的时候请求案由
	var allFloor = null;
	var firstFloor = [];
	var secondFloor = [];
	var thirdFloor = [];
	var forthFloor = [];
	$('#selectResModal').on('shown.bs.modal', function(e) {
		var resNode = $('#selectResModal #Label>i');
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
                            var selectHtml = $(this).html();
                            resNum = $(this).attr('reason');
                            resNode.html(selectHtml);
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
	//点击确定按钮关闭模态框
	$('#selectResModal .ok').on('click', function() {
		var resVal = $('#selectResModal #Label>i>span').html();
		var resObj = {};
		resObj[resNum] = resVal;
		if(resVal == '请选择案由') {
			$('#selectResModal span.errorTip').show();
			return;
		}
		$('#selectResModal').modal('hide');
		var cityMsg = getCity();
		if(searchType == 'lawyer') {
			//找律师
			var caseDescription = $('#lawyer .caseDescription').val();
			var template = JSON.stringify({
				des: caseDescription,
				res: resObj,
				province: cityMsg.province,
				city: cityMsg.city,
				region: cityMsg.region
			});

			$.cookie('searchLawyer', template, {
				path: '/'
			}); //找律师存储cookie
			$.cookie('all', '', {
				expires: -1,
				path: '/'
			});
			window.location.href = 'lawyerList.html';

		} else {
			//查案件
			var caseDescription = $('#case .caseDescription').val();
			var template = JSON.stringify({
				des: caseDescription,
				res: JSON.parse(resVal),
				province: cityMsg.province,
				city: cityMsg.city,
				region: cityMsg.region
			});

			$.cookie('searchCase', template, {
				path: '/'
			}); //找律师存储cookie
			$.cookie('caseList', '', {
				expires: -1,
				path: '/'
			});
			window.location.href = 'caseList.html';
		}
	});

	//保存cookie
	$.cookie('fromPage', 'people', {
		path: '/'
	});

});