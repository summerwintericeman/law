/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
	var fromPage = getUrlParam('fromPage');
	var listflag = true;
	var ulNote = $(".parentUl");
	var all = {
		listTotal: 0, //请求返回的最大页码
		listnum: -1, //当前查看页码
		reasonObj: null,
	}
	var tempCookie = $.cookie('all');
	if(tempCookie) {
		all = JSON.parse(tempCookie);
	}
	var cookieM;

	function cookieMess() {
		var num = all.listnum == -1 ? 1 : parseInt(all.listnum);
		var cookie = $.cookie('searchLawyer');
		if(!cookie) {
			return;
		} else {
			cookieM = JSON.parse(cookie);
			var	name = cookieM.name || '',
				des = cookieM.des || '',
				province = cookieM.province || '',
				city = cookieM.city || '',
				region = cookieM.region || '';
			all.reasonObj = cookieM;
			getPreMessage(name, des, province, city, region, num);
		}

	};

	function getPreMessage(name, des, province, city, region, page_num) {
		var knowledgeNum = 0;
		if(fromPage && fromPage == 'property') {
			knowledgeNum = 1;
		}
		if(name) {
			if(des) {
				caseFoud(knowledgeNum, des, function(res) {
					all.reasonObj.res = res;
					//lawyerList(res, city, page_num);
					lawyerMatch(res, name, page_num);
				});
			} else {
				all.reasonObj.res = '';
				lawyerMatch('', name, page_num);
			}

		} else {
			if(cookieM.res) {
				lawyerList(cookieM.res, province, city, region, page_num);
			} else {
				caseFoud(knowledgeNum, des, function(res) {
					all.reasonObj.res = res;
					lawyerList(res, province, city, region, page_num);
				});
			}

		}

	}

	function lawyerList(obj, province, city, region, page_num, callback) {
		var tempLocation = null;
		tempLocation = city;
		if(province == "北京" || province == "上海" || province == "天津" || province == "重庆") {
			tempLocation = province + "市";
		}
		var param = JSON.stringify({
			'reason': obj,
			'province': province,
			'city': tempLocation,
			'region': region,
			'page_count': 12,
			'page_num': page_num
		});
		console.log(param);
		console.log(obj);
		var caseType = '';
		if(obj.reason_5) {
			caseType = obj.reason_5;
		} else if(obj.reason_4) {
			caseType = obj.reason_4;
		} else if(obj.reason_3) {
			caseType = obj.reason_3;
		} else if(obj.reason_2) {
			caseType = obj.reason_2;
		} else if(obj.second_reason) {
			caseType = obj.second_reason;
		}

		$("#listExplain").html(caseType + '案件律师代理情况');
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/query/lawyer/lawyer_list', // http://47.92.38.167:8888/  http://47.97.197.176:8888
			type: 'post',
			data: param,
			success: function(res) {
				if(res.code == 0) {
					if(callback) {
						callback(res);
						return;
					}
					console.log(res);
					//获得总页数
					all.listTotal = res.max_page_num;
					var tempCoo = JSON.stringify(all);
					$.cookie('all', tempCoo, {
						path: '/'
					});
					if(listflag) {
						creatPage(res.max_page_num, page_num);

						$('.pagerWrap').pagination({
							pageCount: res.max_page_num,
							totalData: 12 * res.max_page_num,
							showData: 12,
							current: page_num,
							mode: 'fixed',
							isHide: true,
							callback: function(api) {
								pagerGo(api);
							}
						});

						listflag = false;
					}

					//清空数据重新加载新数据
					ulNote.empty();
					for(var i = 0; i < res.data.length; i++) {
						createLawList(res.data[i]);
					}

				} else {
					errorModal(res.msg);
				}

			},
			error: function() {
				errorModal('请求律师列表失败！');
				console.error('/query/lawyer/lawyer_list', arguments);
			}
		});

	};

	function createLawList(obj) {
		var newObj = {
			__name: encodeURIComponent(obj.name) || '',
			__location: encodeURIComponent(obj.location) || '',
			name: obj.name || '',
			_location: obj.location || '',
			gender: obj.gender || '',
			num: obj.num || '',
			degree: obj.degree || ''
		};
		var noteNew = `<li class="lipad mouseHand">
            <a href="lawyerDetail.html?lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}&caseNum=${newObj.num}"  class="contant">
                <p class="name"><span class="pull-left">${newObj.name}</span><i>${newObj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${newObj._location}</p>
                <p class="info">
                    <span>代理一审判决案件：<i>${newObj.num}</i> <i>起</i></span>
                </p>
                <span class="details btn contant">查看详情</span>
            </a>
            
        </li>`;
		if(fromPage && fromPage == 'property') {
			noteNew = `<li class="lipad mouseHand">
            <a href="lawyerDetail.html?fromPage=property&lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}&caseNum=${newObj.num}"  class="contant">
                <p class="name"><span class="pull-left">${newObj.name}</span><i>${newObj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${newObj._location}</p>
                <p class="info">
                    <span>代理一审判决案件：<i>${newObj.num}</i> <i>起</i></span>
                </p>
                <span class="details btn contant">查看详情</span>
            </a>
            
        </li>`;
		}
		ulNote.append(noteNew);
	};

	function creatPage(num, page_num) {
		var liNote = $(".before");
		num = num > 5 ? 5 : num;
		for(var i = 1; i <= num; i++) {
			var noteNew;
			if(i == page_num) {
				noteNew = `<li class="changePage active pageNum mouseHand">
					<a>${i}</a>
				</li>`;
			} else {
				noteNew = `<li class="changePage pageNum mouseHand">
					<a>${i}</a>
				</li>`;
			}
			liNote.before(noteNew);
		}
	};

	function pagerGo(api) {
		var curIdx = api.getCurrent();
		//获得页数
		all.listnum = curIdx;
		var tempCoo = JSON.stringify(all);
		$.cookie('all', tempCoo, {
			path: '/'
		});
		//获取对应页数的页面信息
		//console.log(all);
		//通过all 来进行参数的给予
		if(all.reasonObj.name) {
			if(all.reasonObj.res) {
				lawyerMatch(all.reasonObj.res, all.reasonObj.name, curIdx);
			} else {
				lawyerMatch('', all.reasonObj.name, page_num);
			}

		} else {
			lawyerList(all.reasonObj.res, all.reasonObj.province, all.reasonObj.city, all.reasonObj.region, curIdx);
		}

	};

	cookieMess();
});