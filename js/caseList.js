/**
 * Created by sphwjj on 2018/3/10.
 */
$(function() {

	(function cookieMess() {
		var cookieMess = JSON.parse($.cookie('searchLawyer')),
			des = cookieMess.des,
			city = cookieMess.city;

		caseFoud(des, function(res) {
			caseList(res, 1, city);
		});
	})();

	function caseList(reason_2, page_num, region) {
		var param = {
			'reason': {
				'reason_2': reason_2
			},
			"page_count": 12,
			"page_num": page_num,
			"region": region
		};
		$.ajax({
			dataType: 'json',
			url: 'http://47.92.38.167:8889//static_query/case_list',
			type: 'post',
			data: JSON.stringify(param),
			success: function(res) {
				console.log(res);

			},
			error: function() {
				console.error('/static_query/lawyer_detail', arguments);
			}
		});
	};
})