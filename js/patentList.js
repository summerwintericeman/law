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
        var liNode = `<li>
            <a href="${newObj.source_url}"  target="_blank"  class="contant">
                <p class="title text-strong">${newObj.title}</p>
                <p class="court">审判法院：${newObj.court}　（${newObj.judicial_procedure}）</p>
                <p class="info">
                    <span>案件编号：${newObj.case_num}</span>
                    <span>审判日期：${newObj.judgement_date}</span>
                </p>

            </a>
            <a class="details btn" href="${newObj.source_url}" target="_blank">查看详情</a>
        </li>`
        ulNote.append(liNode);
    };


    function agentsList(name,callback) {
        var param = {
            'name': '工业和信息化部电子专利中心'
        };
        $.ajax({
            dataType: 'json',
            url: 'http://47.97.197.176:8888/query/patent/agent_company',
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
                    console.error('查询代理人列表失败:',res);
                }
            },
            error: function() {
                errorModal('查询代理人列表失败!');
                console.error('patent/agent_company：', arguments);
            }
        });
    };




//     var pagerUl = $('#agentsList .pagination');
//     var agentsListCookie = $.cookie('agentsList');
//     if(!agentsListCookie){
//         agentsListCookie = {
//             listTotal: 0,//请求返回的最大页码
//             listnum: -1,//当前查看页码
//             firstPageNum:1,//翻页的第一个页码
//             reasonObj: null,
//         }
//     }else{
//         agentsListCookie = JSON.parse(agentsListCookie);
//     }
//
//     var getCookie = $.cookie('agents');
//
//     if(getCookie){
//         var cookieMess = JSON.parse(getCookie);
//         agentsListCookie.reasonObj = cookieMess;
//
//
// 		agentsList(cookieMess.per,function(pkg){
// 				console.log(pkg);
// 			$.each(pkg.data,function(idx,ele){
// 				createLawList(res,ele);
// 			});
// 			creatPage(pkg.max_page_num, curPage);
// 			//保存cookie
// 			agentsListCookie.listTotal = pkg.max_page_num;
// 			$.cookie('agentsList',JSON.stringify(agentsListCookie),{path:'/'});
//
// 			//刷新时重置页码
// 			var node = pagerUl.find('.pageNum');
// 			var firstPage = agentsListCookie.firstPageNum || 1;
// 			firstPage = parseInt(firstPage);
// 			for(var i=0;i<5;i++){
// 				node.eq(i).find('a').html(firstPage+i);
// 				if(firstPage+i==agentsListCookie.listnum){
// 					node.eq(i).addClass('active');
// 				}
// 			}
//
// 		});
//
//     };
//
// //添加案件列表子节点
//     function createLawList(res,data) {
//         if(data.judgement_date){
//             var date = data.judgement_date.split(/\s/);
//             data.judgement_date = date[0];
//         }
//         var newObj = {
//             wenshu_id:data.wenshu_id || '',
//             title:data.title || '',
//             court:data.court || '',
//             judicial_procedure:data.judicial_procedure || '',
//             case_num:data.case_num || '',
//             judgement_date:data.judgement_date || '',
//             source_url:data.source_url || ''
//         }
//         var liNode = `<li>
//             <a href="${newObj.source_url}"  target="_blank"  class="contant">
//                 <p class="title text-strong">${newObj.title}</p>
//                 <p class="court">审判法院：${newObj.court}　（${newObj.judicial_procedure}）</p>
//                 <p class="info">
//                     <span>案件编号：${newObj.case_num}</span>
//                     <span>审判日期：${newObj.judgement_date}</span>
//                 </p>
//
//             </a>
//             <a class="details btn" href="${newObj.source_url}" target="_blank">查看详情</a>
//         </li>`
//         ulNote.append(liNode);
//     };
// //创建翻页节点
//     function creatPage(num, page_num) {
//         var liNote = $(".before");
//         num = num>5?5:num;
//         for(var i = 1; i <= num; i++) {
//             var noteNew;
//             if(i == page_num) {
//                 noteNew = `<li class="changePage active pageNum mouseHand">
// 					<a>${i}</a>
// 				</li>`;
//             }else{
//                 noteNew = `<li class="changePage pageNum mouseHand">
// 					<a>${i}</a>
// 				</li>`;
//             }
//             liNote.before(noteNew);
//         }
//     };
// //点击翻页事件
//     $(".pagination").on("click", ".changePage", function(event) {
//         if(event.currentTarget.className.indexOf('disabled')>-1){
//             return;
//         }
//
//         var text = event.target.innerHTML,page_num,index,PreActive;//index点击li的下标(0开始)、PreActive点击的时候active的li的下标
//         var pageNode = pagerUl.find('.pageNum');
//         var allCur = JSON.parse($.cookie('agentsList'));
//         for(var i = 0;i < 5; i++){
//             if(pageNode.eq(i).hasClass('active')){
//                 PreActive = i;
//             }
//         }
//
//         //判断是否点击上一页、下一页
//         if(text.indexOf('&gt;&gt;')>-1 ){
//             page_num = parseInt(allCur.listnum) + 1;
//             if(PreActive==4){
//                 for(var i=0; i<5;i++){
//                     var val1 = parseInt(pageNode.eq(i).find('a').html()) + 1 ;
//                     pageNode.eq(i).find('a').html(val1);
//                 }
//                 pageNode.removeClass('active');
//                 pageNode.eq(4).addClass('active');
//             }else{
//                 pageNode.removeClass('active');
//                 pageNode.eq(PreActive + 1).addClass('active');
//             }
//
//         }else if(text.indexOf('&lt;&lt;')>-1 ){
//             page_num = parseInt(allCur.listnum) - 1;
//             if(PreActive==0){
//                 for(var i=0; i<5;i++){
//                     var val1 = parseInt(pageNode.eq(i).find('a').html()) - 1 ;
//                     pageNode.eq(i).find('a').html(val1);
//                 }
//                 pageNode.removeClass('active');
//                 pageNode.eq(0).addClass('active');
//             }else{
//                 pageNode.removeClass('active');
//                 pageNode.eq(PreActive - 1).addClass('active');
//             }
//
//         }else{
//             index = $(this).index()-1;
//             page_num = parseInt(text);
//             if(page_num == allCur.listnum){//页数相同，不用发起请求
//                 return
//             }
//             pageNode.removeClass('active');
//             if(index==4){
//                 if(page_num == allCur.listTotal){
//                     pageNode.eq(4).addClass('active');
//                 }else{
//                     for(var i=0; i<5;i++){
//                         var val1 = parseInt(pageNode.eq(i).find('a').html()) + 1 ;
//                         pageNode.eq(i).find('a').html(val1);
//                     }
//                     pageNode.eq(3).addClass('active');
//                 }
//             }else if(index==0){
//                 if(page_num==1){
//                     pageNode.eq(0).addClass('active');
//                 }else{
//                     for(var i=0; i<5;i++){
//                         var val2 = parseInt(pageNode.eq(i).find('a').html()) - 1 ;
//                         pageNode.eq(i).find('a').html(val2);
//                     }
//                     pageNode.eq(1).addClass('active');
//                 }
//             }else{
//                 pageNode.eq(index).addClass('active');
//             }
//         }
//
//         var newPageNode = pagerUl.find('.pageNum');
//         if(newPageNode.eq(4).find('a').html() == allCur.listTotal){
//             newPageNode.eq(4).next('li').addClass('disabled');
//         }else{
//             newPageNode.eq(4).next('li').removeClass('disabled');
//         }
//         if(newPageNode.eq(0).find('a').html() == '1'){
//             newPageNode.eq(0).prev('li').addClass('disabled');
//         }else{
//             newPageNode.eq(0).prev('li').removeClass('disabled');
//         }
//
//
//         //获得页数
//         agentsListCookie.listnum = page_num;
//         agentsListCookie.firstPageNum = newPageNode.eq(0).find('a').html();
//         var tempCoo = JSON.stringify(agentsListCookie);
//         $.cookie('agentsList', tempCoo,{path:'/'});
//         //通过agentsListCookie 来进行参数的给予
//         agentsList(agentsListCookie.reasonObj.des, page_num, city,function(pkg){
//             ulNote.empty();
//             $.each(pkg.data,function(idx,ele){
//                 createLawList(agentsListCookie.reasonObj.des,ele);
//             });
//         });
//
//
//     });









})
