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

	

	function agentsDetail() {
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
				console.log(res);
				if(res.code == 0 && res.data.data.length > 0) {
					parNode.empty();
					var obj = res.data.data[0];
					console.log(obj)
					var addNode = `<div class='eachContent'><h3><span>${getPer}</span>
					<span>　　<i class="LowTitle">${obj.patent_type}</i> </span></h3>
                    <p class="com">
                        <span><i class="LowTitle">专利名称:</i> ${obj.dev_name}</span>
                        <br/>
                        <span><i class="LowTitle">专利描述:</i> ${obj.abstract}</span>
                        <br/>
                    <span><i class="LowTitle">专利号/日期:</i> ${obj.patent_no} / ${obj.public_date}</span>
                    </p>
                    <div class="caseType">
                       
                    </div> </div>`;
					parNode.append(addNode);
// <p>
//                      <i></i>
//                      <span class="text-strong font-16">代理专利</span>
//                      </p>
//					var sonNodeWrap = $('.caseType');
//					$.each(obj.patent_data.data, function(i, ele) {
//						var sonNode = `<dl>
//                  <dt>
//                  <i class="glyphicon glyphicon-hand-right"></i>
//                      <span><i>${ele.dev_name}</i>(${ele.patent_type})</span>
//                      <span>${ele.patent_no}</span>
//                  <span>发布日期：${ele.public_date}</span>
//                  </dt>
//                  <dd><a>${ele.abstract}</a></dd>
//                  </dl>`;
//						sonNodeWrap.append(sonNode);
//					});

				} else {
					errorModal(res.msg);
					console.error('查询代理人详情失败:', res);
				}
			},
			error: function() {
				errorModal('查询代理人详情失败!');
				console.error('agent_by_name：', arguments);
			}
		});
	};
	agentsDetail();

	//  function agentsList(callback) {
	//      var param = {
	//          'name': getCom
	//      };
	//      $.ajax({
	//          dataType: 'json',
	//          url: 'http://47.92.38.167:8889/query/patent/agent_company',
	//          type: 'post',
	//          data: JSON.stringify(param),
	//          success: function(res) {
	//              console.log(res);
	//              if(res.code==0){
	//                  if(callback){
	//                      callback(res);
	//                  }
	//              }else{
	//                  errorModal(res.msg);
	//                  console.error('查询代理人列表失败:',res);
	//              }
	//          },
	//          error: function() {
	//              errorModal('查询代理人列表失败!');
	//              console.error('agent_by_name：', arguments);
	//          }
	//      });
	//  };

	//添加案件列表子节点
	function createPage(data) {
		debugger;
		$.each(data, function(key, val) {
			if(!val) {
				val = '';
			}
		});
		var liNode = `<li>
            <a href="agentsDetail.html?per=${cookieMess.per}&com=${cookieMess.com}"  class="contant">
                <p class="name"><span class="pull-left">${data.cp_name}</span><i>${data.gender}</i><i>${data.major}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${cookieMess.com}</p>
                <p class="info text-strong">
                    <span>certNo：<i>${data.certNo}</i></span>
                    <span>authNo：<i>${data.authNo}</i></span>
                </p>
            </a>
            <a class="details btn" href="lawyerDetail.html?id=0">查看详情</a>
        </li>`

	};

});