/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	var name = getUrlParam('lawyer_name', true),
		_loction = getUrlParam('lawyer_location', true);
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
//	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
//		myChart1.resize();
//		myChart0.resize();
//	});
//	window.onresize = function() {
//		myChart1.resize();
//		myChart0.resize();
//	}

	//请求律师详情
	var param = JSON.stringify({
		reason: resKey,
		lawyer_name: name,
		lawyer_location: _loction
	});
	$.ajax({
		dataType: 'json',
		url: 'http://47.97.197.176:8888/query/lawyer/lawyer_info', // /query/lawyer/lawyer_info  /static_query/lawyer_infohttp://47.92.38.167:8888/  http://47.97.197.176:8888
		type: 'post',
		data: param,
		success: function(res) {
			//console.log(res);
			//只取最多的显示三个
			console.log(res.data.detail);
			var maxIndex = 0;
			
			for(var i = 1; i < res.data.detail.length; i++){
				if(res.data.detail[maxIndex].count < res.data.detail[i].count){
					maxIndex = i;
				}
			}
			var maxCount = res.data.detail[maxIndex].count;
			
			
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
							<p><span>收录案件数量</span><i>${res.data.judge_count || '--'}起</i></p>
						</div>
					</div>
				</div>
    <div class="caseType">
        <p>
        <i></i>
        <span class="text-strong font-16">擅长领域:${res.data.detail[maxIndex].reason2}</span>
        </p>
        </div>`;
				parentNode.append(node1);

				$.each(res.data.detail, function(idx, ele) {
					var node2 = `     <dl>
        <dt>
        <i class="glyphicon glyphicon-hand-right"></i>${ele.reason2}
        <span class="pull-right">
        <span>代理案件数：${ele.count}</span>
    <span>胜诉率：<i class="font-16">${ele.suc_rate}</i></span>
        <span>部分胜率：<i class="font-16">${ele.part_suc_rate}</i></span>
        </span>
        </dt>
        </dl>`;
        			if(idx < 3){
        				$('.caseType').append(node2);
        			}
					

					$.each(ele.doc, function(i, e) {
						var node3 = `<dd><a>${e.title}</a></dd>`;
						$('.caseType dl:last-child').append(node3);
					});

					nameArr.push(ele.reason2);
					suc_rateArr.push(ele.suc_rate);
					part_suc_rateArr.push(ele.part_suc_rate);

				});

				//绘制图表
				//myChart0 = echarts.init(document.getElementById('rateChart0'));
				var barwidth = 40;
				var labelOption = {
					normal: {
						show: true,
						align: 'center',
						verticalAlign: 'middle',
						position: 'insideBottom',
						distance: 15,
					}
				};
				var option = {
					title: {
						x: 'center',
						text: '律师案件胜诉率图表',
						subtext: '不包含部分胜诉',
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					toolbox: {
						show: true,
						orient: 'vertical',
						left: 'right',
						top: 'center',
						feature: {
							//							saveAsImage: {
							//								show: true
							//							}
						}
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						axisTick: {
							show: false
						},
						data: nameArr
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
							type: 'bar',
							name: '胜诉率',
							barWidth: barwidth,
							label: labelOption,
							data: suc_rateArr
						},
						{
							type: 'bar',
							name: '部分胜诉率',
							barWidth: barwidth,
							label: labelOption,
							data: part_suc_rateArr
						}
					]

				}
				//myChart0.setOption(option);

			} else {
				errorModal(res.msg);
			}

		},
		error: function() {
			errorModal('请求律师详情失败！');
			console.error('/query/lawyer/lawyer_info', arguments);
		}
	});

	//图表
	(function() {
		//myChart1 = echarts.init(document.getElementById('rateChart1'));

		judge_rate(resKey, function(res) {
			// 指定图表的配置项和数据
			var labelOption = {
				normal: {
					show: true,
					align: 'center',
					verticalAlign: 'middle',
					position: 'insideBottom',
					distance: 15,
				}
			};
			var option = {
				title: {
					x: 'center',
					text: '律师总体案件胜诉率图表',
					subtext: '包含部分胜诉',
				},
				tooltip: {
					trigger: 'item'
				},
				toolbox: {
					show: true,
					feature: {
						//						saveAsImage: {
						//							show: true
						//						}
					}
				},
				calculable: true,
				grid: {
					borderWidth: 0,
					y: 80,
					y2: 60
				},
				xAxis: [{
					type: 'category',
					show: true,
					data: ['胜诉率', '败诉率', '部分胜诉率']
				}, ],
				yAxis: [{
					type: 'value',
					show: true
				}],
				series: [{
					name: '统计',
					type: 'bar',
					barWidth: 40,
					label: labelOption,
					itemStyle: {
						normal: {
							color: function(params) {
								// build a color map as your need.
								var colorList = [
									'#B5C334', '#C1232B', '#FCCE10'
								];
								return colorList[params.dataIndex]
							},
							//							label: {
							//								show: true,
							//								position: 'top',
							//								formatter: '{b}\n{c}'
							//							}
						}
					},
					data: [(res.data[0].value) / 100, (res.data[1].value) / 100, (res.data[2].value) / 100],
					markPoint: {
						tooltip: {
							trigger: 'item',
							backgroundColor: 'rgba(0,0,0,1)',
							//backgroundColor: 'rgba(0,0,0,0)',

						},
						data: [{
								xAxis: 0,
								y: 350,
								name: '胜诉率',
								symbolSize: 0

							},
							{
								xAxis: 1,
								y: 350,
								name: '败诉',
								symbolSize: 0

							},
							{
								xAxis: 2,
								y: 350,
								name: '部分胜诉',
								symbolSize: 0

							},
						]
					}
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			//myChart1.setOption(option);
		});

	})();

	function judge_rate(resKey, callback) {
		var parm = {
			'reason': resKey
		}
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/static_query/judge_rate', // http://47.92.38.167:8888/  http://47.97.197.176:8888
			type: 'post',
			data: param,
			success: function(res) {
				//console.log(res);
				if(res.code == 0) {
					if(callback) {
						callback(res);
					}

				} else {
					errorModal(res.msg);
				}

			},
			error: function() {
				errorModal('请求律师胜诉率失败！');
				console.error('/static_query/judge_rate', arguments);
			}
		});
	};

});