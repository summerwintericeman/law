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

        var obj = JSON.stringify({
            des:caseDescription,
            name:name,
            city:city
        });
        if(!caseDescription && !name) {
            $('#lawyer .errorTip').html('*请输入案件描述或律师名称');
        } else {
            $.cookie('searchLawyer',obj,{path:'/'});
            window.location.href = 'lawyerList.html';
        };

    });

    // function caseFoud(caseDes, callback) {
    //     console.log(caseDes);
    //     var Data = JSON.stringify({
    //         "text": caseDes
    //     });
    //     $.ajax({
    //         dataType: 'json',
    //         url: 'http://47.92.38.167:8889/feature_query/case_type', // http://47.92.38.167:8888/  http://47.92.38.167:8889
    //         type: 'post',
    //         data: Data,
    //         success: function(res) {
    //             console.log(res);
    //             if(res.code == 0 && res.data) { //表示请求成功
    //                 var reason2 = res.data[0].second_reason; //获得案由以后进行匹配的数据请求
    //                 if(callback) {
    //                     callback(reason2);
    //                 }
    //             } else {
    //                 alert("查询失败，错误代码：code=" + res.code + res.msg);
    //             }
    //         },
    //         error: function() {
    //             console.error('/static_query/lawyer_list', arguments);
    //         }
    //     });
    // }
    //
    // function lawyerList(reason2, city, page_num) {
    //     //案由+city(*)
    //     console.log(reason2)
    //     var param = JSON.stringify({
    //         'reason': {
    //             'reason_2': reason2,
    //             'reason_3': "",
    //         },
    //         'region': city,
    //         'page_count': 12,
    //         'page_num': page_num
    //     });
    //
    //     $.ajax({
    //         dataType: 'json',
    //         url: 'http://47.92.38.167:8889/static_query/lawyer_list', // http://47.92.38.167:8888/  http://47.92.38.167:8889
    //         type: 'post',
    //         data: param,
    //         success: function(res) {
    //             console.log(res);
    //             //window.location.href = 'lawyerList.html';
    //         },
    //         error: function() {
    //             console.error('/static_query/lawyer_list', arguments);
    //         }
    //     });
    // };
    //
    // function lawyerMatch(caseDes, name, page_num) {
    //     var param = {
    //         'page_count': 12,
    //         'reason': {
    //             'reason_2': '侵权责任纠纷' || ''
    //         },
    //         'lawyer_name': name,
    //         'page_num': page_num
    //     };
    //     $.ajax({
    //         dataType: 'json',
    //         url: 'http://47.92.38.167:8889/static_query/lawyer_match', //http://47.92.38.167:9091
    //         type: 'post',
    //         data: JSON.stringify(param),
    //         success: function(data) {
    //             debugger;
    //             console.log(data);
    //             //window.location.href = 'lawyerList.html';
    //         },
    //         error: function() {
    //             console.error('/static_query/lawyer_list', arguments);
    //         }
    //     });
    //
    // };

    //查案件
    caseBtn.on('click', function() {
        var caseDescription = $('#case .caseDescription').val(),
            cityNode = $('#cityPicker .title span'),
            city = '';
        if(cityNode[1]) {
            city = cityNode.eq(1).html();
        } else if(cityNode[0]) {
            city = cityNode.eq(0).html();
        };
        var obj = JSON.stringify({
            des:caseDescription,
            city:city
        });
        if(!caseDescription) {
            $('#case .errorTip').html('　*请输入案件描述');
        } else {
            // caseFoud(caseDescription, function(res){
            //     caseList(res, 1, city);
            // });
            $.cookie('searchCase', obj,{path:'/'});//查案件
            window.location.href = 'caseList.html';
        }
    });

    //查代理人
    agentsBtn.on('click',function () {
        var agents = $('#agents .name').val(),
            agencies = $('#agents .agency').val();
        if(agents || agencies){
            var obj = JSON.stringify({
                per:agents,//代理人名称
                com:agencies//代理机构名称
            });
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
            window.location.href = 'agenciesList.html';
        }else{
            $('#agencies .errorTip').html('　*请输入专利描述');
        }

    });



    $('tab-pane .caseDescription,tab-pane .name,tab-pane .corporation,tab-pane .agency,tab-pane .property').focus(function() {
        $('span.errorTip').html('');
    });

    // function caseList(reason_2, page_num, region) {
    //     var param = {
    //         'reason': {
    //             'reason_2': reason_2
    //         },
    //         "page_count": 12,
    //         "page_num": page_num,
    //         "region": region
    //     };
    //     $.ajax({
    //         dataType: 'json',
    //         url: 'http://47.92.38.167:8889//static_query/case_list',
    //         type: 'post',
    //         data: JSON.stringify(param),
    //         success: function(res) {
    //             console.log(res);
    //             // window.location.href = 'caseList.html';
    //         },
    //         error: function() {
    //             console.error('/static_query/lawyer_detail', arguments);
    //         }
    //     });
    // };

    //保存cookie
    $.cookie('fromPage','propery',{path:'/'});

});