// ==UserScript==
// @name         四川大学本科教务系统-通知公告列表修复
// @version      1.0.0
// @description  修复通知公告列表无法翻页的问题
// @author       moelwei02
// @match        http://zhjw.scu.edu.cn/main/noticeList/index
// @match        http://202.115.47.141/main/noticeList/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 问题原因：URP系统自定义的pagenation.js中，翻页函数turntopage(args...)依赖第6个变量divPagerid，在原始的getTzlbList中，没有对divPagerid进行赋值（甚至原始的表格不存在id），导致翻页函数尝试读undefined的值，从而导致翻页失败
    // 解决方案：对列表div添加id，同时在getTzlbList中对divPagerid进行赋值，并重新调用getTzlbList函数，使页面刷新

    $('#page-content-template > div.row > div > div:nth-child(4)').attr('id', 'moefix_page_div');

    let fixedFunc=`
    function getTzlbList(page,pageSize,conditionChanged){
        var index;
        if (conditionChanged) {
            pageConditions = $(document.queryInfo).serialize();
        }
        $.ajax({
            url : "/main/noticeList/search",
            cache : false,
            type : "post",
            data : pageConditions + "&pageNum=" + page + "&pageSize=" + pageSize,
            dataType : "json",
            beforeSend: function () {
                index = layer.load(0, {
                    shade: [0.2, "#000"] //0.1透明度的白色背景
                });
            },
            complete: function () {
                layer.close(index);
            },
            success : function(d){
                urp.pagebar("urppagebar",pageSize,page,d[0]["pageContext"].totalCount,getTzlbList,"off","moefix_page_div");
                fillTable(d[0]["records"]);
            },
            error : function(xhr){
                urp.alert("错误代码["+xhr.readyState+"-"+xhr.status+"]:获取数据失败！");
            }
        });
    }`

    $("body").append(`<script>${fixedFunc}</script>`);
    getTzlbList(1, 10, true);
})();