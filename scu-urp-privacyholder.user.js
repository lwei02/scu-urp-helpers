// ==UserScript==
// @name         四川大学本科教务系统-隐私保护插件
// @version      1.0
// @description  对头像、姓名等进行直接替换，便于截图
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// @grant 		 GM_log
// ==/UserScript==

(function() {
    "use strict";

    if(GM_getValue("moe_showFakeAlertTs", "undefinedundefined") == "undefinedundefined"){
        GM_setValue("moe_showFakeAlertTs", "0");
    }
    
    if(GM_getValue("moe_showFakeInfo", "undefinedundefined") == "undefinedundefined"){
        GM_setValue("moe_showFakeInfo", 0);
    }

    if(GM_getValue("moe_showFakeInfo", 0) == 1){
        console.log("隐私保护插件：开启")
        // get last popup time
        var lastTs = GM_getValue("moe_showFakeAlertTs", "0");
        var nowTs = new Date().getTime();
        // test if last popup time is 1 day ago
        if(nowTs - lastTs > 86400000){
            console.log("隐私保护插件：距离上次提示("+ lastTs +")超过1天，弹出提示")
            // popup alert
            $.gritter.add({
                title: '注意',
                text: '隐私保护插件已开启，当前页面的姓名和头像已被替换。如需关闭，请点击头像旁的日历文字。<br><br>该消息将在24小时内不再弹出。',
                time: 5000,
                class_name: 'gritter-info'
            });
            // update last popup time
            GM_setValue("moe_showFakeAlertTs", nowTs);
        }else{
            console.log("隐私保护插件：1天内("+ lastTs +")已提示过，不再弹出")
        }
    }else{
        console.log("隐私保护插件：关闭")
    }

    if(GM_getValue("moe_fakeName", "undefinedundefined") == "undefinedundefined"){
        GM_setValue("moe_fakeName", "[REDACTED]");
    }
    if(GM_getValue("moe_avatarGender", "undefined") == "undefined"){
        GM_setValue("moe_avatarGender", 1) // 1 for female and 2 for male
    }

    var name = $(".user-info")[0].innerText.split("\n")[1].trim();
    var avatar = $(".nav-user-photo")[0].src;

    function showFakeInfo(){
        $(".user-info")[0].innerText = $(".user-info")[0].innerText.replace($(".user-info")[0].innerText.split("\n")[1].trim(), GM_getValue("moe_fakeName", "[REDACTED]"));
        if(GM_getValue("moe_avatarGender", 1) == 1){
            $(".nav-user-photo")[0].src = "/img/head/woman.png";
        }else{
            $(".nav-user-photo")[0].src = "/img/head/man.png";
        }
    }

    function showRealInfo(){
        $(".user-info")[0].innerText = $(".user-info")[0].innerText.replace($(".user-info")[0].innerText.split("\n")[1].trim(), name);
        $(".nav-user-photo")[0].src = avatar;
    }

    function updateShowInfo(){
        if(GM_getValue("moe_showFakeInfo", 0) == 1){
            showFakeInfo();
        }else{
            showRealInfo();
        }
    }

    // 锚定日历元素，点击日历切换显示
    var $target = $(".light-red")[0];
    $target.addEventListener("click", function(){
        if(GM_getValue("moe_showFakeInfo", 0) == 0){
            GM_setValue("moe_showFakeInfo", 1);
            console.log("切换隐私保护插件状态：开启")
        }else{
            GM_setValue("moe_showFakeInfo", 0);
            console.log("切换隐私保护插件状态：关闭")
        }
        updateShowInfo();
    });

    // 检查页面URL，如果是个人信息编辑页面，添加设置按钮
    if(window.location.pathname === "/student/rollManagement/personalInfoUpdate/index"){
        $("#loading-btn").after("\
        <span id='moe_settingBtn' class='btn btn-primary btn-xs btn-round search_btn' style='margin-left: 10px;'><i class=\"ace-icon fa fa-cog bigger-120\"></i>隐私保护插件设置</span>");
        // 锚定页面中存在的隐藏表单元素，在其随后添加其他的隐藏表单元素
        //$("input[name='tokenValue']").after("<input type='hidden' name='moe_fakeName' value='" + GM_getValue("moe_fakeName", "[REDACTED]") + "'>");
        //$("input[name='tokenValue']").after("<input type='hidden' name='moe_avatarGender' value='" + GM_getValue("moe_avatarGender", 1) + "'>");
        $("input[name='tokenValue']").after("<input type='hidden' name='moe_layerIndex' value=''>");

        // 设置按钮点击事件
        $("#moe_settingBtn").click(function(){
            layer.open({
                type: 1,
                title: "隐私保护插件设置",
                area: ["400px", "300px"],
                content: "<div style='padding: 20px;'><p>姓名：<input id='moe_fakeName' type='text' value='" + GM_getValue("moe_fakeName", "[REDACTED]") + "'></p><p>头像：<select id='moe_avatarGender'><option value='1'>女</option><option value='2'>男</option></select></p><p><button id='moe_saveBtn' class='btn btn-primary btn-xs btn-round search_btn' style='margin-left: 10px;'>保存</button></p></div>",
                success: 
                    function(layero, index){
                        $("#moe_layerIndex").attr("value", index);
                    }
                });
            $("#moe_avatarGender").val(GM_getValue("moe_avatarGender", 1));
            $("#moe_saveBtn").click(function(){
                layer.close($("#moe_layerIndex").val());
                GM_setValue("moe_fakeName", $("#moe_fakeName").val());
                GM_setValue("moe_avatarGender", $("#moe_avatarGender").val());
                layer.msg("设置已保存");
                updateShowInfo();
            })
        })
    }

    updateShowInfo();
})();
