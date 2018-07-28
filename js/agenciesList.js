/**
 * Created by sphwjj on 2018/3/12.
 */
/**
 * Created by sphwjj on 2018/3/10.
 */
$(document).ready(function() {
    //读取cookie
    var ulNote = $('#agentsList .liWrap');
    var getCookie = $.cookie('agents');
    var cookieMess = JSON.parse(getCookie);


    agentsList(cookieMess.per,function(pkg){
        console.log(pkg);
        $.each(pkg.data,function(idx,ele){
            createLawList(res,ele);
        });


    });

    //添加案件列表子节点
    function createLawList(res,data) {
        if(data.judgement_date){
            var date = data.judgement_date.split(/\s/);
            data.judgement_date = date[0];
        }
        var newObj = {
            wenshu_id:data.wenshu_id || '',
            title:data.title || '',
            court:data.court || '',
            judicial_procedure:data.judicial_procedure || '',
            case_num:data.case_num || '',
            judgement_date:data.judgement_date || '',
            source_url:data.source_url || ''
        }
        var liNode = '<li><a href=" ' + newObj.source_url ;
        liNode +=  '"target="_blank"  class="contant"><p class="title text-strong">' + newObj.title;
        liNode +=  '</p><p class="court">审判法院 ' + newObj.court　+ '('${newObj.judicial_procedure} + ')';
        liNode +=  '</p><p class="info"><span>案件编号：' + newObj.case_num + '</span><span>审判日期：';
        liNode +=  newObj.judgement_date = '</span></p><span class="details btn">查看详情</span>/a></li>';
        ulNote.append(liNode);
    };


    function agentsList(name,callback) {
        var param = {
            'name': '工业和信息化部电子专利中心'
        };
        $.ajax({
            dataType: 'json',
            url: 'http://47.92.38.167:8889/query/patent/agent_company',
            type: 'post',
            data: JSON.stringify(param),
            success: function(res) {
                console.log(res);
                if(res.code==0){
                    if(callback){
                        callback(res);
                    }
                }else{
                    errorModal(res.msg);
                    console.error('查询列表失败:',res);
                }
            },
            error: function() {
                errorModal('查询列表失败!');
                console.error('agent_company：', arguments);
            }
        });
    };













})
