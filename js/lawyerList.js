/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {
	$.cookie('searchLawyer1'); 
	console.log($.cookie('searchLawyer'));
//			if(caseDescription) { //有案件描述
//				if(name) {
//					caseFoud(caseDescription, function(res) {
//						lawyerMatch(res, name, 1);
//					});
//				} else {
//					caseFoud(caseDescription, function(res) {
//						lawyerList(res, city, 1);
//					});
//				}
//			} else { //无案件描述
//				if(name) {
//					lawyerMatch('', name, 1);
//				} else {
//					$('#lawyer .errorTip').html('*请输入案件描述或律师名称');
//				}
//			};

	function caseFoud(caseDes, callback) {
		console.log(caseDes);
		var Data = JSON.stringify({
			"text": caseDes
		});
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889/feature_query/case_type', // http://47.92.38.167:8888/  http://47.92.38.167:8889
			type: 'post',
			data: Data,
			success: function(res) {
				console.log(res);
				if(res.code == 0 && res.data) { //表示请求成功
					var reason = res.data[0].reason,
						num = "reason_" + res.data[0].sub_reason_class;
					var obj = {
						"reason2": res.data[0].second_reason
					}
					obj[num] = reason;

					if(callback) {
						callback(JSON.stringify(obj));
					}
				} else {
					alert("查询失败，错误代码：code=" + res.code + res.msg);
				}
			},
			error: function() {
				console.error('/static_query/lawyer_list', arguments);
			}
		});
	}

	function lawyerList(obj, city, page_num) {
		console.log(obj)
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

			},
			error: function() {
				console.error('/static_query/lawyer_list', arguments);
			}
		});
	};

});