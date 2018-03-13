/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	var listflag = true;
	var all = {
		listTotal: 0,
		listnum: 1,
		reasonObj: null,
		allCookie: null
	}
	var tempCookie = $.cookie('all');
	console.log(tempCookie)
	if(tempCookie) {
		all = JSON.parse(tempCookie);

	}

	function cookieMess(page_num) {
		var num = page_num;
		var cookie = $.cookie('searchLawyer');
		if(!cookie) {
			return;
		} else {
			if(all.allCookie && (all.allCookie != cookie)) {
				//判断新页面的信息和旧业面信息是否一致，一致则换分页的页数不一致则从新开始
				all.allCookie = cookie;
				num = 1;
			}
			var cookieM = JSON.parse(cookie),
				name = cookieM.name || '',
				des = cookieM.des || '',
				city = cookieM.city || '';
			all.reasonObj = cookieM;
			getPreMessage(name, des, city, num);
		}

	};

	function getPreMessage(name, des, city, page_num) {
		console.log(name);
		console.log(des);
		console.log(city);
		console.log(page_num);
		
		if(name) {
			caseFoud(des, function(res) {
				lawyerMatch(res, name, page_num);
			});
		} else {
			caseFoud(des, function(res) {
				//console.log(res);
				lawyerList(res, city, page_num);
			});
		}

	}
	
//	var i=0;
//	var timer = setInterval(function(){
//		if(i==5){
//			clearInterval(timer);
//		}
//		var obj = JSON.stringify({reason:{reason2:"与公司、证券、保险、票据等有关的民事纠纷",reason_3:"保险纠纷"}});
//		lawyerList(obj,'',i);
//		i++;
//		
//	},5000);

	
	

	function lawyerList(obj, city, page_num) {
		var temp = null;
		var param = JSON.stringify({
			'reason': JSON.parse(obj),
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
				console.log(res);
				if(res.code == 0) {
					//console.log(res);
					console.log(res.max_page_num);
					//获得总页数
					all.listTotal = res.max_page_num;
					var tempCoo = JSON.stringify(all);
					$.cookie('all', tempCoo);
					if(listflag) {
						creatPage(res.max_page_num, page_num);
						listflag = false;
					}
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

	function lawyerMatch(caseDes, name, page_num) {
		var param = {
			'page_count': 12,
			'reason': {
				'reason_2': '侵权责任纠纷' || ''
			},
			'lawyer_name': name,
			'page_num': page_num
		};
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/static_query/lawyer_match', //http://47.92.38.167:9091
			type: 'post',
			data: JSON.stringify(param),
			success: function(data) {

			},
			error: function() {
				console.error('/static_query/lawyer_list', arguments);
			}
		});

	};

	function createLawList(obj) {
		var ulNote = $(".center-block");
		ulNote.innerHTML = '';
		var lawyer_name = encodeURIComponent(obj.name);
		var lawyer_location = encodeURIComponent(obj.location);
		var noteNew = `<li class="lipad">
            <a href="lawyerDetail.html?lawyer_name=${lawyer_name}&lawyer_location=${lawyer_location}"  class="contant">
                <p class="name"><span class="pull-left">${obj.name}</span><i>${obj.gender}</i></p>
                <p class="location"><i class="glyphicon glyphicon-map-marker"></i>${obj.location}</p>
                <p class="info">
                    <span>代理案件：<i>${obj.num}</i> <i>起</i></span>
                    <span>学历：<i>${obj.degree}</i></span>
                </p>
            </a>
            <a class="details btn" href="lawyerDetail.html?lawyer_name=${obj.name}&lawyer_location=${obj.location}">查看详情</a>
        </li>`;
		ulNote = $(".center-block").append(noteNew);
	}

	function creatPage(num, page_num) {
		var liNote = $(".before");
		for(var i = 1; i <= num; i++) {
			var noteNew = `<li class="changePage">
					<a href="#">${i}</a>
				</li>`;
			if(i == page_num) {
				noteNew = `<li class="changePage active">
					<a href="#">${i}</a>
				</li>`;
			}
			liNote.before(noteNew);
		}
	}

	$(".pagination").on("click", ".changePage", function(event) {

		console.log(event.target.innerHTML);
		var page_num = event.target.innerHTML;

		//点击增加active 效果去除其他的active效果

		//获得页数
		all.listnum = page_num;
		var tempCoo = JSON.stringify(all);
		$.cookie('all', tempCoo);
		//获取对应页数的页面信息
		console.log(all);
		//通过all 来进行参数的给予
		getPreMessage(all.reasonObj.name, all.reasonObj.des, all.reasonObj.city, page_num)

	});
	cookieMess(1);
});