/**
 * Created by sphwjj on 2018/3/10.
 */
$(function(){
       var name = getUrlParam('lawyer_name',true),_loction =  getUrlParam('lawyer_location',true);
    var resKey = $.cookie('all');
    resKey = JSON.parse(resKey);
    resKey = resKey.reasonObj.res;
    var parentNode = $('.content');
       
       //请求律师详情
       var param = JSON.stringify({
           reason: resKey,
			lawyer_name: name,
			lawyer_location: _loction
		});
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/query/lawyer/lawyer_info', // /query/lawyer/lawyer_info  /static_query/lawyer_infohttp://47.92.38.167:8888/  http://47.92.38.167:8889
			type: 'post',
			data: param,
			success: function(res) {
				console.log(res);
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
        <span class="text-strong font-16">案例</span>
        </p>
        </div>`;
                    parentNode.append(node1);

					$.each(res.data.detail,function(idx,ele){
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
					$('.caseType').append(node2);

					$.each(ele.doc,function(i,e){
						var node3 = `<dd><a>${e.title}</a></dd>`;
						$('.caseType dl:last-child').append(node3);
					});


					});

				}else{
					errorModal(res.msg);
				}

			},
			error: function() {
				errorModal('请求律师详情失败！');
				console.error('/query/lawyer/lawyer_info', arguments);
			}
		});
       

    //图表
    (function(){
        var myChart = echarts.init(document.getElementById('rateChart'));

        judge_rate(resKey,function(res){
            // 指定图表的配置项和数据
            var option = {
                title: {
                    show: false
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    axisLabel:{
                        textStyle:{
                            fontWeight:'bold'
                        }
                    },
                    axisLine:{
                        symbol:['none','arrow'],
                        symbolSize:[8,10],
                    },
                    data: [{
                        value:res.data[0].name,
                        textStyle:{
                            color:'#000',
                            fontWeight:'bold'
                        }
                    },
                        {
                            value:res.data[1].name,
                            textStyle:{
                                color:'rgba(255,0,0,.7)',
                                fontWeight:'bold'
                            }
                        },
                        {
                            value:res.data[2].name,
                            textStyle:{
                                color:'rgba(255,0,0,.5)',
                                fontWeight:'bold'
                            }
                        }],
                    axisTick:{
                        show:false
                    }
                },
                yAxis: {
                    axisTick:{
                        show:false
                    }
                },
                series: [{
                    type: 'bar',
                    data: [(res.data[0].value)/100, (res.data[1].value)/100, (res.data[2].value)/100]
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        });

    })();




       function judge_rate(resKey,callback) {
       	var parm = {
            'reason':resKey
        }
           $.ajax({
               dataType: 'json',
               url: 'http://47.92.38.167:8889/static_query/judge_rate', // http://47.92.38.167:8888/  http://47.92.38.167:8889
               type: 'post',
               data: param,
               success: function(res) {
                   console.log(res);
                   if(res.code == 0) {
                       if(callback){
                       		callback(res);
					   }

                   }else{
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