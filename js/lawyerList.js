/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	
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
				if(res.code == 0) {
					console.log(res);
					console.log(res.max_page_num);
					//creatPageList(res.max_page_num, page_num, 12)
					creatPage(res.max_page_num, page_num);
					for(var i = 0; i < res.data.length; i++ ) {
						createLawList(res.data[i]);
					}
				}

			},
			error: function() {
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
				console.log(data);
			},
			error: function() {
				console.error('/static_query/lawyer_list', arguments);
			}
		});

	};

	function createLawList(obj) {
		var ulNote = $(".center-block");
		ulNote.innerHTML = '';
		var noteNew = `<li class="lipad">
            <a href="lawyerDetail.html?lawyer_name=${obj.name}&lawyer_location=${obj.location}"  class="contant">
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
	
	
//	function creatPageList(max_page_num, page_num, page_count){
//		 $('#callBackPager').extendPagination({
//
//          totalCount: max_page_num*page_count,
//
//          showCount: page_num,
//
//          limit: page_count,
//
//          callback: function (cur, page_num) {
//          	console.log(cur)
//
////              creatPage(max_page_num, page_num);
//
//          }
//
//      });
//	}
	
	
	
	
	
	
	function creatPage(num, page_num){
		var liNote = $(".before");
		for(var i = 1; i <= num; i++ ){
			var noteNew = `<li class="changePage">
					<a href="#">${i}</a>
				</li>`;
				if(i == page_num){
					noteNew = `<li class="changePage active">
					<a href="#">${i}</a>
				</li>`;
				}
			liNote.before(noteNew);
		}
		
	}
	
	
    
	function getPreMessage(name, des, city, page_num){
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
				console.log(res);
				lawyerList(res, city, page_num);
			});
		}
		
	}
	
	function cookieMess(page_num) {
		var num = page_num || 1;
		var cookie = $.cookie('searchLawyer');
		if(!cookie) {
			return;
		}
		var cookieM = JSON.parse(cookie),
			name = cookieM.name || '',
			des = cookieM.des || '',
			city = cookieM.city || '';
			getPreMessage(name, des, city, num);
			return cookieM;
		
	};
	
	$(".pagination").on("click",".changePage",function(event){
			
			console.log(event.target.innerHTML);
			var page_num = event.target.innerHTML;
			var temp = cookieMess(page_num);
			getPreMessage(temp.name, temp.des, temp.city, page_num);
            
    });
    cookieMess();
});