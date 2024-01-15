// ==UserScript==
// @name         四川大学本科教务系统-教学评估结果查询
// @version      1.1.0
// @description  查询当前课程所有教师获得的全部评分
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant        none
// ==/UserScript==

var bChangePromised = false;
var bChangePromised2 = false;

async function changePromised() {
    if($('#myTab > li')[0].attributes['class'].value == 'active'){
        // setting bChangePromised to false
        bChangePromised = false;
        return;
    }else if($('#myTab > li')[1].attributes['class'].value == 'active' && !bChangePromised){
        // setting bChangePromised to true, no duplicate execution
        bChangePromised = true;
        // wait 1s for the page to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        let btns = $('button.btn-xs.btn-round')
        // there are 2 types of btns, one is evaluation, the other is view, use if to distinguish
        for(let i = 0; i < btns.length; i++){
            if(btns[i].innerText.trim() == '评估'){
                // the ktid is the key to get the score, which is in onclick attribute
                let ktid = btns[i].attributes['onclick'].value.split("evaluation3(\"")[1].split("\",\"")[0];
                // add another btn
                let newBtn = document.createElement('button');
                newBtn.innerText = '查看他人评分';
                newBtn.className = 'btn btn-xs btn-round btn-warning';
                newBtn.style = 'margin-left: 5px;';
                newBtn.setAttribute('onclick', `moeViewScore('${ktid}')`);
                btns[i].parentElement.appendChild(newBtn);
            }
            if(btns[i].innerText.trim() == '查看'){
                // the ktid is the key to get the score, which is in onclick attribute
                let ktid = btns[i].attributes['onclick'].value.split("evaluationResult2(\"")[1].split("\",\"")[0];
                // add another btn
                let newBtn = document.createElement('button');
                newBtn.innerText = '查看他人评分';
                newBtn.className = 'btn btn-xs btn-round btn-warning';
                newBtn.style = 'margin-left: 5px;';
                newBtn.setAttribute('onclick', `moeViewScore('${ktid}')`);
                btns[i].parentElement.appendChild(newBtn);
            }
        }
        return;
    }
}

async function changePromised2() {
    if($('#myTab > li')[0].attributes['class'].value == 'active' && !bChangePromised2){
        // setting bChangePromised to true, no duplicate execution
        bChangePromised2 = true;
        // wait 1s for the page to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        let btns = $('button.btn-xs.btn-round')
        // there are 2 types of btns, one is evaluation, the other is view, use if to distinguish
        for(let i = 0; i < btns.length; i++){
            if(btns[i].innerText.trim() == '评估'){
                // the ktid is the key to get the score, which is in onclick attribute
                let ktid = btns[i].attributes['onclick'].value.split("evaluation2(\"")[1].split("\",\"")[0];
                // add another btn
                let newBtn = document.createElement('button');
                newBtn.innerText = '查看评分结果';
                newBtn.className = 'btn btn-xs btn-round btn-warning';
                //newBtn.style = 'margin-left: 5px;'; // 这里不需要margin-left，因为原来的按钮后面有两个空格
                newBtn.setAttribute('onclick', `moeViewScore2('${ktid}')`);
                btns[i].parentElement.appendChild(newBtn);
            }
            if(btns[i].innerText.trim() == '查看'){
                // the ktid is the key to get the score, which is in onclick attribute
                let ktid = btns[i].attributes['onclick'].value.split("evaluationResult(\"")[1].split("\");")[0];
                // add another btn
                let newBtn = document.createElement('button');
                newBtn.innerText = '查看评分结果';
                newBtn.className = 'btn btn-xs btn-round btn-warning';
                newBtn.style = 'margin-left: 5px;';
                newBtn.setAttribute('onclick', `moeViewScore2('${ktid}')`);
                btns[i].parentElement.appendChild(newBtn);
            }
            // 还有“修改”按钮，不过不需要改
        }
        return;
    }else try{ // 如果没有按过“期末评估”，会没有class属性（而不是class为空），理论上不影响，但是会洗console
        if($('#myTab > li')[1].attributes['class'].value == 'active'){
            // setting bChangePromised to false
            bChangePromised2 = false;
            return;
        }
        }catch(e){
        return;
    }
}

