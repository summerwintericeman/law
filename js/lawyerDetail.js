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
			console.log(res);
			console.log(res.data.detail);
			console.log(resKey);
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
									<p><span>代理案件总数</span><i>${caseNum|| '--'}起</i></p>
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
							        <span class="text-strong font-16">代理类似案例（收录一审判决案件数量):${res.data.judge_count || '--'}起</span>
							        <ul class="node2List"></ul>
							        </p>
							        </div>`;
				parentNode.append(node1);
				//console.log(res.data.detail);
				var reasonList = [],
					nameList = [],
					rateList = [],
					nameList1 = [];
				//推荐案由的确定
				var maxIndex = 0;
				var maxCountReason = "";
				$.each(res.data.detail, function(idx, ele) {
					//第一个图表需要的数据 需要全部数量的案由
					reasonList.push({
						"name": ele.reason2,
						"value": ele.count
					});
					nameList.push(ele.reason2);
					//第二个图表需要的数据 需要全部数量的案由
					//通过案由的匹配来选择搜索的案由是否是根据字段查出来的案由
					//推荐的信息的选择也是选择查出来的案由
					//确定主要的显示信息
					$.each(resKey, function(idx1, ele1) {
						if(ele.reason2 == ele1 && idx1 != "second_reason") {
							//表示匹配到那个需要的主要案由了
							console.log(ele1);
							console.log(idx);
							maxIndex = idx;
							maxCountReason = res.data.detail[idx].reason2;
							//擅长领域需要的数据
							var choiceDoWell = `　　<span>${res.data.detail[maxIndex].reason2}<i>(${res.data.detail[maxIndex].count})</i></span>`;
							if(maxIndex >= 3) { //前三个不存在推荐案由
								$('#dowell').append(choiceDoWell);
							}
							//第二图需要的数据 只需要一部分不是全部
							nameList1 = ["胜诉", "败诉", "部分胜诉"];
							rateList = [{
									"name": "胜诉",
									"value": ele.suc_rate
								},
								{
									"name": "败诉",
									"value": (1 - (ele.suc_rate + ele.part_suc_rate)).toFixed(2)
								},
								{
									"name": "部分胜诉",
									"value": ele.part_suc_rate
								}
							];
							//类似案例的选择---类似案例选择只选择推荐案由中的案例
							var page = getUrlParam('fromPage');
							for(var i = 0; i < res.data.detail[idx].doc.length; i++) {
								if(i < 3) { //最多添加三个
									var node2 = `<li><a href='./dowellDetail.html?wenshu=${res.data.detail[idx].doc[i].wenshu_id}&reason=${maxCountReason}'>　　　　　${res.data.detail[idx].doc[i].title}</a></li>`;
									if(page && page == 'property') {
										node2 = `<li><a href='./dowellDetail.html?wenshu=${res.data.detail[idx].doc[i].wenshu_id}&reason=${maxCountReason}&fromPage=property'>　　　　　${res.data.detail[idx].doc[i].title}</a></li>`;
									}
									$('.node2List').append(node2);
								}
							}
						}
					})
				});
				//获得擅长领域的函数
				var getDoWellFn = function() {
					$.each(res.data.detail, function(idx, ele) {
						//擅长领域需要的数据只需要最多三种  并且至少有一个是推荐案由
						var nodeDoWell = `　　<span>${ele.reason2}<i>(${ele.count})</i></span>`;
						var tempIdx = 3;
						if(maxIndex >= tempIdx) { //前三个不存在推荐案由
							tempIdx = 2;
						}
						if(idx < tempIdx) {
							$('#dowell').append(nodeDoWell);
						}
					})
				}
				getDoWellFn();
				//绘制图表 案由图表
				myChart0 = echarts.init(document.getElementById('rateChart0'));
				var option = {
					title: {
						text: '代理案件中不同案由的占比',
						subtext: '',
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
				//绘制第二个图表律师胜诉
				myChart1 = echarts.init(document.getElementById('rateChart1'));
				var option1 = {
					title: {
						text: '推荐案由胜诉情况',
						subtext: '',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {d}%"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: nameList1
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
						data: rateList,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
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