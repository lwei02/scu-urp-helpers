// ==UserScript==
// @name         四川大学本科教务系统-教材查询
// @version      2.0.1
// @description  查询已选教材的详细信息
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://zhjwjs.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    if(window.location.hostname == "zhjw.scu.edu.cn"){
    
    if(window.location.pathname != "/student/integratedQuery/teachingMaterial/SelectionSearch/index"){
        $("#\\31 443382").after(`
        <li id="1443382001" onclick="toSelect(this);">
            <a href="/student/integratedQuery/teachingMaterial/SelectionSearch/index?moe=1">&nbsp;&nbsp;
                全部课程教材查询
            </a>
            <b class="arrow"></b>
        </li>
        `)
        return;
    }
    if(window.location.search != '?moe=1'){
        $("#\\31 443382").after(`
        <li id="1443382001" onclick="toSelect(this);">
            <a href="/student/integratedQuery/teachingMaterial/SelectionSearch/index?moe=1">&nbsp;&nbsp;
                全部课程教材查询
            </a>
            <b class="arrow"></b>
        </li>
        `)
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
        tcont += '<td><button class="btn btn-info btn-xs btn-round" onclick="window.open(\\\'http://zhjwjs.scu.edu.cn/teacher/comprehensiveQuery/search/textbookSpecified/show?jsh=&kxh=' + v.id.kxh + '&kch=' + v.id.kch + '&zxjxjhh=' + v.id.zxjxjhh + '&moe=1\\\')">查看详细</button></td>';
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
    } else {
        $("#\\31 443382").after(`
        <li class="active" id="1443382001" onclick="toSelect(this);">
            <a href="/student/integratedQuery/teachingMaterial/SelectionSearch/index?moe=1"><i class="menu-icon fa fa-caret-right"></i>&nbsp;&nbsp;
                全部课程教材查询
            </a>
            <b class="arrow"></b>
        </li>
        `)
        $("#\\31 377620 > a > span").click()
        $("#\\31 443381 > a").click()
        // init layer.load()
        const loadIdx = layer.load(0)

        // remove forms other than termId
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(8)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(7)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(6)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(5)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(4)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(1) > div:nth-child(3)').remove();
        $('#page-content-template > div > div > form > div > div:nth-child(2)').remove();

        // change th
        $('#sample-table-2 > thead > tr').html(`
        <th>序号</th>
        <th>操作</th>
        <th>课程号</th>
        <th>课程名称</th>
        <th>课序号</th>
        <th>教师</th>
        <th>所属方案</th>
        <th>选课方式</th>
        `)
        $("#page-content-template > div > div > h4").html("\n\t\t\t\t<i class=\"glyphicon glyphicon-list\"></i> 列表 <small><span class='red'><b>注意：</b>请先通过<a href=\"javascript:;\" onclick=\"window.open('http://id.scu.edu.cn/enduser/sp/sso/scdxplugin_jwt2?enterpriseId=scdx&target_url=index')\">此链接</a>进行统一认证，转到教师系统首页后再回到本页面点击查看详情</span></small>\n\t\t\t")
        
        // load ajax url from "/student/courseSelect/calendarSemesterCurriculum/index"
        let ajaxUrl = ''
        await $.get('/student/courseSelect/calendarSemesterCurriculum/index', function(data){
            ajaxUrl = data.match(/\/student\/courseSelect\/thisSemesterCurriculum\/[A-Za-z0-9]{10}\/ajaxStudentSchedule\/past\/callback/g)[0]
        });

        // close layer.load()
        layer.close(loadIdx)

        

        function fillTable2(data){
            var newHTML = ''
            let tableId = 1
            for(let key in data.xkxx[0]){
                var entry = data.xkxx[0][key]
                newHTML += '<tr>'
                newHTML += '<td>' + tableId + '</td>'
                newHTML += '<td><button class="btn btn-info btn-xs btn-round" onclick="window.open(\'http://zhjwjs.scu.edu.cn/teacher/comprehensiveQuery/search/textbookSpecified/show?jsh=&kxh=' + entry.id.coureSequenceNumber + '&kch=' + entry.id.coureNumber + '&zxjxjhh=' + entry.id.executiveEducationPlanNumber + '&moe=1\')">查询教材</button></td>'
                newHTML += '<td>' + entry.id.coureNumber + '</td>'
                newHTML += '<td>' + entry.courseName + '</td>'
                newHTML += '<td>' + entry.id.coureSequenceNumber + '</td>'
                newHTML += '<td>' + entry.attendClassTeacher.trim() + '</td>'
                newHTML += '<td>' + entry.programPlanName + '</td>'
                newHTML += '<td>' + entry.selectCourseStatusName + '</td>'
                newHTML += '</tr>'
                tableId++
            }
            $('#form_tbody').html(newHTML)
            $("#page_div_jc").show()
        }

        function queryLi(){
            let termId = $("[name='zxjxjhh']").val()
            const loadIdx = layer.load(0)
            $.post(ajaxUrl, {
                "planCode": termId
            }, function(data){
                console.log(data)
                layer.close(loadIdx)
                fillTable2(data)
            }, 'json')
        }

        $('#queryButton').attr('onclick', 'return false;')
        queryButton.addEventListener('click', queryLi)
        $("#pagination_pageSize_urppagebar").val(10).change()
        urppagebar.remove()

        queryLi()

    }
}

    // 对教师页面修改
    if(window.location.hostname == "zhjwjs.scu.edu.cn"){
        if(window.location.pathname != "/teacher/comprehensiveQuery/search/textbookSpecified/show"){
            return;
        }
        if(window.location.search.indexOf('moe=1') == -1){ // 只处理由本脚本打开的页面
            return;
        }
        $("#page-content-template > div > div > h4:nth-child(6)").remove()
        $("#page-content-template > div > div > div.profile-user-info.profile-user-info-striped.self").remove()
        $("#page-content-template > div > div > div > table > thead > tr > th:nth-child(13)").text("选用理由")
        $("span[title='点击修改教师用书数量']").remove() // 删除修改教师用书数量的按钮，防止通过学生账号操作此项造成混乱
        // get tr elements' length of tbody
        let trLen = $('#page-content-template > div > div > div > table > tbody > tr').length
        // if length is 0, then return
        if(trLen == 0){
            return;
        }
        // if length is 1, then no rowspan, set the last cell's text with $('xylytemp').val()
        if(trLen == 1){
            $('#page-content-template > div > div > div > table > tbody > tr > td:nth-child(13)').text($('#xylytemp').val())
            return;
        }
        // if length is larger than 1, then rowspan, set the first row's last cell's text with $('xylytemp').text(), remove other rows' last cell
        $('#page-content-template > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(13)').text($('#xylytemp').val())
        $('#page-content-template > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(13)').attr('rowspan', trLen)
        for(let i = 2; i <= trLen; i++){
            $('#page-content-template > div > div > div > table > tbody > tr:nth-child(' + i + ') > td:nth-child(13)').remove()
        }

    }
})();
