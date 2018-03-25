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
            province = '',city = '',region = '';
        if(cityNode[0]) {
            province = cityNode.eq(0).html();
        };
        if(cityNode[1]) {
            city = cityNode.eq(1).html();
        };
        if(cityNode[2]){
            region = cityNode.eq(2).html();
        };
		var template = JSON.stringify({
			des: caseDescription,
			name: name,
            province:province,
            city: city,
            region:region
		});
		if(!caseDescription && !name) {
			$('#lawyer .errorTip').html('*请输入案件描述或律师名称');
		} else { 
			$.cookie('searchLawyer', template,{path:'/'}); //找律师存储cookie
			 $.cookie('all','',{ expires: -1 ,path:'/'});
			window.location.href = 'lawyerList.html';	
		};
	});

	$('#lawyer .caseDescription,#lawyer .name').focus(function() {
		$('#lawyer .errorTip').html('');
	});

	

	

	

	//查案件
	caseBtn.on('click', function() {
		var caseDescription = $('#case .caseDescription').val(),
			cityNode = $('#cityPicker .title span'),
            province = '',city = '',region = '';
        if(cityNode[0]) {
            province = cityNode.eq(0).html();
        };
        if(cityNode[1]) {
            city = cityNode.eq(1).html();
        };
        if(cityNode[2]){
            region = cityNode.eq(2).html();
        };

		if(!caseDescription) {
			$('#case .errorTip').html('　*请输入案件描述');
		} else {

			var template = JSON.stringify({
				des: caseDescription,
                province:province,
                city: city,
                region:region
			});

			$.cookie('searchCase', template,{path:'/'}); //找律师存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
			console.log($.cookie('searchCase'));
			window.location.href = 'caseList.html';

		}
	});

	$('#case .caseDescription,#case .name,#case .corporation').focus(function() {
		$('#case .errorTip').html('');
	});

	

	//保存cookie
	$.cookie('fromPage','people',{path:'/'});


});