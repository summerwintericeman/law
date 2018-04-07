/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	var name = getUrlParam('lawyer_name', true),
		_loction = getUrlParam('lawyer_location', true);
	var fromPage = getUrlParam('fromPage');
	var caseNum = getUrlParam('caseNum');
	var resKey = $.cookie('all');
	resKey = JSON.parse(resKey);
	resKey = resKey.reasonObj.res;
	var parentNode = $('.content');
	var nameArr = [],
		suc_rateArr = [],
		part_suc_rateArr = [];
	var myChart0, myChart1;
	var resizeChart = true;

	//图表重绘
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		myChart1.resize();
		myChart0.resize();
	});
	window.onresize = function() {
		myChart1.resize();
		myChart0.resize();
	}

	//请求律师详情
	var param = JSON.stringify({
		reason: resKey,
		lawyer_name: name,
		lawyer_location: _loction
	});
	console.log(param);
	$.ajax({
		dataType: 'json',
		url: 'http://47.97.197.176:8888/query/lawyer/lawyer_info', // /query/lawyer/lawyer_info  /static_query/lawyer_infohttp://47.92.38.167:8888/  http://47.97.197.176:8888
		type: 'post',
		data: param,
		success: function(res) {
			//console.log(res);
			//只取最多的显示三个
			//console.log(res.data.detail);
			var maxIndex = 0;

			for(var i = 1; i < res.data.detail.length; i++) {
				if(res.data.detail[maxIndex].count < res.data.detail[i].count) {
					maxIndex = i;
				}
			}
			var maxCountReason = "";
			if(res.data.detail[0]) {
				maxCountReason = res.data.detail[maxIndex].reason2;
			}

			if(res.code == 0) {

				var node1 = `
    								<div class="clearfix msgWrap">
									<div class="pull-left userMsg">
										<img src="${res.data.pic_url}" onerror="this.src='../img/default-big.jpg'">
										</div>
										<div class="pull-left">
									<h3><span>${name}　　</span><span>事务所：${_loction || '--'}</span></h3>
									<div class="lawyerMsg clearfix">
									<p><span>执业证号</span><i>${res.data.license_no || '--'}</i></p>
									<p><span>性别</span><i>${res.data.gender || '--'}</i></p>
									<p><span>执业年限</span><i>${res.data.license_year || '--'} 年</i></p>
									<p><span>学历</span><i>${res.data.degree || '--'}</i></p>
									<p><span>收录全部案件数量</span><i>${caseNum|| '--'}起</i></p>
									<p><span>收录一审判决案件数量</span><i>${res.data.judge_count || '--'}起</i></p>
									</div>
									</div>
									</div>
   									 <div class="caseType">
							        <p>
							        <i></i>
							        <span class="text-strong font-16 " id = 'dowell'>擅长领域:</span>
							        </p>
							         <p>
							        <i></i>
							        <span class="text-strong font-16">类似案例:</span>
							        <ul class="node2List"></ul>
							        </p>
							        </div>`;
				parentNode.append(node1);
				console.log(res.data.detail);
				var reasonList = [],
					nameList = [],
					nameList1 = [],
					sucessRate = [],
					failRate = [],
					partRate = [];

				$.each(res.data.detail, function(idx, ele) {
					//擅长领域需要的数据只需要最多三种
					if(idx < 3) {
						var nodeDoWell = `　　<span>${ele.reason2}<i>(${ele.count})</i></span>`;
						$('#dowell').append(nodeDoWell);
						//类似案例的选择---类似案例选择只选择展示的擅长领域中的每一种显示一个
						var page = getUrlParam('fromPage');
						var node2 = `<li><a href='./dowellDetail.html?wenshu=${res.data.detail[idx].doc[0].wenshu_id}&reason=${maxCountReason}'>　　　　　${res.data.detail[idx].doc[0].title}</a></li>`;
						if(page && page == 'property') {
							node2 = `<li><a href='./dowellDetail.html?wenshu=${res.data.detail[idx].doc[0].wenshu_id}&reason=${maxCountReason}&fromPage=property'>　　　　　${res.data.detail[idx].doc[0].title}</a></li>`;
						}
						$('.node2List').append(node2);
						//						$.each(res.data.detail[idx].doc, function(index, ele) {
						//							if(index < 1) {
						//								var page = getUrlParam('fromPage');
						//								var node2 = `<li><a href='./dowellDetail.html?wenshu=${ele.wenshu_id}&reason=${maxCountReason}'>　　　　　${ele.title}</a></li>`;
						//								if(page && page == 'property') {
						//									node2 = `<li><a href='./dowellDetail.html?wenshu=${ele.wenshu_id}&reason=${maxCountReason}&fromPage=property'>　　　　　${ele.title}</a></li>`;
						//								}
						//
						//								$('.node2List').append(node2);
						//							}
						//						});

					}
					//第一个图表需要的数据 需要全部数量的案由
					reasonList.push({
						"name": ele.reason2,
						"value": ele.count
					});
					nameList.push(ele.reason2);
					//第二图需要的数据 只需要一部分不是全部	
					if(idx < 2) {
						nameList1.push(ele.reason2);
						sucessRate.push(ele.suc_rate);
						failRate.push((1 - (ele.suc_rate + ele.part_suc_rate)).toFixed(2));
						partRate.push(ele.part_suc_rate);
					}
				});

				//绘制图表
				myChart0 = echarts.init(document.getElementById('rateChart0'));
				var option = {
					title: {
						text: '律师擅长案由分类',
						subtext: '擅长案由百分比',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: nameList
					},
					series: [{
						name: '',
						type: 'pie',
						radius: '55%',
						center: ['50%', '70%'],
						labelLine: {
							normal: {
								show: true
							}
						},
						data: reasonList,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				};

				myChart0.setOption(option);
				//绘制第二个图表
				myChart1 = echarts.init(document.getElementById('rateChart1'));
				var option1 = {
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						data: ['败诉', '全部胜诉', '部分胜诉']
					},
					xAxis: [{
						type: 'category',
						data: nameList1
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: [{
							name: '败诉',
							type: 'bar',
							barWidth: 40,
							data: failRate
						},
						{
							name: '全部胜诉',
							type: 'bar',
							stack: '胜诉',
							barWidth: 40,
							data: sucessRate
						},
						{
							name: '部分胜诉',
							type: 'bar',
							stack: '胜诉',
							barWidth: 40,
							data: partRate
						}
					]
				};
				myChart1.setOption(option1);
			} else {
				errorModal(res.msg);
			}
		},
		error: function() {
			errorModal('请求律师详情失败！');
			console.error('/query/lawyer/lawyer_info', arguments);
		}
	});
});