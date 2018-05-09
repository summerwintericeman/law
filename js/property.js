/**
 * Created by sphwjj on 2018/3/11.
 */
/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function() {
    var lawyerInput = $('#lawyer textarea'),
        caseInput = $('#case textarea'),
        agentsPerInput = $('#agents .agentsTop input'),
        agentsComInput = $('#agents .agentsBottom input'),
        patentInput = $('#patent textarea');
    var searchType = 'lawyer';

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
        agentsPerBtn = $('#agents .agentsTop .searchBtn'),
        agentsComBtn = $('#agents .agentsBottom .searchBtn'),
       patentBtn = $('#patent .searchBtn');

    //找律师
    lawyerBtn.on('click',lawyerGo);
    //回车搜索
    lawyerInput.keyup(function(e){
        var keyCode = e.which;
        if(keyCode == 13){
            lawyerGo();
        }
    });

    //查案件
    caseBtn.on('click', caseGo);
    //回车搜索
    caseInput.keyup(function(e){
        var keyCode = e.which;
        if(keyCode == 13){
            caseGo();
        }
    });

    //查代理人
    //通过代理人名称查找
    agentsPerBtn.on('click',agentsPerGo);
    //回车搜索
    agentsPerInput.keyup(function(e){
        var keyCode = e.which;
        if(keyCode == 13){
            agentsPerGo();
        }
    });
    $('#agents .agentsTop input').focus(function(){
        $('#agents .agentsTop .errorTip').html('');
    });
    //通过代理机构名称查找
    agentsComBtn.on('click',agentsComGo);
    //回车搜索
    agentsComInput.keyup(function(e){
        var keyCode = e.which;
        if(keyCode == 13){
            agentsComGo();
        }
    });
    $('#agents .agentsBottom input').focus(function(){
        $('#agents .agentsBottom .errorTip').html('');
    });


    //查专利
    var newWinUrl = '';//新窗口url
   patentBtn.on('click',patentGo);
    //回车搜索
    patentInput.keyup(function(e){
        var keyCode = e.which;
        if(keyCode == 13){
            patentGo();
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
    };

    //获取城市字段
    function getCity(cityNode){
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

    //找律师
    function lawyerGo(){
        var caseDescription = $('#lawyer .caseDescription').val().trim();
        if(!caseDescription) {
            $('#lawyer .errorTip').html('*请输入案件描述');
        } else {
            // var lawyerInputVal = lawyerInput.val().replace(/\s+/g,'');
            // if(lawyerInputVal.length<15){
            //     //效字符少于15
            //     $('#selectResModal').modal({
            //         backdrop:'static',
            //     });
            //     searchType = 'lawyer';
            //     return;
            // }
            var cityNode = $('#cityPicker .title span');
            var cityMsg = getCity(cityNode);
            var template = JSON.stringify({
                des: caseDescription,
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
            });

            $.cookie('searchLawyer', template,{path:'/'}); //找律师存储cookie
            $.cookie('all','',{ expires: -1 ,path:'/'});
            window.location.href = 'lawyerList.html?fromPage=property';
        };
    };

    //查案件
    function caseGo(){
        // var caseInputVal = caseInput.val().replace(/\s+/g,'');
        // if(caseInputVal.length<15){
        //     //效字符少于15
        //     $('#selectResModal').modal({
        //         backdrop:'static',
        //     });
        //     return;
        // }
        var caseDescription = $('#case .caseDescription').val().trim(),
            cityNode = $('#cityPicker .title span'),
            province = '',city = '',region = '';
        if(!caseDescription) {
            $('#case .errorTip').html('　*请输入案件描述');
        } else {
            // var caseInputVal = caseInput.val().replace(/\s+/g,'');
            // if(caseInputVal.length<15){
            //     //效字符少于15
            //     $('#selectResModal').modal({
            //         backdrop:'static',
            //     });
            //     searchType = 'case';
            //     return;
            // }
            var cityNode = $('#cityPicker1 .title span');
            var cityMsg = getCity(cityNode);

            var template = JSON.stringify({
                des: caseDescription,
                province:cityMsg.province,
                city: cityMsg.city,
                region:cityMsg.region
            });

            $.cookie('searchCase', template,{path:'/'}); //找案件存储cookie
            $.cookie('caseList','',{ expires: -1 ,path:'/'});
            window.location.href = 'caseList.html?fromPage=property';

        }
    };

    //查代理人
    // 通过代理人名称查找
    function agentsPerGo(){
        var agents = $('#agents .name').val().trim();
        var obj = JSON.stringify({
            per:agents,//代理人名称
            com:''//代理机构名称
        });
        $.cookie('agentsList','',{ expires: -1 ,path:'/'});
        if(agents){
            $.cookie('agents',obj,{path:'/'});
            window.location.href = 'agentsList.html';
        }else{
            $('#agents .agentsTop .errorTip').html('　*请输入代理人名称');
        }
    };
    //通过代理机构查找代理人
    function agentsComGo(){
        var  agencies = $('#agents .agency').val().trim();
        var obj = JSON.stringify({
            per:'',//代理人名称
            com:agencies//代理机构名称
        });
        $.cookie('agentsList','',{ expires: -1 ,path:'/'});
        if(agencies){
            $.cookie('agents',obj,{path:'/'});
            window.location.href = 'agentsList.html';
        }else{
            $('#agents .agentsBottom .errorTip').html('　*请输入代理人代理机构名称');
        }
    };

    //查专利
    function patentGo(){
        var patentNum = $('#patent textarea').val().trim();

        //cpquery/doc_url
        if(patentNum){
            //验证专利号是否正确
            var reg1 = /^(CN){0,1}\d{12}\.[0-9]$/,
                reg2 = /^\d{13}$/;
            if(!(reg1.test(patentNum) || reg2.test(patentNum))){
                //验证错误
                errorModal('专利号输入有误，请重新填写！');
                return;
            }

            var obj = JSON.stringify({
                patent_no:patentNum
            });
            console.log(obj);
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
            $('#patent .errorTip').html('　*请输入专利描述');
        }
    };





    $('#lawyer .caseDescription,#case .caseDescription,#agents input,#patent textarea').focus(function() {
        $('span.errorTip').html('');
    });




});