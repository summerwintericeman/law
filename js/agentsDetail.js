/**
 * Created by sphwjj on 2018/3/17.
 */
$(document).ready(function() {
	var getPer = getUrlParam('per', true) || '';
	//var getCom = getUrlParam('com',true) || '';
	var parNode = $('.content');
	var agentMsg = $.cookie('agentBaseMsg');
	agentMsg = agentMsg ? JSON.parse(agentMsg) : '';
	var _href = window.location.href;
	if(_href.indexOf('&com') > -1) {
		$('.path').find('a').eq(1).hide().next('i').hide();
	}

	function agentsDetail(showlist) {
		var param = {
			'name': getPer,
			"page_num": 1,
			"page_count": 12,
		};
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/query/patent/patent_by_agname',
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				console.log(res);
				showlist(res);
				draw();
			},
			error: function() {
				errorModal('查询代理人详情失败!');
				console.error('agent_by_name：', arguments);
			}
		});
	};

	//添加基本信息节点
	(function() {
		var node1 = `<div class="clearfix msgWrap">
						<div class="pull-left userMsg">
							<img src="../img/default-big.jpg" onerror="this.src='../img/default-big.jpg'">
							</div>
							<div class="pull-left">
						<h3><span>${getPer}　　</span><span>事务所：${agentMsg.cp_name || '--'}</span></h3>
						<div class="lawyerMsg clearfix">
						<p><span>执业证号</span><i>${agentMsg.certNo || '--'}</i></p>
						<p><span>性别</span><i>${agentMsg.gender || '--'}</i></p>
						<p class="zhuanliNum"><span>专利条数</span><i></i></p>
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
						<span class="text-strong font-16">专利展示:</span>
						<ul class="node2List"></ul>
						</p>
						</div>`;
		parNode.append(node1);

		agentsDetail(function(res) {
			if(res.code == 0 && res.data.data.length > 0) {
				//专利条数
				$('.msgWrap p.zhuanliNum i').html(res.data.count);
				//擅长领域
				var dowellHtml = $('#dowell').html();
				//擅长领域的添加
				var reasonList = [{//临时伪造数据
						"name": "专利1",
						"value": 1
					},
					{
						"name": "专利2",
						"value": 2
					},
					{
						"name": "专利3",
						"value": 3
					}
				];
				$.each(reasonList, function(idx, ele) {
					if(idx < 6) {
						var nodeDoWell = `　　<span>${ele.name}<i style="color:red;">　(${ele.value})</i></span>`;
						$('#dowell').append(nodeDoWell);
						//需要数量和具体的案由
						
						
						//后续画图的数据也需要早这里处理好
						
					}

				});

				//遍历数组进行添加
				for(var i = 0; i < 1; i++) {
					var obj = res.data.data[i];
					var addNode = `<li class='eachContent'><h3><span></span>
					<span><i class="LowTitle text-strong">${obj.dev_name}</i> </span></h3>
                    <p class="com">
                        <span><i class="LowTitle text-strong">专利类型:</i> ${obj.patent_type}</span>
                        <br/>
                        <span><i class="LowTitle text-strong">专利描述:</i> ${obj.abstract}</span>
                        <br/>
                    <span><i class="LowTitle text-strong">专利号/日期:</i> ${obj.patent_no} / ${obj.public_date}</span>
                    </p> </li>`;
					$('ul.node2List').append(addNode);
				}

			} else {
				errorModal(res.msg);
				console.error('查询代理人详情失败:', res);
			}

		});

	})();
	//绘制图表
	var draw = function() {
		var myChart0 = echarts.init(document.getElementById('rateChart0'));
		var nameList = ["专利1", "专利2", "专利3"];
		var reasonList = [{
				"name": "专利1",
				"value": 1
			},
			{
				"name": "专利2",
				"value": 2
			},
			{
				"name": "专利3",
				"value": 3
			}
		];
		var option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				x: 'left',
				data: nameList
			},
			toolbox: {
				show: true,
				orient: 'vertical',
				right: 40,
				top: 'top',
				feature: {
					saveAsImage: {
						show: true
					}
				}
			},
			series: [{
				name: '',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '12',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: reasonList
			}]
		};
		myChart0.setOption(option);
	}
		
		
	//获取更多的专利信息的跳转
	$("#getMoreMess").on("click",function(){
		var userLogin = $.cookie("userMess");
		console.log(userLogin);
		if(userLogin && (userLogin.email || userLogin.account)){
			//cookie存在并且其中的一个email或者account有值存在表示已经登录
			//跳转到详细的页面
			
			
		}else{
			console.log("aaa")
			$('#choiceMore').modal('show');
			$('#choiceMore').css({
				"margin-top":"200px"
			})
			//alert("如需查看更多，请您先登录")
			
		}

		
	});
	
	//模态框选择登录
	$("#choiceLogin").on("click",function(){
		window.location.href = "./login.html";
	});
		
	
	
});