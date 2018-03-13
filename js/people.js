/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {


	//判断当前显示找律师 还是显示查案件
	(function() {
		var pageActive = getUrlParam('page');
		if(pageActive && pageActive == 'case') {
			$('#profile-tab').tab('show');
		}
	})();

	var lawyerBtn = $('#lawyer .searchBtn'),
		caseBtn = $('#case .searchBtn');

	//找律师
	lawyerBtn.on('click', function() {
		var caseDescription = $('#lawyer .caseDescription').val(),
			name = $('#lawyer .name').val(),
			cityNode = $('#cityPicker .title span'),
			city = '';
		if(cityNode[1]) {
			city = cityNode.eq(1).html();
		} else if(cityNode[0]) {
			city = cityNode.eq(0).html();
		};
		var template = JSON.stringify({
			des: caseDescription,
			name: name,
			city: city
		});
		if(!caseDescription && !name) {
			$('#lawyer .errorTip').html('*请输入案件描述或律师名称');
		} else { 
			$.cookie('searchLawyer', template,{path:'/'}); //找律师存储cookie
			console.log($.cookie('searchLawyer'));
			window.location.href = 'lawyerList.html';	
		};
	});

	$('#lawyer .caseDescription,#lawyer .name').focus(function() {
		$('#lawyer .errorTip').html('');
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
				//window.location.href = 'lawyerList.html';
			},
			error: function() {
				console.error('/static_query/lawyer_list', arguments);
			}
		});

	};

	//查案件
	caseBtn.on('click', function() {
		var caseDescription = $('#case .caseDescription').val(),
			cityNode = $('#cityPicker .title span'),
			city = '';
		if(cityNode[1]) {
			city = cityNode[1].html();
		} else if(cityNode[0]) {
			city = cityNode[0].html();
		};

		if(!caseDescription) {
			$('#case .errorTip').html('　*请输入案件描述');
		} else {

			var template = JSON.stringify({
				des: caseDescription,
				city: city
			});

			$.cookie('searchCase', template); //找律师存储cookie
			console.log($.cookie('searchCase'));
			window.location.href = 'caseList.html';

			//			caseFoud(caseDescription, function(res){
			//				caseList(res, 1, city);
			//			});
		}
	});

	$('#case .caseDescription,#case .name,#case .corporation').focus(function() {
		$('#case .errorTip').html('');
	});

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

	//保存cookie
	$.cookie('fromPage','people',{path:'/'});


});