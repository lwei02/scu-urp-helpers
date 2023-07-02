// ==UserScript==
// @name         四川大学本科教务系统-隐私保护插件
// @version      2.0.1
// @description  对头像、姓名等进行直接替换，便于截图
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// @grant 		 GM_log
// ==/UserScript==

(function() {
    "use strict";

    if(GM_getValue("moe_showFakeInfo", -1) == -1){ // 是否启用插件
        GM_setValue("moe_showFakeInfo", 0);
    }

    if(GM_getValue("moe_fakeName", "undefinedundefined") == "undefinedundefined"){ // 开启时显示的姓名
        GM_setValue("moe_fakeName", "***");
    }

    if(GM_getValue("moe_avatarGender", -1) == -1){ // 使用的头像性别
        GM_setValue("moe_avatarGender", 1) // 1 for female and 2 for male
    }

    if(GM_getValue("moe_alwaysFakeAvatar", -1) == -1){ // 插件关闭时是否仍然使用系统默认头像之一而不显示照片
        GM_setValue("moe_alwaysFakeAvatar", 0);
    }

    if(GM_getValue("moe_alwaysFakeAvatarFollowRealGender", -1) == -1){ // 当上方为1时，且插件关闭，是否根据真实性别显示头像
        GM_setValue("moe_alwaysFakeAvatarFollowRealGender", 1);
    }

    var name = $(".user-info")[0].innerText.split("\n")[1].trim();
    var avatar = $(".nav-user-photo")[0].src;
    var gender = $(".nav-user-photo")[0].onerror.toString().split("head/")[1].split(".png")[0] == "man" ? 2 : 1

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
        if(GM_getValue("moe_alwaysFakeAvatar", 0) == 0){
            $(".nav-user-photo")[0].src = avatar;
        }else if(GM_getValue("moe_alwaysFakeAvatarFollowRealGender", 1) == 1){
            $(".nav-user-photo")[0].src = (gender == 1 ? "/img/head/woman.png" : "/img/head/man.png");
        }else{
            $(".nav-user-photo")[0].src = (GM_getValue("moe_avatarGender", 1) == 1 ? "/img/head/woman.png" : "/img/head/man.png");
        }
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
        }else{
            GM_setValue("moe_showFakeInfo", 0);
        }
        updateShowInfo();
        var outputStr = "隐私保护插件状态已切换\n头像：";
        if(GM_getValue("moe_showFakeInfo", 0) == 0){
            if(GM_getValue("moe_alwaysFakeAvatar", 0) == 0){
                outputStr += "真实头像\n";
            }else if(GM_getValue("moe_alwaysFakeAvatarFollowRealGender", 1) == 1){
                outputStr += $(".nav-user-photo")[0].src.split("head/")[1].split(".png")[0] == "man" ? "男" : "女";
                outputStr += "性默认头像\n";
            }else{
                outputStr += GM_getValue("moe_avatarGender", 1) == 1 ? "女" : "男";
                outputStr += "性默认头像\n";
            }
            outputStr += "姓名：真实姓名\n";
        }else{
            outputStr += GM_getValue("moe_avatarGender", 1) == 1 ? "女" : "男";
            outputStr += "性默认头像\n";
            outputStr += "姓名：" + GM_getValue("moe_fakeName", "[REDACTED]") + "\n";
        }
        console.info(outputStr);
    });
    $target.children[0].href = "javascript:;" // 原始链接为#，点击后会跳转到页面顶部，改为javascript:;阻止跳转

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
            var index = layer.open({
                type: 1,
                title: "隐私保护插件设置",
                area: ["400px", "425px"],
                content: `
                <div style="margin: 20px;">
                    <div class="form-group">
                        <label for="moe_fakeName">开启插件时显示的姓名</label>
                        <input type="text" class="form-control" id="moe_fakeName" placeholder="请输入姓名" value="` + GM_getValue("moe_fakeName", "[REDACTED]") + `">
                    </div>
                    <div class="form-group">
                        <label for="moe_avatarGender">开启插件时显示的头像性别</label>
                        <select class="form-control" id="moe_avatarGender">
                            <option value="1">女</option>
                            <option value="2">男</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="moe_alwaysFakeAvatar">插件关闭时头像显示方式</label>
                        <select class="form-control" id="moe_alwaysFakeAvatar">
                            <option value="0">显示学籍照片（教务系统默认方式）</option>
                            <option value="1">显示默认头像</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="moe_alwaysFakeAvatarFollowRealGender">插件关闭时默认头像性别</label>
                        <select class="form-control" id="moe_alwaysFakeAvatarFollowRealGender">
                            <option value="0">依据插件设置</option>
                            <option value="1">依据真实性别</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <button id="moe_saveBtn" class="btn btn-primary btn-block">保存</button>
                    </div>
                </div>
                `
                });
            $("input[name='moe_layerIndex']").val(index)
            $("#moe_avatarGender").val(GM_getValue("moe_avatarGender", 1));
            $("#moe_alwaysFakeAvatar").val(GM_getValue("moe_alwaysFakeAvatar", 0));
            $("#moe_alwaysFakeAvatarFollowRealGender").val(GM_getValue("moe_alwaysFakeAvatarFollowRealGender", 1));
            if(GM_getValue("moe_alwaysFakeAvatar", 0) == 0){
                $("#moe_alwaysFakeAvatarFollowRealGender").parent().hide();
            }
            $("#moe_saveBtn").click(async function(){
                await GM_setValue("moe_fakeName", $("#moe_fakeName").val());
                await GM_setValue("moe_avatarGender", $("#moe_avatarGender").val());
                await GM_setValue("moe_alwaysFakeAvatar", $("#moe_alwaysFakeAvatar").val());
                await GM_setValue("moe_alwaysFakeAvatarFollowRealGender", $("#moe_alwaysFakeAvatarFollowRealGender").val());
                layer.msg("设置已保存");
                updateShowInfo();
                layer.close($("input[name='moe_layerIndex']").val());
            })
            $("#moe_alwaysFakeAvatar").change(function(){
                if($("#moe_alwaysFakeAvatar").val() == 1){
                    $("#moe_alwaysFakeAvatarFollowRealGender").parent().show();
                }else{
                    $("#moe_alwaysFakeAvatarFollowRealGender").parent().hide();
                }
            })
        })
    }

    updateShowInfo();
})();
