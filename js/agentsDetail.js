/**
 * Created by sphwjj on 2018/3/17.
 */
$(document).ready(function() {
	var getPer = getUrlParam('per', true) || '';
	var com = getUrlParam('com', true) || '';
	//var getCom = getUrlParam('com',true) || '';
	var parNode = $('.content');
	var agentMsg = $.cookie('agentBaseMsg');
	var timer;//定时器
	agentMsg = JSON.parse(agentMsg);
	console.log(agentMsg);
	//var mapData = agentMsg.statistic_info,//需要在请求数据后进行填充
	var mapData = null,
		mapDataArr = [],
		nameList = [],
		drillMapArr = [],
		drilldownArr = [],
		zhuanliTotalNum = 0;
	var sortKey = [];//排序
	//console.log(mapData);
	//console.log(mapDataArr);
//	var _href = window.location.href;
//	if(_href.indexOf('&com') > -1) {
//		$('.path').find('a').eq(1).hide().next('i').hide();
//	}

	function agentsDetail(showlist) {
		var param = {
			name: getPer,
			agency: com,
			page_num: 1,
			page_count: 12
		};
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/query/patent/patent_by_agname',
			//url: 'http://47.97.197.176:8888/static_query/patent_by_agname',
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				if(res.code == 0) {
					console.log(res);
					if(res.data.statistic_info) {
						mapData = res.data.statistic_info; //把请求获得的数据放在这里
					}
					showlist(res);
					draw();
				} else {
					errorModal('查询详情失败!');
				}
			},
			error: function() {
				errorModal('查询详情失败!');
				console.error('patent_by_agname：', arguments);
			}
		});
	};

	//添加基本信息节点
	(function() {
		var comStr = com || '--';
		var agentMsgcertNo = agentMsg.certNo || '--';
		var agentMsggender = agentMsg.gender || '--';
		var node1 = '<div class="clearfix msgWrap"><div class="pull-left userMsg">';
		node1 +='<img src="../img/default-big.jpg"onerror="this.src=\'../img/default-big.jpg\'"></div><div class="pull-left userMsg1"><h3><span>' + getPer;
　		node1 += '</span><span>事务所：'+ comStr + '</span></h3><div class="lawyerMsg clearfix"><p><span>执业证号</span><i>';
		node1 += agentMsgcertNo + '</i></p><p><span>性别</span><i>' + agentMsggender ;
		node1 += '</i></p><p class="zhuanliNum"><span>代理总数</span><i></i></p></div></div></div><div class="caseType"><p><i></i><span class="text-strong font-16 " id = "dowell">代理专利类型分布:</span></p><p><i></i><span class="text-strong font-16">代理专利详情:</span><ul class="node2List"></ul></p></div>';
		parNode.append(node1);

		agentsDetail(function(res) {
			if(res.code == 0 && res.data.data.length > 0) {
				//专利条数
				$('.msgWrap p.zhuanliNum i').html(res.data.count);
				//擅长领域
				var dowellHtml = $('#dowell').html();
				//擅长领域的添加
				console.log(mapData);
				$.each(mapData.total, function(key, val) {
					//发明专利、
					//实用新型专利、
					//外观设计专利、
					//进入中国国家阶段的PCT发明专利申请、
					//进入中国国家阶段的PCT实用新型专利申请
					//drilldownArr
					switch(key){
						case '发明专利':
							sortKey[0]=[key,val] ;break;
						case '实用新型专利':
							sortKey[1]=[key,val];break;
						case '外观设计专利':
							sortKey[2]=[key,val];break;
						case '进入中国国家阶段的PCT发明专利':
							sortKey[3]=[key,val];break;
						case '进入中国国家阶段的PCT实用新型专利':
							sortKey[4]=[key,val];break;
					};

				});
				
				$.each(sortKey,function(i,e){
					if(e == undefined){
						return true;
					}
					var key = e[0],val = e[1];
					if(val != 0){
						zhuanliTotalNum += val;
							mapDataArr.push({
								name: key,
								y: val,
								drilldown:key
							})
							drillMapArr.push([
								key,
								val
							]);
							nameList.push(key);
							var nodeDoWell = '<span>' + key + '<i style="color:red;">(' +  val + ')</i>　</span>';
							$('#dowell').append(nodeDoWell);
					}
					
				});


				$.each(drillMapArr,function(i,e){
					var arr = [];var wxIndex = [];//无效数据下标
					$.each(mapData[e[0]],function(key,val){
						arr.push([key,val]);
                        if(key.indexOf('无效')>-1){
                            wxIndex.push(arr.length-1);
                        }
					});
                    //合并授权阶段两个无效字段数据
					if(wxIndex.length>1){
                        var maxIdx = Math.max(wxIndex[0],wxIndex[1]);
                        var minIdx = Math.min(wxIndex[0],wxIndex[1]);
                        arr[minIdx][1] = arr[minIdx][1] + arr[maxIdx][1];
                        arr.splice(maxIdx,1);
					}

					drilldownArr.push({
						type:'column',
						id:e[0],
						data:arr,
						name:e[0]
					});
				});



				console.log(drilldownArr);

				//遍历数组进行添加
				for(var i = 0; i < 1; i++) {
					var obj = res.data.data[i];
					var addNode = '<li class="eachContent"><h3><span>1. <i class="LowTitle text-strong">' + obj.dev_name + '</i> </span></h3><p class="com"><span><i class="LowTitle text-strong">专利类型:</i>'; 
                        addNode += obj.patent_type + '</span><br/><span><i class="LowTitle text-strong">专利描述:</i>' + obj.abstract + '</span><br/><span><i class="LowTitle text-strong">专利号/日期:</i>';
                        addNode += obj.patent_no +  "/"  + obj.public_date + '</span></p> </li>';
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
		var tipNode = $('p.tipText');
		$('#rateChart0').highcharts({
			chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            events:{
	            	drillup:function(){
						this.yAxis[0].update({visible: false});
						this.xAxis[0].update({visible: false});
						tipNode.show();
                        $('.allMap .tipBox').hide();
						if(timer){
                            window.clearTimeout(timer);
						};

					},
					drilldown:function(e){
						this.yAxis[0].update({visible: true});
						this.xAxis[0].update({visible: true});
						tipNode.hide();

						var data = e.seriesOptions.data;
                        var senqNum = 0,souqNum = 0;
						$.each(data,function(i,e){
							if(e[0].indexOf('申请阶段')>-1){
                                senqNum++;
							}else if(e[0].indexOf('授权阶段')> -1){
                                souqNum++;
							}

						});

                        //设置分段框
						timer = setTimeout(function(){
                            window.clearTimeout(timer);
							//highcharts-plot-background
                            var width = $('.highcharts-plot-background').css('width');
                            var tipBox = $('.allMap .tipBox');
                            tipBox.css('width',width);
                            tipBox.find('span:eq(0)').css('width',100 * senqNum/(senqNum+souqNum) + '%');
                            tipBox.find('span:eq(1)').css('width',100 * souqNum/(senqNum+souqNum) + '%');
                            tipBox.show();
						},500);

					}
	            }
				
        	},
        	credits: {
						enabled: false
			},
			legend: {
				layout: 'vertical',
				backgroundColor: '#FFFFFF',
				align: 'left',
				verticalAlign: 'top',
				useHTML:true,
				labelFormat: '<span style="{color}">{name} </span>'
			},
        	title:{
        		text:''
        	},
        	lang:{
        		drillUpText:"返回"
        	},
			yAxis:{
					title:{
						text:'数量'
					}
			},
			xAxis: {
					type: 'category',
					labels:{
                        formatter:function(){
                        	var idx = this.value.indexOf('_');
                        	var val = this.value.substr(idx+1,this.value.length);
                            if(this.value.indexOf('申请阶段')> -1){
                                return '<span style="color:#f99800">' + val + '</span>';
							}else if(this.value.indexOf('授权阶段')> -1){
                                return '<span style="color:#08c2ef">' + val + '</span>';
							}
						}
					}
			},
	        plotOptions: {
	        	column: {
	            	dataLabels: {
	                    enabled: true,
//	                    format: '<b>{point.y}({point.percentage:.0f}%)</b>',
	                    formatter:function(){
	                    	var total = 0 ;
	                    	if(this.percentage == undefined){
	                    		$.each(this.series.data,function(i,e){
		                    		total += e.y;
		                    	});
		                    	this.total = total;
		                    	if(this.y>0){
		                    		this.percentage = parseFloat(((this.y/this.total)* 100).toFixed(2)) ;
		                    	}else{
		                    		this.percentage = 0;
		                    	}
		                    	
	                    	}
	                    	
	                    	return this.y + '(' + this.percentage + '%)';
	                    },
	                    style: {
	                        color: 'black'
	                    }
	               },
				    events: {
				        legendItemClick: function(e) {
				            return false; // 直接 return false 即可禁用图例点击事件
				        }
				    },
				    tooltip: {
		        		headerFormat: '',
//			            pointFormat: '<span><b>{point.name}</b>: {point.y}</span>',
			            pointFormatter:function(){
			            	var total = 0 ;
	                    	if(this.percentage == undefined){
	                    		$.each(this.series.data,function(i,e){
		                    		total += e.y;
		                    	});
		                    	this.total = total;
		                    	if(this.y>0){
		                    		this.percentage = parseFloat(((this.y/this.total)* 100).toFixed(2)) ;
		                    	}else{
		                    		this.percentage = 0;
		                    	}
		                    	
	                    	}
			            	return this.name + ':' + this.y + '(' + this.percentage + '%)';
			            }
			      }
			    },
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>',
	                    style: {
	                        color: 'black'
	                    }
	                },
	                showInLegend:true,
	                states: {
	                    hover: {
	                        enabled: false
	                    }  
	                },
	                slicedOffset: 20,         // 突出间距
	                point: {                  // 每个扇区是数据点对象，所以事件应该写在 point 下面
	                    events: {
	                        // 鼠标滑过是，突出当前扇区
	                        mouseOver: function() {
	                            this.slice();
	                        },
	                        // 鼠标移出时，收回突出显示
	                        mouseOut: function() {
	                            this.slice();
	                        },
	                        // 默认是点击突出，这里屏蔽掉
	                        click: function() {
	                            return false;
	                        },
	                        legendItemClick: function(e) {
				                return false; // 直接 return false 即可禁用图例点击事件
				            }
	                    }
	                },
	                tooltip: {
		        		headerFormat: '',
			            pointFormat: '<span><b>{point.name}</b>: {point.y} ({point.percentage:.0f}%)</span>',
			        }
	                 
	            }
	            
	        },
	        series: [{
	            type: 'pie',
	            colorByPoint: true,
	            data:mapDataArr
            }],
            drilldown: {
            	drillUpButton: {
						relativeTo: 'spacingBox',
						position: {
								y: -10,
								x: 5
						}
				},
			    series: drilldownArr,
			    activeAxisLabelStyle: {
						textDecoration: 'none',
						fontStyle: 'italic'
				},
				activeDataLabelStyle: {
						textDecoration: 'none',
						fontStyle: 'italic'
				}
			}
            
		});


		var chart = $('#rateChart0').highcharts();
        var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        if(winWidth<1024){
            chart.legend.update({
                layout: 'horizontal',
                backgroundColor: '#FFFFFF',
                align: 'center',
                verticalAlign: 'top',
                itemStyle: {
                    fontSize: '12px'
                }
            });
            chart.update({
                plotOptions:{
                    pie:{
                        dataLabels:{
                            enabled:false
                        }
                    }
				}

            })
		}


	}

	var resizeTimer;
    window.onresize = function(){
    	if(resizeTimer){
    		window.clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(function(){
		var width = $('.highcharts-plot-background').css('width');
		var tipBox = $('.allMap .tipBox');
		if(tipBox.css('display') == 'none'){
			return;
		}
		tipBox.css('width',width);

		},150);

	}

	//获取更多的专利信息的跳转
	$("#getMoreMess").on("click", function() {
		var userLogin = $.cookie("userMess");
		console.log(userLogin);
		if(userLogin) {
			userLogin = JSON.parse(userLogin);
		}
		if(userLogin && (userLogin.email || userLogin.account)) {
			//cookie存在并且其中的一个email或者account有值存在表示已经登录
			
			//跳转到详细的页面
			window.location.href = "./zhuanLiList.html?per=" + getPer + '&com=' + com;
		} else {
			console.log("aaa")
			$('#choiceMore').modal('show');
			$('#choiceMore').css({
				"margin-top": "200px"
			})
			//alert("如需查看更多，请您先登录")

		}

	});

	//模态框选择登录
	$("#choiceLogin").on("click", function() {
		//保存当前页面地址
			var pageUrl = window.location.href;
			$.cookie('toLoginPre',pageUrl,{path:'/'});
		window.location.href = "./login.html";
	});

});