(function() {
    'use strict';
    if(window.location.pathname != "/student/teachingEvaluation/newEvaluation/index"){
        return;
    }
    setInterval(changePromised,50) // test every 0.05s
    setInterval(changePromised2,50) // test every 0.05s
    $('body')[0].appendChild(document.createElement('script')).innerHTML = `
    async function moeViewScore(ktid){
        // get the score
        let pjxqJson = await $.ajax({
            url: '/student/teachingAssessment/bbcx/pgjgwh/queryPgxq',
            type: 'POST',
            dataType: 'json',
            data: {
                ktid: ktid,
                pgid: '-1' // invaild value, the endpoint will still return the score
            },
            success: function(data){
                return data;
            },
            error: function(data){
                layer.msg('获取失败')
                console.log(data)
            }
        });
        let scoreLstRaw = pjxqJson.data.map.teachers; // [[0:'TeacherNum', 1:'TeacherName', 2:(int)Score, 3:'ktid'], ...]
        var scoreLst = [];
        var teacherLst = [];
        // generate teacher list
        for(let i = 0; i < scoreLstRaw.length; i++){
            if (!teacherLst.includes("".concat(scoreLstRaw[i][1], "(", scoreLstRaw[i][0], ")"))){
                teacherLst.push("".concat(scoreLstRaw[i][1], "(", scoreLstRaw[i][0], ")"));
            }
        }
        // generate score list
        for(let i = 0; i < teacherLst.length; i++){
            let score = [];
            for(let j = 0; j < scoreLstRaw.length; j++){
                if(scoreLstRaw[j][0] == teacherLst[i].split("(")[1].split(")")[0]){
                    score.push(scoreLstRaw[j][2]);
                }
            }
            score.sort(function(a, b){return a - b});
            scoreLst.push({
                teacher: teacherLst[i],
                score: score
            });
        }
        // generate text
        let text = '';
        let prevVal = void 0;
        let curTotal = 0;
        for(let i = 0; i < scoreLst.length; i++){
            text += \`\${scoreLst[i].teacher}：<br/>\`;
            for(let j = 0; j < scoreLst[i].score.length; j++){
                if(scoreLst[i].score[j] != prevVal){
                    if(prevVal != void 0){
                        text += \`\${prevVal}分：\${curTotal}人<br/>\`;
                    }
                    prevVal = scoreLst[i].score[j];
                    curTotal = 1;
                }else{
                    curTotal++;
                }
            }
            text += \`\${prevVal}分：\${curTotal}人<br/>\`;
            text += '平均分：';
            prevVal = void 0;
            curTotal = 0;
            let sum = 0;
            for(let j = 0; j < scoreLst[i].score.length; j++){
                sum += scoreLst[i].score[j];
            }
            text += \`\${(sum/scoreLst[i].score.length).toFixed(2)}<br/><br/>\`;
        }
        text += '查询学生评价主观信息：<br/>'
        text += '请先点击<a href="javascript:;" onclick="window.open(\\\'http://id.scu.edu.cn/enduser/sp/sso/scdxplugin_jwt2?enterpriseId=scdx&target_url=index\\\')">此链接</a>登录统一身份认证，弹出教师教务系统后点击<a href="javascript:;" onclick="window.open(\\\'http://zhjwjs.scu.edu.cn/admin/teachingAssessment/cxtj/pgjgcx/showPgjgDetailsNew?ktId=' + ktid + '\\\')">此链接</a>查看'
        // show the text
        layer.alert(text);
    }
    async function moeViewScore2(ktid){
        let text = '';
        text += '请先点击<a href="javascript:;" onclick="window.open(\\\'http://id.scu.edu.cn/enduser/sp/sso/scdxplugin_jwt2?enterpriseId=scdx&target_url=index\\\')">此链接</a>登录统一身份认证，弹出教师教务系统后点击<a href="javascript:;" onclick="window.open(\\\'http://zhjwjs.scu.edu.cn/admin/teachingAssessment/cxtj/pgjgcx/showPgjgDetailsNew?ktId=' + ktid + '\\\')">此链接</a>查看'
        // show the text
        layer.alert(text);
    }
    `;
})();