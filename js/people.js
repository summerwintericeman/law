/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {
	var lawyerInput = $('#lawyer textarea'),
        caseInput = $('#case textarea');
	var searchType = 'lawyer';

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
        var cityMsg = getCity();
        var caseDescription = $('#lawyer .caseDescription').val();


		if(!caseDescription && !name) {
			$('#lawyer .errorTip').html('*请输入案件描述');
		} else {
            var lawyerInputVal = lawyerInput.val().replace(/\s+/g,'');
            if(lawyerInputVal.length<15){
                //效字符少于15
                $('#selectResModal').modal({
                    backdrop:'static',
                });
                searchType = 'lawyer';
                return;
            }

            var template = JSON.stringify({
                des: caseDescription,
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
            });

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

        var cityMsg = getCity();
        var caseDescription = $('#case .caseDescription').val();

		if(!caseDescription) {
			$('#case .errorTip').html('　*请输入案件描述');
		} else {
            var caseInputVal = caseInput.val().replace(/\s+/g,'');//全局替换空格
            if(caseInputVal.length<15){//效字符少于15
                $('#selectResModal').modal({
                    backdrop:'static',
                });
                searchType = 'case';
                return;
            }

			var template = JSON.stringify({
				des: caseDescription,
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
			});

			$.cookie('searchCase', template,{path:'/'}); //找律师存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
			window.location.href = 'caseList.html';

		}
	});

	$('#case .caseDescription,#case .name,#case .corporation').focus(function() {
		$('#case .errorTip').html('');
	});

	//获取城市字段
	function getCity(){
        var cityNode = $('#cityPicker .title span'),
			obj = {
                province:'',
                city:'',
                region:''
			};
        if(cityNode[0]) {
            obj.province = cityNode.eq(0).html();
        };
        if(cityNode[1]) {
            obj.city = cityNode.eq(1).html();
        };
        if(cityNode[2]){
            obj.region = cityNode.eq(2).html();
        };

        return obj;
	};

	//模态框显示    请求案由
    $('#selectResModal').on('shown.bs.modal',function(e){
        var resNode = $('#selectResModal #Label>i');
    	var liNode = $('#selectResModal ul>li');
    	liNode.on('click',function(){
    		var selectHtml = $(this).html();
            resNode.html(selectHtml);
		});
        console.log('在这里请求案由');
    });
//点击确定按钮关闭模态框
    $('#selectResModal .ok').on('click', function () {
        var resVal = $('#selectResModal #Label>i').html();
        if(resVal == '请选择案由'){
			$('#selectResModal span.errorTip').show();
        	return;
		}
        $('#selectResModal').modal('hide');
        var cityMsg = getCity();
        if(searchType == 'lawyer'){
        	//找律师
            var caseDescription = $('#lawyer .caseDescription').val();
            var template = JSON.stringify({
                des: caseDescription,
				res:JSON.parse(resVal),
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
            });

            $.cookie('searchLawyer', template,{path:'/'}); //找律师存储cookie
            $.cookie('all','',{ expires: -1 ,path:'/'});
            window.location.href = 'lawyerList.html';

        }else{
        	//查案件
            var caseDescription = $('#case .caseDescription').val();
            var template = JSON.stringify({
                des: caseDescription,
                res:JSON.parse(resVal),
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
            });

            $.cookie('searchCase', template,{path:'/'}); //找律师存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
            window.location.href = 'caseList.html';
		}
    });


	//保存cookie
	$.cookie('fromPage','people',{path:'/'});


});