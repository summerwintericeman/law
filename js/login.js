$(function() {

    //点击登录函数
    $("#agreeLg").on("click", function() {
        var mess = $(".userNameLg")[0].value,
            email = null,
            account = null,
            password = $(".passWordLg")[0].value;
        if(!mess) {
            errorModal("请输入用户名或者邮箱！");
            return;
        } else if(!password) {

        } else {
            //判断是邮件还是账户
            var temp = mess.indexOf("@");
            if(temp != -1) { //表示是邮箱
                email = mess;
                account = '';
            } else {
                account = mess;
                email = '';
            }
            var param = JSON.stringify({
                "email": email,
                "account": account,
                "password": password
            })
            console.log(param);
            $.ajax({
                dataType: 'json',
                url: 'http://47.97.197.176:8888/auth/login',
                type: 'post',
                data: param,
                success: function(res) {
                    if(res.code == 0) {
                        var userMess = JSON.stringify({
                            "email": email,
                            "account": account
                        })
                        $.cookie("userMess", userMess,{path:"/"});
                        //获取cookie   判断是否需要回到特定界面
                        var getUrl = $.cookie('toLoginPre');
                        if(getUrl){
                        	$.cookie('toLoginPre','',{ expires: -1 ,path:'/'});
                        	 window.location.href = getUrl;
                        }else{
                        	 window.location.href = "../index.html";
                        }
                        
                       
                    } else {
                        errorModal(res.msg);
                    }
                },
                error: function() {
                    errorModal('登录失败！');
                    console.error('/auth/login', arguments);
                }
            });

        }
    })

})