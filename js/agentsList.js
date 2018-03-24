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

	agentsList(cookieMess, function(pkg) {
		//console.log(pkg);
		//获得数据后的遍历添加

		$.each(pkg.data, function(idx, ele) {
			createLawList(ele);
		});

	});

	//添加案件列表子节点
	function createLawList(data) {
		$.each(data, function(key, val) {
			if(!val) {
				val = '';
			}
		});
		var _cp_name = encodeURIComponent(data.cp_name);
		var liNode = `<li>
            <a href="agentsDetail.html?per=${_cp_name}"  class="contant">
                <p class="name"><span class="pull-left">${data.cp_name}</span><i>${data.gender}</i><i>${data.major}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${cookieMess.com}</p>
                <p class="info text-strong">
                    <span>certNo：<i>${data.certNo}</i></span>
                    <span>authNo：<i>${data.authNo}</i></span>
                </p>
            </a>
            <a class="details btn" href="agentsDetail.html?per=${_cp_name}">查看详情</a>
        </li>`
		ulNote.append(liNode);
	};

	function agentsList(cookieMess, callback) {
		var tempUrl = 'http://47.92.38.167:8889/query/patent/agent_company';
		var param = {
			'name': cookieMess.com
		};
		if(cookieMess.per) {
			param = {
				'name': cookieMess.per
			};
			tempUrl = 'http://47.92.38.167:8889/query/patent/agent_by_name';
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