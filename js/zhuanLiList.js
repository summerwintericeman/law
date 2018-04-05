/**
 * Created by sphwjj on 2018/3/30.
 */
$(document).ready(function() {
    var name = getUrlParam('per',true);
    var com = getUrlParam('com',true);
    var ulNode = $('ul.node2List');
    var isFirstLoad = true;
    var aNode = $('.path a').eq(2);
    var getCurIdx = $.cookie('zhuanLiData') || 1;
    if(getCurIdx){
        getCurIdx = parseInt(getCurIdx);
    }

    aNode.attr('href',aNode.attr('href') + name);

    agentsDetail();


    function agentsDetail() {
        var param = {
            'name': name,
            agency:com,
            "page_num": getCurIdx,
            "page_count": 12,
        };
        $.ajax({
            dataType: 'json',
            url: 'http://47.97.197.176:8888/query/patent/patent_by_agname',
            type: 'post',
            data: JSON.stringify(param),
            success: function(res) {
                if(res.code==0){
                	ulNode.empty();
                    creatNode(res.data.data);
                    if(isFirstLoad){
                        $('.pagerWrap').pagination({
                            pageCount:res.max_page_num,
                            totalData:res.data.count,
                            showData:12,
                            current:getCurIdx,
                            mode:'fixed',
                            isHide:true,
                            callback:function(api){
                                pagerGo(api);
                            }
                        });
                    }
                }else{
                    errorModal('查询代理人列表失败!');
                    console.error('agent_by_name：', res);
                }


            },
            error: function() {
                errorModal('查询代理人列表失败!');
                console.error('agent_by_name：', arguments);
            }
        });
    };

    //创建节点
    function creatNode(data){
        $.each(data,function(i,ele){
            var node=`<li class="eachContent">
                    <h3>
                        <span><i class="LowTitle text-strong">${ele.dev_name}</i> </span></h3>
                    <p class="com">
                        <span><i class="LowTitle text-strong">专利类型:</i> ${ele.patent_type}</span>
                        <span><i class="LowTitle text-strong">专利描述:</i> ${ele.abstract}</span>
                        <span><i class="LowTitle text-strong">专利号/日期:</i> ${ele.patent_no} / ${ele.public_date}</span>
                    </p>
                </li>`;
            ulNode.append(node);
        });

    };

    function pagerGo(api){
        var curIdx = api.getCurrent();
        //获得页数
        getCurIdx = curIdx;
        $.cookie('zhuanLiData', getCurIdx,{path:'/'});

        agentsDetail();

    };




});
