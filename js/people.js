/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {
	var lawyerInput = $('#lawyer textarea'),
        caseInput = $('#case textarea');

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
		var lawyerInputVal = lawyerInput.val().replace(/\s+/g,'');
		if(lawyerInputVal.length<15){
            //效字符少于15
			$('#selectResModal').modal({
                backdrop:'static',
			});
			return;
		}
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
        var caseInputVal = caseInput.val().replace(/\s+/g,'');//全局替换空格
        if(caseInputVal.length<15){//效字符少于15
            $('#selectResModal').modal({
                backdrop:'static',
            });
            return;
        }
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


	//模态框显示    请求案由
    $('#selectResModal').on('show.bs.modal',function(e){
        console.log('在这里请求案由');
    });
//点击确定按钮关闭模态框
    $('#selectResModal .ok').on('click', function () {
        $('#selectResModal').modal('hide');
        console.log('模态框关闭');
    });






	//保存cookie
	$.cookie('fromPage','people',{path:'/'});


});