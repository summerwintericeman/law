/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
	var fromPage = getUrlParam('fromPage');
	var listflag = true;
	var ulNote = $(".parentUl");
	var all = {
		listTotal: 0,//请求返回的最大页码
		listnum: -1,//当前查看页码
        firstPageNum:1,//翻页的第一个页码
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
                province = cookieM.province || '',
                city = cookieM.city || '',
                region = cookieM.region || '';
			all.reasonObj = cookieM;
			getPreMessage(name, des, province,city,region, num);
		}

	};

	function getPreMessage(name, des, province,city,region, page_num) {
		if(name) {
			if(des){
				caseFoud(des, function(res) {
					all.reasonObj.res = res;
                    //lawyerList(res, city, page_num);
					lawyerMatch(res, name, page_num);
				});
			}else{
				all.reasonObj.res = '';
				lawyerMatch('', name, page_num);
			}
			
		} else {
			caseFoud(des, function(res) {
				all.reasonObj.res = res;
				lawyerList(res, province,city,region, page_num);
			});
		}

	}

	function lawyerList(obj, province,city,region, page_num,callback) {
		var temp = null;
		var param = JSON.stringify({
			'reason': obj,
            'province':province,
            'city': city,
            'region':region,
			'page_count': 12,
			'page_num': page_num
		});
		console.log(param);
		$.ajax({
			dataType: 'json',
			url: 'http://47.97.197.176:8888/query/lawyer/lawyer_list', // http://47.92.38.167:8888/  http://47.97.197.176:8888
			type: 'post',
			data: param,
			success: function(res) {
				if(res.code == 0) {
					if(callback){
						callback(res);
						return;
					}
					console.log(res.max_page_num);
					//获得总页数
					all.listTotal = res.max_page_num;
					all.listnum = page_num;
					var tempCoo = JSON.stringify(all);
					$.cookie('all', tempCoo,{path:'/'});
					if(listflag) {
						creatPage(res.max_page_num, page_num);
                        //刷新时重置页码
                        var node = $('.pagination .pageNum');
                        var firstPage = all.firstPageNum;
                        for(var i=0;i<5;i++){
                            node.eq(i).find('a').html(firstPage+i);
                            if(firstPage+i==all.listnum){
                                node.eq(i).addClass('active');
                            }
                        }

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
				console.error('/query/lawyer/lawyer_list', arguments);
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
			url: 'http://47.97.197.176:8888/query/lawyer/lawyer_match', //http://47.92.38.167:9091
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
						//刷新时重置页码
                        var node = $('.pagination .pageNum');
                        var firstPage = all.firstPageNum;
                        for(var i=0;i<5;i++){
                            node.eq(i).find('a').html(firstPage+i);
                            if(firstPage+i==all.listnum){
                                node.eq(i).addClass('active');
                            }
                        }
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
				console.error('/static_query/lawyer_match', arguments);
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
		};
		var noteNew = `<li class="lipad mouseHand">
            <a href="lawyerDetail.html?lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}"  class="contant">
                <p class="name"><span class="pull-left">${newObj.name}</span><i>${newObj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${newObj._location}</p>
                <p class="info">
                    <span>代理案件：<i>${newObj.num}</i> <i>起</i></span>
                </p>
            </a>
            <a class="details btn" href="lawyerDetail.html?lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}">查看详情</a>
        </li>`;
		if(fromPage && fromPage=='property'){
            noteNew = `<li class="lipad mouseHand">
            <a href="lawyerDetail.html?fromPage=property&lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}"  class="contant">
                <p class="name"><span class="pull-left">${newObj.name}</span><i>${newObj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${newObj._location}</p>
                <p class="info">
                    <span>代理案件：<i>${newObj.num}</i> <i>起</i></span>
                </p>
            </a>
            <a class="details btn" href="lawyerDetail.html?fromPage=property&lawyer_name=${newObj.__name}&lawyer_location=${newObj.__location}">查看详情</a>
        </li>`;
		}
		ulNote.append(noteNew);
	}

	function creatPage(num, page_num) {
		var liNote = $(".before");
		num = num>5?5:num;
		for(var i = 1; i <= num; i++) {
			var noteNew;
			if(i == page_num) {
				noteNew = `<li class="changePage active pageNum mouseHand">
					<a>${i}</a>
				</li>`;
			}else{
				noteNew = `<li class="changePage pageNum mouseHand">
					<a>${i}</a>
				</li>`;
			}
			liNote.before(noteNew);
		}
	}

	$(".pagination").on("click", ".changePage", function(event) {
		if(event.currentTarget.className.indexOf('disabled')>-1){
			return;
		}

		var text = event.target.innerHTML,page_num,index,PreActive;//index点击li的下标(0开始)、PreActive点击的时候active的li的下标
        var pageNode = $('.pagination .pageNum');
		var allCur = JSON.parse($.cookie('all'));
        for(var i = 0;i < 5; i++){
            if(pageNode.eq(i).hasClass('active')){
                PreActive = i;
            }
        }

		//判断是否点击上一页、下一页
		if(text.indexOf('&gt;&gt;')>-1 ){
			page_num = parseInt(allCur.listnum) + 1;
			if(PreActive==4){
                for(var i=0; i<5;i++){
                    var val1 = parseInt(pageNode.eq(i).find('a').html()) + 1 ;
                    pageNode.eq(i).find('a').html(val1);
                }
                pageNode.removeClass('active');
                pageNode.eq(4).addClass('active');
			}else{
                pageNode.removeClass('active');
                pageNode.eq(PreActive + 1).addClass('active');
			}

		}else if(text.indexOf('&lt;&lt;')>-1 ){
			page_num = parseInt(allCur.listnum) - 1;
            if(PreActive==0){
                for(var i=0; i<5;i++){
                    var val1 = parseInt(pageNode.eq(i).find('a').html()) - 1 ;
                    pageNode.eq(i).find('a').html(val1);
                }
                pageNode.removeClass('active');
                pageNode.eq(0).addClass('active');
            }else{
                pageNode.removeClass('active');
                pageNode.eq(PreActive - 1).addClass('active');
            }

		}else{
            index = $(this).index()-1;
            page_num = parseInt(text);
            if(page_num == allCur.listnum){//页数相同，不用发起请求
                return
            }
            pageNode.removeClass('active');
            if(index==4){
                if(page_num == allCur.listTotal){
                    pageNode.eq(4).addClass('active');
				}else{
                    for(var i=0; i<5;i++){
                    	var val1 = parseInt(pageNode.eq(i).find('a').html()) + 1 ;
                        pageNode.eq(i).find('a').html(val1);
                    }
                    pageNode.eq(3).addClass('active');
				}
            }else if(index==0){
				if(page_num==1){
                    pageNode.eq(0).addClass('active');
				}else{
                    for(var i=0; i<5;i++){
                        var val2 = parseInt(pageNode.eq(i).find('a').html()) - 1 ;
                        pageNode.eq(i).find('a').html(val2);
                    }
                    pageNode.eq(1).addClass('active');
				}
            }else{
                pageNode.eq(index).addClass('active');
			}
		}

		var newPageNode = $('.pagination .pageNum');
        if(newPageNode.eq(4).find('a').html() == allCur.listTotal){
            newPageNode.eq(4).next('li').addClass('disabled');
		}else{
            newPageNode.eq(4).next('li').removeClass('disabled');
		}
        if(newPageNode.eq(0).find('a').html() == '1'){
            newPageNode.eq(0).prev('li').addClass('disabled');
        }else{
            newPageNode.eq(0).prev('li').removeClass('disabled');
		}


		//获得页数
		all.listnum = page_num;
        all.firstPageNum = newPageNode.eq(0).find('a').html();
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
			lawyerList(all.reasonObj.res, all.reasonObj.province ,all.reasonObj.city , all.reasonObj.region , page_num);
		}


	});
	cookieMess();
});