// ==UserScript==
// @name         四川大学本科教务系统-14天免登录
// @version      1.0
// @description  在登录界面恢复“两周内不必登录”选项
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if( document.body.innerHTML.indexOf("SCU URP 助手") !== -1 ) { // 广泛使用的SCU URP 助手具备相同功能，若检查到该脚本加载（即页面内存在这一字符串）则不再加载本脚本
        return;
    }else if( window.location.pathname === "/login" ) {
        $("input[type=\"submit\"]").before(`
            <div style="margin: 0.2rem">
                <input type="checkbox" id="_spring_security_remember_me" name="_spring_security_remember_me" class="fadeIn third" style="margin-bottom: 5px;text-align: left;">
                <label for="_spring_security_remember_me">两周之内不必登录</label>
            </div>
        `)
    }
})();
