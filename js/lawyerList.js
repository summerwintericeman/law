/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	(function cookieMess() {
		var cookie = $.cookie('searchLawyer');
		if(!cookie){
			return;
		}
			var cookieMess = JSON.parse(cookie),
				name = cookieMess.name || '',
				des = cookieMess.des || '',
				city = cookieMess.city || '';
			if(name) {
				caseFoud(des, function(res) {
					lawyerMatch(res, name, 1);
				});
			} else {
				caseFoud(des, function(res) {
					lawyerList(res, city, 1);
				});
			}
	})();



function lawyerList(obj, city, page_num) {
	var param = JSON.stringify({
		'reason': JSON.parse(obj),
		'region': city,
		'page_count': 12,
		'page_num': page_num
	});

	$.ajax({
		dataType: 'json',
		url: 'http://47.92.38.167:8889/static_query/lawyer_list', // http://47.92.38.167:8888/  http://47.92.38.167:8889
		type: 'post',
		data: param,
		success: function(res) {
			console.log(res)
		},
		error: function() {
			console.error('/static_query/lawyer_list', arguments);
		}
	});
};

});

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
			debugger;
			console.log(data);
		},
		error: function() {
			console.error('/static_query/lawyer_list', arguments);
		}
	});

};