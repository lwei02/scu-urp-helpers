// ==UserScript==
// @name         四川大学本科教务系统-教材查询
// @version      1.0.0
// @description  查询已选教材的详细信息
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.pathname != "/student/integratedQuery/teachingMaterial/SelectionSearch/index"){
        return;
    }
    // redefine the following function
    $('body')[0].appendChild(document.createElement('script')).innerHTML = `
function fillTable(data,isScroll,page,pageSize){
    var tcont = "";
    $.each(data,function(i,v){
        var tableId = "";
        if(isScroll){
            tableId = (page-1)*pageSize+1+i;
        }else{
            tableId = i+1;
        }
        tcont += "<tr>";
        tcont += "<td>"+tableId+"</td>";
        tcont += '<td><button class="btn btn-info btn-xs btn-round" onclick="window.open(\\\'http://zhjwjs.scu.edu.cn/teacher/comprehensiveQuery/search/textbookSpecified/show?jsh=&kxh=' + v.id.kxh + '&kch=' + v.id.kch + '&zxjxjhh=' + v.id.zxjxjhh + '\\\')">查看详细</button></td>';
        tcont += "<td>"+(v.jcmc == null ? "" : v.jcmc)+"</td>";
        tcont += "<td>"+(v.id.jcbh == null ? "" : v.id.jcbh)+"</td>";
        tcont += "<td>"+(v.id.kch == null ? "" : v.id.kch)+"</td>";
        tcont += "<td>"+(v.kcm == null ? "" : v.kcm)+"</td>";
        tcont += "<td>"+(v.isbn == null ? "" : v.isbn)+"</td>";
        tcont += "<td>"+(v.bc == null ? "" : v.bc)+"</td>";
        tcont += "<td>"+(v.barcode == null ? "" : v.barcode)+"</td>";
        if (true){
            tcont += "<td>"+(v.cbsmc == null ? "" : v.cbsmc)+"</td>";
        }
        tcont += "<td>"+(v.zzz == null ? "" : v.zzz)+"</td>";
        /* tcont += "<td>"+v.cbrq+"</td>";
        tcont += "<td>"+v.dj+"</td>";
        tcont += "<td>"+v.kcl+"</td>";
        tcont += "<td>"+v.jcjj+"</td>";   */
        tcont += "</tr>";
    });
    if(isScroll){
        $("#form_tbody").append(tcont);
    }else{
        $("#form_tbody").html(tcont);
    }
}
    `;
    $('#sample-table-2 > thead > tr > th:nth-child(1)').after('<th>操作</th>');
    $("#page-content-template > div > div > h4").html("\n\t\t\t\t<i class=\"glyphicon glyphicon-list\"></i> 列表 <small><span class='red'><b>注意：</b>请先通过<a href=\"javascript:;\" onclick=\"window.open('http://id.scu.edu.cn/enduser/sp/sso/scdxplugin_jwt2?enterpriseId=scdx&target_url=index')\">此链接</a>进行统一认证，转到教师系统首页后再回到本页面点击查看详情</span></small>\n\t\t\t")
})();