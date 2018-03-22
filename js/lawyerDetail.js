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
    <h3><span>${name}</span><span>　　${res.data.degree}</span></h3>
    <div class="caseType">
        <p>
        <i></i>
        <span class="text-strong font-16">案例</span>
        </p>
        </div>`;
                    parentNode.append(node1);

					$.each(res.data.detail,function(idx,ele){
                        judge_rate(ele.reason2,function (pkg) {
							var rate = pkg.data;
							var node2 = `     <dl>
        <dt>
        <i class="glyphicon glyphicon-hand-right"></i>${ele.reason2}
        <span class="pull-right">
        <span>代理案件数：${res.data.judge_count}</span>
    <span>胜诉率：<i class="font-16">${rate[0].value}</i></span>
        <span>部分胜率：<i class="font-16">${rate[1].value}</i></span>
        <span>败诉率：<i class="font-16">${rate[2].value}</i></span>
        </span>
        </dt>
        </dl>`;
					$('.caseType').append(node2);

					$.each(ele.doc,function(i,e){
						var node3 = `<dd><a>${e.title}</a></dd>`;
						$('.caseType dl:last-child').append(node3);
					});

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
       
       
       function judge_rate(val,callback) {
       	var parm = {
            'reason':{
                'reason_2': val
            }
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
       }



});