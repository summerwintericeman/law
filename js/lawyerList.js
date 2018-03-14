/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
	var listflag = true;
	var ulNote = $(".parentUl");
	var all = {
		listTotal: 0,//请求返回的最大页码
		listnum: -1,//当前查看页码
		reasonObj: null,
	}
	var tempCookie = $.cookie('all');
	if(tempCookie) {
		all = JSON.parse(tempCookie);
	}

	function cookieMess() {
		var num = all.listnum==-1?1:parseInt(all.listnum);
		var cookie = $.cookie('searchLawyer');
		if(!cookie) {
			return;
		} else {
			var cookieM = JSON.parse(cookie),
				name = cookieM.name || '',
				des = cookieM.des || '',
				city = cookieM.city || '';
			all.reasonObj = cookieM;
			getPreMessage(name, des, city, num);
		}

	};

	function getPreMessage(name, des, city, page_num) {
		if(name) {
			if(des){
				caseFoud(des, function(res) {
					all.reasonObj.res = res;
					lawyerMatch(res, name, page_num);
				});
			}else{
				all.reasonObj.res = '';
				lawyerMatch('', name, page_num);
			}
			
		} else {
			caseFoud(des, function(res) {
				all.reasonObj.res = res;
				lawyerList(res, city, page_num);
			});
		}

	}

	function lawyerList(obj, city, page_num) {
		var temp = null;
		var param = JSON.stringify({
			'reason': obj,
			'region': city,
			'page_count': 12,
			'page_num': page_num
		});
		console.log(param);
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/static_query/lawyer_list', // http://47.92.38.167:8888/  http://47.92.38.167:8889
			type: 'post',
			data: param,
			success: function(res) {
				if(res.code == 0) {
					//console.log(res);
					console.log(res.max_page_num);
					//获得总页数
					all.listTotal = res.max_page_num;
					all.listnum = page_num;
					var tempCoo = JSON.stringify(all);
					$.cookie('all', tempCoo,{path:'/'});
					if(listflag) {
						creatPage(res.max_page_num, page_num);
						listflag = false;
					}
					
					//清空数据重新加载新数据
					ulNote.empty();
					for(var i = 0; i < res.data.length; i++) {
						createLawList(res.data[i]);
					}
				}else{
					errorModal(res.msg);
				}

			},
			error: function() {
				errorModal('请求律师列表失败！');
				console.error('/static_query/lawyer_list', arguments);
			}
		});

	};

	function lawyerMatch(obj, name, page_num) {
		var param = {
			'page_count': 12,
			'reason': obj,
			'lawyer_name': name,
			'page_num': page_num
		};
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/static_query/lawyer_match', //http://47.92.38.167:9091
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				if(res.code == 0) {
					//console.log(res);
					console.log(res.max_page_num);
					//获得总页数
					all.listTotal = res.max_page_num;
					var tempCoo = JSON.stringify(all);
					$.cookie('all', tempCoo, {path: '/'});
					if(listflag) {
						creatPage(res.max_page_num, page_num);
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
				console.error('/static_query/lawyer_list', arguments);
			}
		});

	};

	function createLawList(obj) {
		var newObj = {
			__name:encodeURIComponent(obj.name) || '',
			__location:encodeURIComponent(obj.location) || '',
			name:obj.name || '',
			_location:obj.location || '',
			gender:obj.gender || '',
			num:obj.num || '',
			degree:obj.degree ||''
		}
		var noteNew = `<li class="lipad">
            <a href="lawyerDetail.html?lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}"  class="contant">
                <p class="name"><span class="pull-left">${newObj.name}</span><i>${newObj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${newObj._location}</p>
                <p class="info">
                    <span>代理案件：<i>${newObj.num}</i> <i>起</i></span>
                    <span>学历：<i>${newObj.degree}</i></span>
                </p>
            </a>
            <a class="details btn" href="lawyerDetail.html?lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}">查看详情</a>
        </li>`;
		ulNote.append(noteNew);
	}

	function creatPage(num, page_num) {
		var liNote = $(".before");
		num = num>5?5:num;
		for(var i = 1; i <= num; i++) {
			var noteNew;
			if(i == page_num) {
				noteNew = `<li class="changePage active pageNum">
					<a>${i}</a>
				</li>`;
			}else{
				noteNew = `<li class="changePage pageNum">
					<a>${i}</a>
				</li>`;
			}
			liNote.before(noteNew);
		}
	}

	$(".pagination").on("click", ".changePage", function(event) {
		debugger;
		var text = event.target.innerHTML,page_num,isPrev,isNext;
		var allCur = JSON.parse($.cookie('all'));
		//判断是否点击上一页、下一页
		if(text.indexOf('&gt;&gt;')>-1 ){
			page_num = parseInt(allCur.listnum) + 1;
			isNext = true;
			if(page_num>allCur.listTotal){
				errorModal('已经到最后一页啦~');
				return;
			}
				
		}else if(text.indexOf('&lt;&lt;')>-1 ){
			page_num = parseInt(allCur.listnum) - 1;
			isPrev = true;
			if(page_num<1){
				errorModal('当前页已经是第一页啦~');
				return;
			}
				
		}
		
		var index = $(this).index()-1;
		if(isNext){
			index = 4;
		}else if(isPrev){
			index = 0;
		}else{
			page_num = parseInt(text);
		}
		
		if(page_num == allCur.listnum){//页数相同，不用发起请求
			return
		}
		
		//点击增加active 效果去除其他的active效果
		var pageNode = $('.pagination .pageNum');
		pageNode.removeClass('active');
		if(page_num != 1 && page_num != all.listTotal){
			if(index>=3){//往下翻
				if(parseInt(pageNode.eq(4).find('a').html())>=allCur.listTotal){
						pageNode.eq(4).addClass('active');
						page_num = allCur.listTotal;
				}else{
					for(var i=0;i<5;i++){
					var val = parseInt(pageNode.eq(i).find('a').html());
					pageNode.eq(i).find('a').html(val+1);
					if(val+1 == page_num){
						pageNode.eq(i).addClass('active');
					}
				}
				}
				
			}else if(index<=1){//上翻
				if(parseInt(pageNode.eq(0).find('a').html())<=1){
						pageNode.eq(0).addClass('active');
						page_num = 1;
				}else{
					for(var i=0;i<5;i++){
					var val = parseInt(pageNode.eq(i).find('a').html());
					pageNode.eq(i).find('a').html(val-1);
					if(val-1 == page_num){
						pageNode.eq(i).addClass('active');
					}
				}
				}
				
				
			}else{
				pageNode.eq(2).addClass('active');
			}
			
		}else{
			pageNode.eq(index).addClass('active');
		}
			
		
		
		
		
		
			
		//获得页数
		all.listnum = page_num;
		var tempCoo = JSON.stringify(all);
		$.cookie('all', tempCoo,{path:'/'});
		//获取对应页数的页面信息
		//console.log(all);
		//通过all 来进行参数的给予
		if(all.reasonObj.name) {
			if(all.reasonObj.res){
				lawyerMatch(all.reasonObj.res, all.reasonObj.name, page_num);
			}else{
				lawyerMatch('', all.reasonObj.name, page_num);
			}
			
		} else {
			lawyerList(all.reasonObj.res, all.reasonObj.city, page_num);
		}
		
		
		

	});
	cookieMess();
});