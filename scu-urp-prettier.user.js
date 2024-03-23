// ==UserScript==
// @name         四川大学本科教务系统-字体替换
// @version      2.0.1
// @description  教务系统美化，字体替换
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @match        *://zhjwjs.scu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".navbar-brand > .span_bbzx").innerText = '四川大学教学管理与服务平台'; // 统一标题，部分页面仍使用“四川大学教务管理系统”
    
    var styleTg = document.createElement('style');
    styleTg.type = 'text/css';
    styleTg.innerHTML = `
    @font-face {
        font-family: "DIM";
        src: url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets/fonts/woff2/DIN_Regular.woff2") format("woff2"), url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets/fonts/TrueType/DIN_Regular.ttf") format("TrueType");
        font-weight: normal;
    }
    @font-face {
        font-family: "DIM";
        src: url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/woff2/DIN_Medium.woff2") format("woff2"), url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/TrueType/DIN_Medium.ttf") format("TrueType");
        font-weight: bold;
    } 
    @font-face {
        font-family: "HYQiHei";
        src: url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/woff2/HYQiHei_50S.woff2") format("woff2"), url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/TrueType/HYQiHei_50S.ttf") format("TrueType");
        font-weight: normal;
    } 
    @font-face {
        font-family: "HYQiHei";
        src: url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/woff2/HYQiHei_65S.woff2") format("woff2"), url("https://cdn.jsdelivr.net/gh/lwei02/scu-urp-assets@master/fonts/TrueType/HYQiHei_65S.ttf") format("TrueType");
        font-weight: bold;
    } 
    body {
        font-family: "DIM", "HYQiHei" !important;
    }
    h1 {
        font-family: "DIM", "HYQiHei" !important;
    }
    h2 {
        font-family: "DIM", "HYQiHei" !important;
    }
    h3 {
        font-family: "DIM", "HYQiHei" !important;
    }
    h4 {
        font-family: "DIM", "HYQiHei" !important;
    }
    h5 {
        font-family: "DIM", "HYQiHei" !important;
    }
    input{
        font-family: "DIM", "HYQiHei";
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(styleTg);
    $("#\\30  > small").attr("style", "font-weight: bold;");



})();