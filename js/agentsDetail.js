/**
 * Created by sphwjj on 2018/3/17.
 */
$(document).ready(function() {
	var getPer = getUrlParam('per', true) || '';
	//var getCom = getUrlParam('com',true) || '';
	var parNode = $('.content');
	console.log(getPer);
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
			url: 'http://47.92.38.167:8889/query/patent/patent_by_agname',
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				showlist(res);
			},
			error: function() {
				errorModal('查询代理人详情失败!');
				console.error('agent_by_name：', arguments);
			}
		});
	};

	agentsDetail(function(res) {
		console.log(res);
		if(res.code == 0 && res.data.data.length > 0) {
			parNode.empty();
			//遍历数组进行添加
			var nameNode = `<div class='eachContent'><h3><span>${getPer}</span>`;
			parNode.append(nameNode);
			for(var i = 0; i < 3; i++) {
				var obj = res.data.data[i];
				console.log(obj)
				var addNode = `<div class='eachContent'><h3><span></span>
					<span><i class="LowTitle">${obj.dev_name}</i> </span></h3>
                    <p class="com">
                        <span><i class="LowTitle">专利类型:</i> ${obj.patent_type}</span>
                        <br/>
                        <span><i class="LowTitle">专利描述:</i> ${obj.abstract}</span>
                        <br/>
                    <span><i class="LowTitle">专利号/日期:</i> ${obj.patent_no} / ${obj.public_date}</span>
                    </p>
                    <div class="caseType">
                       
                    </div> </div>`;
				parNode.append(addNode);
			}

		} else {
			errorModal(res.msg);
			console.error('查询代理人详情失败:', res);
		}

	});
	//添加案件列表子节点
	//	function createPage(data) {
	//		debugger;
	//		$.each(data, function(key, val) {
	//			if(!val) {
	//				val = '';
	//			}
	//		});
	//		var liNode = `<li>
	//          <a href="agentsDetail.html?per=${cookieMess.per}&com=${cookieMess.com}"  class="contant">
	//              <p class="name"><span class="pull-left">${data.cp_name}</span><i>${data.gender}</i><i>${data.major}</i></p>
	//              <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${cookieMess.com}</p>
	//              <p class="info text-strong">
	//                  <span>certNo：<i>${data.certNo}</i></span>
	//                  <span>authNo：<i>${data.authNo}</i></span>
	//              </p>
	//          </a>
	//          <a class="details btn" href="lawyerDetail.html?id=0">查看详情</a>
	//      </li>`
	//
	//	};

});