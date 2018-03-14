/**
 * Created by sphwjj on 2018/3/12.
 */
$(function(){
	//读取cookie
	var param =  $.cookie('agents');
	if(!param){
		errorModal('查询代理人失败！',function(){
			window.location.href = 'propery.html?page=agents';
		});
		return;
	}
	
	
		
	
	
	
	
	
	
	
});
