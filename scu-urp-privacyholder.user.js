// ==UserScript==
// @name         四川大学本科教务系统-隐私保护插件
// @version      4.0.0
// @description  对头像、姓名等进行直接替换，便于截图
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// @grant 		 GM_log
// @grant 		 GM_getResourceText
// @grant 		 GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.7/layui.min.js
// @resource     layui_css https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.7/css/layui.min.css
// ==/UserScript==

(function() {
    "use strict";
    // GM Value list:
    // 1. profileIndex: 0, 1 [0*：配置0，1：配置1；配置0的姓名强制为真实姓名]
    // 2. p0_name: "name" [默认值从页面中获取]
    // 3. p0_avatarMode: 0-2 [0*: 不隐藏头像，1: 默认头像， 2: 自定义头像]
    // 4. p0_defAvtGender: 0, 1 [0: 男性头像，1: 女性头像，仅在p0_avatarMode为1时有效，此处默认值通过检测头像的onerror属性来判断]
    // 5. p0_cusAvt: "base64" [仅在p0_avatarMode为2时有效]
    // 6. p1_name: "name" [默认值为"***"]
    // 7. p1_avatarMode: 1-2 [1*: 默认头像， 2: 自定义头像]
    // 8. p1_defAvtGender: 0, 1 [0: 男性头像，1: 女性头像，仅在p1_avatarMode为1时有效，此处默认值通过检测头像的onerror属性来判断]
    // 9. p1_cusAvt: "base64" [仅在p1_avatarMode为2时有效]

    const layui_css = GM_getResourceText("layui_css");
    GM_addStyle(layui_css);

    // 默认配置
    if(GM_getValue("profileIndex", void 0) === void 0) {
        GM_setValue("profileIndex", 0);
    }
    let realname = $('span.user-info').text().trim().split('欢迎您，')[1].trim();
    if(GM_getValue("p0_name", void 0) === void 0){
        GM_setValue("p0_name", realname);
    }
    if(GM_getValue("p0_avatarMode", void 0) === void 0) {
        GM_setValue("p0_avatarMode", 0);
    }
    let userGen = ($('.nav-user-photo').attr('onerror').indexOf('wo') == -1) ? 0 : 1; // 0: 男性，1: 女性
    if(GM_getValue("p0_defAvtGender", void 0) === void 0) {
        GM_setValue("p0_defAvtGender", userGen);
    }
    if(GM_getValue("p0_cusAvt", void 0) === void 0) { // 这里的默认值是女生的默认头像
        GM_setValue("p0_cusAvt", "data:image/png;base64,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");
    }
    if(GM_getValue("p1_name", void 0) === void 0) {
        GM_setValue("p1_name", "***");
    }
    if(GM_getValue("p1_avatarMode", void 0) === void 0) {
        GM_setValue("p1_avatarMode", 1);
    }
    if(GM_getValue("p1_defAvtGender", void 0) === void 0) {
        GM_setValue("p1_defAvtGender", userGen);
    }
    if(GM_getValue("p1_cusAvt", void 0) === void 0) {
        GM_setValue("p1_cusAvt", "data:image/png;base64,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");
    }

    // 定义更新函数
    // 目标：更新.user-info和.nav-user-photo
    function updateShow(){
        let name = ''
        let avatarSrc = ''
        // 确定使用0还是1
        if(GM_getValue("profileIndex") == 0){
            // 配置0
            name = GM_getValue("p0_name");
            if(GM_getValue("p0_avatarMode") == 0){
                // 不隐藏头像
                avatarSrc = "/main/queryStudent/img"
            } else if(GM_getValue("p0_avatarMode") == 1){
                // 默认头像
                avatarSrc = (GM_getValue("p0_defAvtGender") == 0) ? "/img/head/man.png" : "/img/head/woman.png";
            } else {
                // 自定义头像
                avatarSrc = GM_getValue("p0_cusAvt");
            }
        } else {
            // 配置1
            name = GM_getValue("p1_name");
            if(GM_getValue("p1_avatarMode") == 1){
                // 默认头像
                avatarSrc = (GM_getValue("p1_defAvtGender") == 0) ? "/img/head/man.png" : "/img/head/woman.png";
            } else {
                // 自定义头像
                avatarSrc = GM_getValue("p1_cusAvt");
            }
        }
        // 更新
        $('.user-info').html("".concat("欢迎您，<br/>", name));
        $('.nav-user-photo').attr('src', avatarSrc);
    }

    // 定义配置函数
    function showConfigPanel(){
        let cpHtml = ''
        cpHtml += `
        <div class="tabbable" style="margin: 1.667rem">
            <ul class="nav nav-tabs">
                <li class="active">
                    <a data-toggle="tab" id="moe-privacy-cp-tab0" style="cursor: pointer">弱保护配置</a>
                </li>
                <li class="">
                    <a data-toggle="tab" id="moe-privacy-cp-tab1" style="cursor: pointer">强保护配置</a>
                </li>
            </ul>
            <div style="margin: 1.667rem" />
            <div class="form-horizontal col-sm-12" id="moe-privacy-cp-tab0-page">
                <div class="form-group" style="">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-name0">显示名称</label>
                    <div class="col-sm-8">
                        <input type="text" id="moe-privacy-cp-name0" placeholder="显示名称" class="col-xs-10 col-sm-10 form-control" value="" disabled>
                    </div>
                </div>
                <div class="form-group" style="">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-avatarMode0">头像显示模式</label>
                    <div class="col-sm-8">
                        <select class="col-xs-10 col-sm-10 form-control" id="moe-privacy-cp-avatarMode0">
                            <option value="0">不隐藏头像</option>
                            <option value="1">默认头像</option>
                            <option value="2">自定义头像</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-defAvtGender0">默认头像性别</label>
                    <div class="col-sm-8">
                        <select class="col-xs-10 col-sm-10 form-control" id="moe-privacy-cp-defAvtGender0">
                            <option value="1">女</option>
                            <option value="0">男</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-cusAvt0">自定义头像</label>
                    <div class="col-sm-8">
                        <input type="file" id="moe-privacy-cp-cusAvt0" placeholder="自定义头像" class="col-xs-10 col-sm-10 form-control" value="">
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-cusAvt0-img">自定义头像预览</label>
                    <div class="col-sm-8">
                        <img src="" id="moe-privacy-cp-cusAvt0-img" style="height:50px">
                    </div>
                </div>
            </div>
            <div class="form-horizontal col-sm-12" id="moe-privacy-cp-tab1-page">
                <div class="form-group" style="">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-name1">显示名称</label>
                    <div class="col-sm-8">
                        <input type="text" id="moe-privacy-cp-name1" placeholder="显示名称" class="col-xs-10 col-sm-10 form-control" value="">
                    </div>
                </div>
                <div class="form-group" style="">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-avatarMode1">头像显示模式</label>
                    <div class="col-sm-8">
                        <select class="col-xs-10 col-sm-10 form-control" id="moe-privacy-cp-avatarMode1">
                            <option value="1">默认头像</option>
                            <option value="2">自定义头像</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-defAvtGender1">默认头像性别</label>
                    <div class="col-sm-8">
                        <select class="col-xs-10 col-sm-10 form-control" id="moe-privacy-cp-defAvtGender1">
                            <option value="1">女</option>
                            <option value="0">男</option>
                        </select>
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-cusAvt1">自定义头像</label>
                    <div class="col-sm-8">
                        <input type="file" id="moe-privacy-cp-cusAvt1" placeholder="自定义头像" class="col-xs-10 col-sm-10 form-control" value="">
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label class="col-sm-4 control-label no-padding-right" for="moe-privacy-cp-cusAvt1-img">自定义头像预览</label>
                    <div class="col-sm-8">
                        <img src="" id="moe-privacy-cp-cusAvt1-img" style="height:50px">
                    </div>
                </div>
            </div>
        </div>
        `
        layer.open({
            type: 1,
            title: '隐私保护配置',
            area: ['600px', '400px'],
            shadeClose: true,
            content: cpHtml,
            btn: ['保存', '取消'],
            yes: function(index, layero){
                // 保存
                // 配置0
                GM_setValue("p0_name", $('#moe-privacy-cp-name0').val());
                GM_setValue("p0_avatarMode", $('#moe-privacy-cp-avatarMode0').val());
                GM_setValue("p0_defAvtGender", $('#moe-privacy-cp-defAvtGender0').val());
                GM_setValue("p0_cusAvt", $('#moe-privacy-cp-cusAvt0-img').attr('src'));
                // 配置1
                GM_setValue("p1_name", $('#moe-privacy-cp-name1').val());
                GM_setValue("p1_avatarMode", $('#moe-privacy-cp-avatarMode1').val());
                GM_setValue("p1_defAvtGender", $('#moe-privacy-cp-defAvtGender1').val());
                GM_setValue("p1_cusAvt", $('#moe-privacy-cp-cusAvt1-img').attr('src'));
                // 更新
                updateShow();
                // 关闭
                layer.msg('配置已保存', {icon: 1});
                layer.close(index);
            },
            btn2: function(index, layero){
                // 取消
                layer.close(index);
            },
            success: function(layero, index){
                // 初始化
                // 配置0
                $('#moe-privacy-cp-name0').val(GM_getValue("p0_name"));
                $('#moe-privacy-cp-avatarMode0').val(GM_getValue("p0_avatarMode"));
                $('#moe-privacy-cp-defAvtGender0').val(GM_getValue("p0_defAvtGender"));
                $('#moe-privacy-cp-cusAvt0-img').attr('src', GM_getValue("p0_cusAvt"));
                // 配置1
                $('#moe-privacy-cp-name1').val(GM_getValue("p1_name"));
                $('#moe-privacy-cp-avatarMode1').val(GM_getValue("p1_avatarMode"));
                $('#moe-privacy-cp-defAvtGender1').val(GM_getValue("p1_defAvtGender"));
                $('#moe-privacy-cp-cusAvt1-img').attr('src', GM_getValue("p1_cusAvt"));
                // 绑定事件
                $('#moe-privacy-cp-tab0').click(function(){
                    $('#moe-privacy-cp-tab0-page').show();
                    $('#moe-privacy-cp-tab1-page').hide();
                });
                $('#moe-privacy-cp-tab1').click(function(){
                    $('#moe-privacy-cp-tab0-page').hide();
                    $('#moe-privacy-cp-tab1-page').show();
                });
                $('#moe-privacy-cp-avatarMode0').change(function(){
                    if($('#moe-privacy-cp-avatarMode0').val() == 0){
                        $('#moe-privacy-cp-defAvtGender0').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt0').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt0-img').parent().parent().hide();
                    } else if($('#moe-privacy-cp-avatarMode0').val() == 1){
                        $('#moe-privacy-cp-defAvtGender0').parent().parent().show();
                        $('#moe-privacy-cp-cusAvt0').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt0-img').parent().parent().hide();
                    } else {
                        $('#moe-privacy-cp-defAvtGender0').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt0').parent().parent().show();
                        $('#moe-privacy-cp-cusAvt0-img').parent().parent().show();
                    }
                });
                $('#moe-privacy-cp-avatarMode1').change(function(){
                    if($('#moe-privacy-cp-avatarMode1').val() == 1){
                        $('#moe-privacy-cp-defAvtGender1').parent().parent().show();
                        $('#moe-privacy-cp-cusAvt1').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt1-img').parent().parent().hide();
                    } else {
                        $('#moe-privacy-cp-defAvtGender1').parent().parent().hide();
                        $('#moe-privacy-cp-cusAvt1').parent().parent().show();
                        $('#moe-privacy-cp-cusAvt1-img').parent().parent().show();
                    }
                });
                $('#moe-privacy-cp-cusAvt0').change(function(){
                    let file = $('#moe-privacy-cp-cusAvt0')[0].files[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e){
                        $('#moe-privacy-cp-cusAvt0-img').attr('src', e.target.result);
                    }
                });
                $('#moe-privacy-cp-cusAvt1').change(function(){
                    let file = $('#moe-privacy-cp-cusAvt1')[0].files[0];
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e){
                        $('#moe-privacy-cp-cusAvt1-img').attr('src', e.target.result);
                    }
                });

                // 初始化显示
                if(GM_getValue("profileIndex") == 0){
                    $('#moe-privacy-cp-tab0').click();
                } else {
                    $('#moe-privacy-cp-tab1').click();
                }
                $('#moe-privacy-cp-avatarMode0').change();
                $('#moe-privacy-cp-avatarMode1').change();

            }
        });
    }

    // 覆盖li.light-red > a的href为javascript:;
    // 防止点击后跳到页顶
    $('li.light-red > a').attr('href', 'javascript:;');
    // 为li.light-red 绑定点击事件
    $('li.light-red').click(function(){
        // 切换配置
        if(GM_getValue("profileIndex") == 0){
            GM_setValue("profileIndex", 1);
        } else {
            GM_setValue("profileIndex", 0);
        }
        // 更新
        updateShow();
    });

    // 以下仅在/student/rollManagement/personalInfoUpdate/index有效
    if(window.location.pathname == '/student/rollManagement/personalInfoUpdate/index'){
        // 在#loading-btn后面添加按钮
        $('#loading-btn').after('<button onclick="return false;" id="moe-privacy-cp-btn" style="margin-left: 3px;" class="btn btn-primary btn-xs btn-round"><i class="ace-icon fa fa-cog bigger-120"></i>隐私保护插件配置</button>');
        // 绑定点击事件
        $('#moe-privacy-cp-btn').click(function(){
            showConfigPanel();
        });
    }

    // 每次加载页面时，更新显示
    updateShow();

    
})();