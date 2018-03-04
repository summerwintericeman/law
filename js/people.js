/**
 * Created by sphwjj on 2018/2/28.
 */
$(document).ready(function(){
    var lawyerBtn = $('#lawyer .searchBtn'),caseBtn = $('#case .searchBtn');

//找律师
    lawyerBtn.on('click',function(){
        var caseDescription = $('#lawyer .caseDescription').val(),name = $('#lawyer .name').val(),cityNode = $('#cityPicker .title span'),city = '';
        if(cityNode[1]){
            city = cityNode[1].html();
        }else if(cityNode[0]){
            city = cityNode[0].html();
        };

        if(caseDescription){
            //有案由
            if(name){
                lawyerMatch(caseDescription,name,1);
            }else{
            	
            	
                lawyerList(caseDescription,city,1);
            }

        }else{
            //无案由
            if(name){
                lawyerMatch('',name,1);
            }else{
                $('#lawyer .errorTip').html('*请输入案件描述或律师名称');
            }
        };
    });

    $('#lawyer .caseDescription,#lawyer .name').focus(function(){
        $('#lawyer .errorTip').html('');
    });







    function lawyerList(caseDes,city,page_num){
        //案由+city(*)
        var param = {
            'page_count':12,
            'reason':{
                'reason_2':caseDes,
                'reason_4':''
            },
            'page_num':page_num,
            'region':city
        };
        $.ajax({
            dataType:'json',
            url: 'http://47.92.38.167:8889/static_query/lawyer_list',// http://47.92.38.167:8888/  http://47.92.38.167:8889
            type: 'post',
            data:JSON.stringify(param),
            success: function (data) {
                debugger;
                console.log(data);
                window.location.href = 'lawyerList.html';
            },
            error:function(){
                console.error('/static_query/lawyer_list',arguments);
            }
        });

    };

    function lawyerMatch(caseDes,name,page_num){
        //案由(*)+name
        var param = {
            'page_count':12,
            'reason':{
                'reason_2':'侵权责任纠纷'||''
            },
            'lawyer_name':name,
            'page_num':page_num
        };
        $.ajax({
            dataType:'json',
            url: 'http://47.92.38.167:8889/static_query/lawyer_match',//http://47.92.38.167:9091
            type: 'post',
            data:JSON.stringify(param),
            success: function (data) {
                debugger;
                console.log(data);
                window.location.href = 'lawyerList.html';
            },
            error:function(){
                console.error('/static_query/lawyer_list',arguments);
            }
        });

    };

    //找案件
    caseBtn.on('click',function(){
        var caseDescription = $('#case .caseDescription').val(),
            name = $('#case .name').val(),
            cityNode = $('#cityPicker .title span'),
            city = '',
            corporation = $('#case .corporation').val();
        if(cityNode[1]){
            city = cityNode[1].html();
        }else if(cityNode[0]){
            city = cityNode[0].html();
        };

        if(!(caseDescription || name || corporation)){
            if(!caseDescription){
                var str = $('#case .errorTip').html() + '　*请输入案件描述';
                $('#case .errorTip').html(str);
            }
            if(!name){
                var str = $('#case .errorTip').html() + '　*请输入律师名称';
                $('#case .errorTip').html(str);
            }
            if(!corporation){
                var str = $('#case .errorTip').html() + '　*请输入律师事务所名称';
                $('#case .errorTip').html(str);
            }
        }else{
            lawyerDetail(caseDescription,name,corporation);
        }

    });

    $('#case .caseDescription,#case .name,#case .corporation').focus(function(){
        $('#case .errorTip').html('');
    });

    function lawyerDetail(caseDes,name,corporation){
        //案由(*)+name
        var param = {
            'lawyer_name': name,
            'lawyer_location': corporation,
            'reason': {
                'reason_2': caseDes
            }
        };
        $.ajax({
            dataType:'json',
            url: 'http://47.92.38.167:8889/static_query/lawyer_detail',
            type: 'post',
            data:JSON.stringify(param),
            success: function (data) {
                debugger;
                console.log(data);
               // window.location.href = 'caseList.html';
            },
            error:function(){
                console.error('/static_query/lawyer_detail',arguments);
            }
        });

    };


});

