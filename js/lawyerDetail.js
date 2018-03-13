/**
 * Created by sphwjj on 2018/3/10.
 */
$(function(){
       var name = getUrlParam('lawyer_name',true),loct =  getUrlParam('lawyer_location',true);
       
       //请求律师详情
       var param = JSON.stringify({
			'lawyer_name': name,
			'lawyer_location': loct
		});
		console.log(param);
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/static_query/lawyer_info', // http://47.92.38.167:8888/  http://47.92.38.167:8889
			type: 'post',
			data: param,
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					console.log(res);
					
				}else{
					errorModal(res.msg);
				}

			},
			error: function() {
				errorModal('请求律师详情失败！');
				console.error('/static_query/lawyer_list', arguments);
			}
		});
       
       
       
       
       
       

})