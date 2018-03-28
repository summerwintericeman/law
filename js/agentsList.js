/**
 * Created by sphwjj on 2018/3/12.
 */
/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
	//读取cookie
	var ulNote = $('#agentsList .liWrap');
	var getCookie = $.cookie('agents');
	var cookieMess = null;
	if(getCookie) {
		cookieMess = JSON.parse(getCookie);
	}
	//判断传过来的是人名还是机构名调用不同的函数或者接口

	agentsList(cookieMess, function(res) {

		if(cookieMess.per) {
			//表示此时调用的是人名查找获得的数据
			$.each(res.data, function(idx, ele) {
				createLawList(ele, cookieMess.per);
			});
		} else {
			//通过机构查找获取的数据
			$.each(res.data.agents, function(idx, ele) {
				createLawList(ele);
			});
		}

	});

	//添加案件列表子节点
	function createLawList(data ,name) {
		$.each(data, function(key, val) {
			if(!val) {
				val = '';
			}
		});
		var cp_name = data.cp_name,
		    Location = cookieMess.com;
		if(name){
			cp_name = name;
			Location = data.cp_name;
		}
		
		var liNode = `<li>
            <a href="agentsDetail.html?per=${cp_name}"  class="contant">
                <p class="name"><span class="pull-left">${cp_name}</span><i>${data.gender}</i><i>专业: ${data.major}</i><i>检索条数: ${data.patent_data.count}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${Location}</p>
              
            </a>
            <a class="details btn" href="agentsDetail.html?per=${cp_name}">查看详情</a>
        </li>`
//		  <p class="info text-strong">
//                  <span>证书编号：<i>${data.certNo}</i></span>
//                  <span>authNo：<i>${data.authNo}</i></span>
//        </p>
		ulNote.append(liNode);
	};

	function agentsList(cookieMess, callback) {
		var tempUrl = 'http://47.97.197.176:8888/query/patent/agent_company';
		var param = {
			'name': cookieMess.com
		};
		if(cookieMess.per) {
			param = {
				'name': cookieMess.per
			};
			tempUrl = 'http://47.97.197.176:8888/query/patent/agent_by_name';
		}
		$.ajax({
			dataType: 'json',
			url: tempUrl,
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					if(callback) {
						callback(res);
					}
				} else {
					errorModal(res.msg);
					console.error('查询代理人列表失败:', res);
				}
			},
			error: function() {
				errorModal('查询代理人列表失败!');
				console.error('', arguments);
			}
		});
	};

})