/**
 * Created by sphwjj on 2018/3/11.
 */
/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {

    //判断当前显示teb页
    (function(){
        var pageActive = getUrlParam('page');
        if(pageActive){
            switch(pageActive){
                case 'case':$('#case-tab').tab('show');break;
                case 'agents':$('#agents-tab').tab('show');break;
                case 'agencies':$('#agencies-tab').tab('show');break;
            }

        }
    })();


    var lawyerBtn = $('#lawyer .searchBtn'),
        caseBtn = $('#case .searchBtn'),
        agentsBtn = $('#agents .searchBtn'),
        agenciesBtn = $('#agencies .searchBtn');

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
            $.cookie('all','',{ expires: -1 ,path:'/'});
            window.location.href = 'lawyerList.html';
        };
    });


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

            $.cookie('searchCase', template,{path:'/'}); //找律师存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
            console.log($.cookie('searchCase'));
            window.location.href = 'caseList.html';

        }
    });


    //查代理人
    agentsBtn.on('click',function () {
        var agents = $('#agents .name').val(),
            agencies = $('#agents .agency').val();
        var obj = JSON.stringify({
            per:agents,//代理人名称
            com:agencies//代理机构名称
        });
        $.cookie('agentsList','',{ expires: -1 ,path:'/'});
        if(agents){
            var _agents = encodeURIComponent(agents),_agencies = encodeURIComponent(agencies);
            window.location.href = 'agentsDetail.html?per=' + _agents + '&com=' + _agencies;
        }else if(!agents && agencies){
            $.cookie('agents',obj,{path:'/'});
            window.location.href = 'agentsList.html';
        }else{
            $('#agents .errorTip').html('　*请输入代理人名称或代理机构名称');
        }
    });

    //查代理机构
    agenciesBtn.on('click',function(){
        var zhuanLi = $('#agencies .propery').val(),
            cityNode = $('#agencies .title span'),
            city = '';
        if(cityNode[1]) {
            city = cityNode.eq(1).html();
        } else if(cityNode[0]) {
            city = cityNode.eq(0).html();
        };
        var obj = JSON.stringify({
            des:zhuanLi,
            city:city
        });
        if(zhuanLi){
            $.cookie('agencies',obj,{path:'/'});
            $.cookie('agenciesList','',{ expires: -1 ,path:'/'});
            window.location.href = 'agenciesList.html';
        }else{
            $('#agencies .errorTip').html('　*请输入专利描述');
        }

    });



    $('tab-pane .caseDescription,tab-pane .name,tab-pane .corporation,tab-pane .agency,tab-pane .property').focus(function() {
        $('span.errorTip').html('');
    });


    //保存cookie
    $.cookie('fromPage','propery',{path:'/'});

});