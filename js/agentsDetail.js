/**
 * Created by sphwjj on 2018/3/17.
 */
$(document).ready(function() {
	var getPer = getUrlParam('per', true) || '';
	//var getCom = getUrlParam('com',true) || '';
	var parNode = $('.content');
	var agentMsg = $.cookie('agentBaseMsg');
    agentMsg = agentMsg?JSON.parse(agentMsg):'';
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
			},
			error: function() {
				errorModal('查询代理人详情失败!');
				console.error('agent_by_name：', arguments);
			}
		});
	};



	//添加基本信息节点
	(function(){
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
                $('#dowell').html(dowellHtml + '此处暂无数据');

                //遍历数组进行添加
                for(var i = 0; i < 3; i++) {
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