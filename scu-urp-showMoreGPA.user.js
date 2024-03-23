// ==UserScript==
// @name         四川大学本科教务系统-标准GPA
// @version      1.0.0
// @description  Temporarily brought Standard GPA back.
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js
// ==/UserScript==


(function() {
    'use strict';

    if(!window.location.pathname.indexOf('index') in ['/', '/index', '/index.htm', '/index.html']) {
        return;
    }
    
    var stdGpa = 0.0;
    var ccGpa = 0.0;

    

    // redefine the function which queries academic info
    const oldLearnInfo = learnInfo;
    learnInfo = function(flag) {
        oldLearnInfo(flag);
        const schemeScorePage = '/student/integratedQuery/scoreQuery/schemeScores/index'
        var fetchReq = fetch(schemeScorePage, {
            method: 'GET',
            credentials: 'same-origin'
        });
        fetchReq.then(res => res.text()).then(html => {
            const matchReg = /\/student\/integratedQuery\/scoreQuery\/[0-9a-zA-Z]{10}\/schemeScores\/callback/g;
            var matchRes = html.match(matchReg);
            if(matchRes === null) {
                return;
            }
            var callback = matchRes[0];
            var fetchReq = fetch(callback, {
                method: 'GET',
                credentials: 'same-origin'
            });
            fetchReq.then(res => res.json()).then(json => {
                var creditSum = 0.0;
                var gpa = 0.0;
                for(let i of json['lnList']){
                    for(let j of i['cjList']){
                        creditSum += parseFloat(j['credit']);
                    }
                }
                for(let i of json['lnList']){
                    for(let j of i['cjList']){
                        gpa += parseFloat(j['credit']) / creditSum * j['gradePointScore'];
                    }
                }
                ccGpa = parseFloat(document.getElementById('gpa').innerText);
                stdGpa = gpa;
                document.getElementById('gpa').innerText = gpa.toFixed(2);
                document.getElementById('gpaName').innerText = '主修标准GPA算法';
            });
        });
    };

    // redefine the function showMoreGPA
    const oldShowMoreGPA = showMoreGPA;
    showMoreGPA = function() {
        const dat = [
            ['主修标准GPA算法', stdGpa.toFixed(2), null],
            ['主修必修GPA算法', ccGpa, null]
        ];
        var cont = "<div class='modal-header no-padding'>\
                <div class='table-header'>\
                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>\
                        <span class='white'>×</span>\
                    </button>\
                    GPA成绩\
                </div>\
            </div><div class='modal-body no-padding'>";
        cont += "<table class='table table-bordered table-hover'>";
        cont += "<thead><tr><th>GPA类型</th><th>GPA值</th></tr></thead>";
        cont += "<tbody>";
        $.each(dat, function (i, v) {
            cont += "<tr>";
            cont += "<td>" + v[0] + "</td><td>" + (v[1] == null ? "" : v[1]) + "</td>";
            cont += "</tr>";
        });
        cont += "</tbody>";
        cont += "</table></div>";
        $('#view-table .modal-content').html(cont);
        $('#view-table .modal-content').css("max-height", "calc(100vh - 71px)");
        $('#view-table .modal-content').css("overflow", "auto");

        $('#view-table .modal-dialog').css('width', '50%');
        $('#view-table').modal({
            backdrop: 'static',
            keyboard: false
        }).on("hidden.bs.modal", function () {
            $('#view-table .modal-dialog').css('width', '60%');
            /*$("div").remove(".widget-box");*/
            $(this).removeData("bs.modal");
        });
        $('.modal-backdrop').each(function () {
            $(this).css('opacity', '0.5');
        });
    };

    
}());