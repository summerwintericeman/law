/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
	var fromPage = getUrlParam('fromPage');
	//读取cookie
	var ulNote = $('#caseListBody .liWrap');
	var pagerUl = $('#caseListBody .pagination');
	var caseListCookie = $.cookie('caseList');
	var isFirstLoad = true;
	if(!caseListCookie) {
		caseListCookie = {
			listTotal: 0, //请求返回的最大页码
			listnum: -1, //当前查看页码
			reasonObj: null,
		}
	} else {
		caseListCookie = JSON.parse(caseListCookie);
	}

	var getCookie = $.cookie('searchCase');
	var sendReason = null;
	if(getCookie) {
		var cookieMess = JSON.parse(getCookie),
			des = cookieMess.des,
			province = cookieMess.province || '',
			city = cookieMess.city || '',
			region = cookieMess.region || '';
		caseListCookie.reasonObj = cookieMess;
		var knowledgeNum = 0;
		if(fromPage && fromPage == 'property') {
			knowledgeNum = 1;
		}
		var curPageNum = (caseListCookie.listnum == -1 || !caseListCookie.listnum) ? 1 : parseInt(caseListCookie.listnum);
		if(cookieMess.res) {
			caseList(cookieMess.res, curPageNum, function(pkg) {
				$.each(pkg.data, function(idx, ele) {
					createLawList(cookieMess.res, ele);
				});
				creatPage(pkg.max_page_num, curPageNum);
				//保存cookie
				caseListCookie.listTotal = pkg.max_page_num;
				$.cookie('caseList', JSON.stringify(caseListCookie), {
					path: '/'
				});
				//分页
				if(isFirstLoad) {
					$('.pagerWrap').pagination({
						pageCount: pkg.max_page_num,
						totalData: 12 * pkg.max_page_num,
						showData: 12,
						current: curPageNum,
						mode: 'fixed',
						isHide: true,
						callback: function(api) {
							pagerGo(api);
						}
					});

					isFirstLoad = false;
				}

			});
		} else {
			caseFoud(knowledgeNum, des, function(res) {
				console.log(res);
				//sendReason = res.second_reason;
				caseListCookie.reasonObj.des = res;
				caseList(res, curPageNum, function(pkg) {

					$.each(pkg.data, function(idx, ele) {
						createLawList(res, ele);
					});
					creatPage(pkg.max_page_num, curPageNum);
					//保存cookie
					caseListCookie.listTotal = pkg.max_page_num;
					$.cookie('caseList', JSON.stringify(caseListCookie), {
						path: '/'
					});
					//分页
					if(isFirstLoad) {
						$('.pagerWrap').pagination({
							pageCount: pkg.max_page_num,
							totalData: 12 * pkg.max_page_num,
							showData: 12,
							current: curPageNum,
							mode: 'fixed',
							isHide: true,
							callback: function(api) {
								pagerGo(api);
							}
						});

						isFirstLoad = false;
					}

				});
			});
		}

	};

	//添加案件列表子节点
	function createLawList(res, data) {
		if(data.judgement_date) {
			var date = data.judgement_date.split(/\s/);
			data.judgement_date = date[0];
		}
		sendReason = res.second_reason;
		var newObj = {
			wenshu_id: data.wenshu_id || '',
			title: data.title || '',
			court: data.court || '',
			judicial_procedure: data.judicial_procedure || '',
			case_num: data.case_num || '',
			judgement_date: data.judgement_date || '',
			source_url: data.source_url || ''
		}

		var liNode = '<li><a href="./minshianjianDetail.html?wenshu=' + newObj.wenshu_id + '&reason=' + sendReason + '"    class="contant">';
            liNode += '<p class="title text-strong">' + newObj.title + '</p><p class="court">审判法院：' + newObj.court + "(" + newObj.judicial_procedure + ')' + '</p>';
            liNode +=  '<p class="info"><span>案件编号：'+  newObj.case_num + '</span><span>审判日期：' +  newObj.judgement_date + '</span></p><span class="details btn contant">查看详情</span></a></li>';
		var page = getUrlParam('fromPage');
		if(page && page == 'property') {
			liNode = '<li><a href="./minshianjianDetail.html?wenshu=' + newObj.wenshu_id + '&reason=' + sendReason + '&fromPage=property"    class="contant">';
            liNode += '<p class="title text-strong">' + newObj.title + '</p><p class="court">审判法院：' + newObj.court + "(" + newObj.judicial_procedure + ')' + '</p>';
            liNode +=  '<p class="info"><span>案件编号：'+  newObj.case_num + '</span><span>审判日期：' +  newObj.judgement_date + '</span></p><span class="details btn contant">查看详情</span></a></li>';
		}
		ulNote.append(liNode);
	};
	//创建翻页节点
	function creatPage(num, page_num) {
		var liNote = $(".before");
		num = num > 5 ? 5 : num;
		for(var i = 1; i <= num; i++) {
			var noteNew;
			if(i == page_num) {
				noteNew = '<li class="changePage active pageNum mouseHand"><a>'+ i +'</a></li>';
			} else {
				noteNew = '<li class="changePage pageNum mouseHand"><a>' + i + '</a></li>';
			}
			liNote.before(noteNew);
		}
	};

	function pagerGo(api) {
		var curIdx = api.getCurrent();

		//获得页数
		caseListCookie.listnum = curIdx;
		var tempCoo = JSON.stringify(caseListCookie);
		$.cookie('caseList', tempCoo, {
			path: '/'
		});
		//通过caseListCookie 来进行参数的给予
		if(caseListCookie.reasonObj.res) {
			caseList(caseListCookie.reasonObj.res, curIdx, function(pkg) {
				ulNote.empty();
				$.each(pkg.data, function(idx, ele) {
					createLawList(caseListCookie.reasonObj.res, ele);
				});
			});
		} else {
			caseList(caseListCookie.reasonObj.des, curIdx, function(pkg) {
				ulNote.empty();
				$.each(pkg.data, function(idx, ele) {
					createLawList(caseListCookie.reasonObj.des, ele);
				});
			});
		}

	};

	function caseList(reason, page_num, callback) {
		var tempLocation = null;
		tempLocation = city;
		if(province == "北京" || province == "上海" || province == "天津" || province == "重庆") {
			tempLocation = province + "市";
		}
		var param = {
			'reason': reason,
			"page_count": 12,
			"page_num": page_num,
			//'province': province,
			//'city': city,
			'region': tempLocation
		};
		console.log(param);
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/query/case/case_list',
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				console.log(res);
				if(res.code == 0) {
					if(callback) {
						callback(res);
					}
				} else {
					errorModal("查询失败，建议选择较高级的案由进行搜索!");
					console.error('查询案件列表失败:', res);
				}
			},
			error: function() {
				errorModal('查询案件列表失败!');
				console.error('case_list：', arguments);
			}
		});
	};
})