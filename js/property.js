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
                case 'patent':$('#patent-tab').tab('show');break;
            }

        }
    })();


    var lawyerBtn = $('#lawyer .searchBtn'),
        caseBtn = $('#case .searchBtn'),
        agentsBtn = $('#agents .searchBtn'),
       patentBtn = $('#patent .searchBtn');

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
            window.location.href = 'lawyerList.html?fromPage=property';
        };
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
            window.location.href = 'caseList.html?fromPage=property';

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
        if(agents || agencies){
            $.cookie('agents',obj,{path:'/'});
            window.location.href = 'agentsList.html';
        }else{
            $('#agents .errorTip').html('　*请输入代理人名称或代理机构名称');
        }
    });


    //查专利
    var newWinUrl = '';//新窗口url
   patentBtn.on('click',function(){
        var patentNum = $('#patent textarea').val();

        //cpquery/doc_url
        if(patentNum){
            //验证专利号是否正确
            var reg1 = /^(CN)*[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{4}\.[0-9]$/,
                reg2 = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{4}[0-9]$/;
            if(!(reg1.test(patentNum) || reg2.test(patentNum))){
                //验证错误
                errorModal('专利号输入有误，请重新填写！');
                return;
            }

            var obj = JSON.stringify({
                patent_no:patentNum
            });
            $.ajax({
                dataType: 'json',
                url: 'http://47.97.197.176:8888/cpquery/doc_url',
                type: 'post',
                asasync: false,
                data: obj,
                success: function(res) {
                    console.log(res);
                    if(res.code==0){
 						window.open(res.data);
                    }else{
                        errorModal(res.msg);
                        console.error('查询专利失败:',res);
                    }
                },
                error: function() {
                    errorModal('查询专利失败!');
                    console.error('agent_company：', arguments);
                }
            });


        }else{
            $('#agencies .errorTip').html('　*请输入专利描述');
        }



    });

    function newWin(url, id) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.setAttribute('id', id);
        // 防止反复添加
        if(!document.getElementById(id)) {
            document.body.appendChild(a);
        }
        a.click();
    }



    $('tab-pane .caseDescription,tab-pane .name,tab-pane .corporation,tab-pane .agency,tab-pane .property').focus(function() {
        $('span.errorTip').html('');
    });

});