// ==UserScript==
// @name         四川大学本科教务系统-成绩详情导航
// @version      1.4.2
// @description  在全部学期成绩查询页面添加前往分项成绩和当前学期成绩明细的入口。
// @author       moelwei02
// @match        *://zhjw.scu.edu.cn/*
// @match        *://202.115.47.141/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scu.edu.cn
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// ==/UserScript==

(function () {
	"use strict";

    if(GM_getValue("moelweijs_warningShow", -1) === -1){ // 未设置过
		GM_setValue("moelweijs_warningShow", 1);
	}

	if(GM_getValue("moelweijs_forceDetailEntrance", -1) === -1){ // 未设置过
		GM_setValue("moelweijs_forceDetailEntrance", 2);
	}

	if(GM_getValue("moelweijs_detailEnableAll", -1) === -1){
		GM_setValue("moelweijs_detailEnableAll", 2);
	}

	if (
		window.location.pathname ===
		"/student/integratedQuery/scoreQuery/allTermScores/index"
	) {



		let script = document.createElement("script");
		script.innerHTML = `function jumpToThisTerm() {
								urp.alert("正在跳转……");
								window.location.href =
									"/student/integratedQuery/scoreQuery/thisTermScores/index?navjs=1&initial=1";
								}
							function jumpToSubitem() {
								urp.alert("正在跳转……");
								window.location.href =
									"/student/integratedQuery/scoreQuery/subitemScore/index?navjs=1&initial=1";
							}

							

							function promptMoeJSSetting(){
								$("#moesetting").slideToggle();
							}

		`;
		
		$("head")[0].appendChild(script);

		$("#msg_div")
			.after(`<h4 class='header smaller lighter grey'><i class='ace-icon fa fa-search'></i> 高级查询<span class="right_top_oper">
						<button class="btn btn-warning btn-xs btn-round" onclick="promptMoeJSSetting()">
							<i class="ace-con fa fa-cogs white bigger-120"></i> 设置
						</button>
					</span></h4>
					<div style="display:block; margin:0.2rem" class="col-sm-12">
						<div id="moesetting" style="display:none;" class="form-horizontal col-sm-8">
							<div class="form-group">
								<label class="col-sm-6 control-label no-padding-right" for="form-field-1"> 跳转时显示警告 </label>
								<div class="col-sm-6">
									<input type="radio" name="form-field-radio" value="true" class="ace" id="form-field-radio-1">
									<span class="lbl"> 是 </span>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="radio" name="form-field-radio" value="false" class="ace" id="form-field-radio-2">
									<span class="lbl"> 否 </span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-6 control-label no-padding-right" for="form-field-2"> 在当前学期详细查询中强制显示分项成绩入口 </label>
								<div class="col-sm-6">
									<input type="radio" name="form-field-radio2" value="true" class="ace" id="form-field-radio2-1">
									<span class="lbl"> 是 </span>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="radio" name="form-field-radio2" value="false" class="ace" id="form-field-radio2-2">
									<span class="lbl"> 否 </span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-6 control-label no-padding-right" for="form-field-3" title="不含本学期成绩查询页面"> 在所有可能的页面强制显示分项成绩入口 </label>
								<div class="col-sm-6">
									<input type="radio" name="form-field-radio3" value="true" class="ace" id="form-field-radio3-1">
									<span class="lbl"> 是 </span>
									&nbsp;&nbsp;&nbsp;&nbsp;
									<input type="radio" name="form-field-radio3" value="false" class="ace" id="form-field-radio3-2">
									<span class="lbl"> 否 </span>
								</div>
							</div>
						</div>
					</div>
					<div style="display:block; margin:0.2rem;" class="col-sm-12">
						<button class='btn btn-xs btn-round btn-success' onclick='jumpToThisTerm()'>本学期成绩详情查询</button>
						<button class='btn btn-xs btn-round btn-danger' onclick='jumpToSubitem()'>明细成绩查询</button>
					</div>
		`);

		

		let selector1 = $("#form-field-radio-1");
		let selector2 = $("#form-field-radio-2");
		if (GM_getValue("moelweijs_warningShow", 1) == 1) {
			selector1.prop("checked", true);
			selector2.prop("checked", false);
		} else {
			selector1.prop("checked", false);
			selector2.prop("checked", true);
		}
		
		async function setWarningShow(){
			if(selector1.prop("checked")){
				await GM_setValue("moelweijs_warningShow", 1);
			}else{
				await GM_setValue("moelweijs_warningShow", 2);
			}
		}

		let selector3 = $("#form-field-radio2-1");
		let selector4 = $("#form-field-radio2-2");

		if (GM_getValue("moelweijs_forceDetailEntrance", 2) == 2) {
			selector3.prop("checked", false);
			selector4.prop("checked", true);
		} else {
			selector3.prop("checked", true);
			selector4.prop("checked", false);
		}

		async function setForceDetailEntrance(){
			if(selector3.prop("checked")){
				await GM_setValue("moelweijs_forceDetailEntrance", 1);
			}else{
				await GM_setValue("moelweijs_forceDetailEntrance", 2);
			}
		}

		let selector5 = $("#form-field-radio3-1");
		let selector6 = $("#form-field-radio3-2");

		if (GM_getValue("moelweijs_detailEnableAll", 2) == 2) {
			selector5.prop("checked", false);
			selector6.prop("checked", true);
		} else {
			selector5.prop("checked", true);
			selector6.prop("checked", false);
		}

		async function setDetailEnableAll(){
			if(selector5.prop("checked")){
				await GM_setValue("moelweijs_detailEnableAll", 1);
			}else{
				await GM_setValue("moelweijs_detailEnableAll", 2);
			}
		}
	

		selector1.change(function(){
			setWarningShow();
		});
		selector2.change(function(){
			setWarningShow();
		});
		selector3.change(function(){
			setForceDetailEntrance();
		});
		selector4.change(function(){
			setForceDetailEntrance();
		});
		selector5.change(function(){
			setDetailEnableAll();
		});
		selector6.change(function(){
			setDetailEnableAll();
		});
        
	}

	if (
		window.location.pathname ===
		"/student/integratedQuery/scoreQuery/thisTermScores/index"
	) {

		// fix broken page
		if($("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(6)").text().trim() !== "课程最高分"){
			$("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(5)").after("<th>课程最高分</th>");
			$("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(6)").after("<th>课程最低分</th>");
			$("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(7)").after("<th>课程平均分</th>");
			$("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(9)").after("<th>名次</th>");
		}
		// fix the broken fill-in function
		$("#btn-scroll-up").after(`<script>
				function fillScoreTable(d) { // override the original function
					var tContent = "";
					var param = $("#param").val();
					var schoolName = $("#schoolName").val();
					var showScoreDetail = $("#showScoreDetail").val();
					if (showScoreDetail != "0") {
						$("#mx").show();
					} else {
						$("#mx").hide();
					}
					var cnt=0;
					$.each(d, function (i, v) {
						tContent += "<tr>";
						tContent += "<td >" + v.id.courseNumber + "</td>";
						tContent += "<td >" + (v.coureSequenceNumber == null ? "" : (v.coureSequenceNumber == 'NONE' ? "" : v.coureSequenceNumber)) + "</td>";
						tContent += "<td >" + v.courseName + "</td>";
						tContent += "<td >" + v.credit + "</td>";
						tContent += "<td >" + v.coursePropertyName + "</td>";
						if (schoolName == "100049"&&"未评估"==v.courseScore) {
							cnt++;
						}
						if (v.inputStatusCode == "05") {
							if (1) {
								if (1) {
									tContent += "<td >" + v.maxcj + "</td>";
									tContent += "<td >" + v.mincj + "</td>";
								}
								tContent += "<td >" + v.avgcj + "</td>";
							}
							if (showScoreDetail != "0") {
								if (schoolName == "100010") {
									if (v.courseNumber == "58000001" || v.courseNumber == "58000002" || v.courseNumber == "58000003" || v.courseNumber == "58000004" || v.courseNumber == "58000005") {
										tContent += "<td ><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.courseScore + "</a></td>";
									} else {
										tContent += "<td ><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.levelName + "</a></td>";
									}
								} else {

									if (schoolName == "100049") {
										/*if (v.inputMethodCode == "002") {
										if("未评估"==v.levelName){
										tContent += "<td >" + v.levelName + "</td>";
										}else{
										tContent += "<td ><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.levelName + "</a></td>";
										}
										} else {
										if("未评估"==v.courseScore){
										tContent += "<td>" + v.courseScore + "</td>";
										}else{
										tContent += "<td><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.courseScore + "</a></td>";
										}

										}*/
										tContent += "<td >" + (v.inputMethodCode == "002" ? v.levelName : v.courseScore) + "</td>";
									} else {
										if (v.inputMethodCode == "002") {
											tContent += "<td ><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.levelName + "</a></td>";
										} else {
											tContent += "<td><a style='cursor: pointer;text-decoration: underline;' title='" + (param == "1" ? "查看分项成绩" : "查看明细成绩") + "' onclick='lookSubitemScore(\\"" + v.id.executiveEducationPlanNumber + "\\",\\"" + v.id.courseNumber + "\\",\\"" + v.coureSequenceNumber + "\\",\\"" + v.id.examtime + "\\",\\"" + v.coursePropertyCode + "\\")'>" + v.courseScore + "</a></td>";
										}
									}

								}


								if (schoolName == "100049") {
									/*if("未评估"==v.courseScore || "未评估"==v.levelName ){
									tContent += "未评估</td>";
									}else{
									tContent += "<button class='btn btn-info btn-round btn-xs'  id='gritter-sticky-" + i + "'>";
									tContent += "<i class='ace-icon fa fa-eye bigger-120'></i>查看</button></td>";
									}*/
								} else {
									tContent += "<td >";
									tContent += "<button class='btn btn-info btn-round btn-xs'  id='gritter-sticky-" + i + "'>";
									tContent += "<i class='ace-icon fa fa-eye bigger-120'></i>查看</button></td>";
								}
							} else {
								if (v.inputMethodCode == "002") {
									tContent += "<td>" + v.levelName + "</td>";
								} else {
									tContent += "<td>" + v.courseScore + "</td>";
								}
							}
							if (1) {
								tContent += "<td >" + v.rank + "</td>";
							}
							tContent += "<td >" + v.unpassedReasonExplain + "</td>";
						}else {
							if (showScoreDetail != "0") {
								if (schoolName == "100010") {
									tContent += "<td ></td><td ></td><td ></td>";
								} else if (schoolName == "100049") {
									tContent += "<td>" + v.avgcj + "</td>" +
											"<td>" + v.levelName + "</td><td >" + v.rank + "</td><td ></td>";
								} else {
									tContent += "<td ></td><td ></td><td ></td>" +
											"<td ></td><td ></td><td ></td><td ></td>";
								}
							} else {
								if (schoolName == "100010") {
									tContent += "<td ></td><td ></td>";
								} else if (schoolName == "100049") {
									tContent += "<td>" + v.avgcj + "</td>" +
											"<td>" + v.levelName + "</td><td >" + v.rank + "</td><td ></td>";
								} else {
									tContent += "<td ></td><td ></td><td ></td>" +
											"<td ></td><td ></td><td ></td>";
								}
							}
						}

						tContent += "<td >" + v.englishCourseName + "</td>";
						tContent += "</tr>";
					});
					$("#scoretbody").html(tContent);
					
					if(cnt>0){
						$("#msg_div").html("<font style='color:red;'>请登录学习通APP完成课程评教（登录学习通后点击右上角输入邀请码“km55553”，再点击“评价问卷”进入评价页面）。完成评教后需等数据更新方可查询成绩，更新时间为每日中午12点和晚上0点。</font>");
					}

					for (var i = 0; i < d.length; i++) {
						$("#gritter-sticky-" + i).on(ace.click_event, {
							zxjxjhh: d[i].id.executiveEducationPlanNumber,
							kch: d[i].id.courseNumber,
							kssj: d[i].id.examtime,
							kxh: d[i].coureSequenceNumber,
							kcm: d[i].courseName
						}, search);
					}
				}
			</script>`);


		let params = new URLSearchParams(window.location.search);
		if (params.get("navjs") === "1") {
			if (params.get("initial") === "1") {
				history.pushState(
					{},
					"RW",
					"http://zhjw.scu.edu.cn/student/integratedQuery/scoreQuery/thisTermScores/index?navjs=1"
				);
				if(GM_getValue("moelweijs_warningShow", 1) === 1){
					layer.alert(
						"该页面为URP系统存在但四川大学教务系统未前端显示的路由页面，其中内容可能被教务系统限制而不可用。另外由于URP系统本身限制，该页面仅在成绩登录开始至本学期结束有效，其余时间将不会返回有效内容。另请不要大肆传播该页面URL以防被教务处禁用。",
						{
							title: "提示",
							btn: ["返回前一页", "确认"],
						},
						function (index) {
							window.location.href = "/student/integratedQuery/scoreQuery/allTermScores/index";
						}
					);
				}
			}
			let script = document.createElement("script");
			script.innerHTML = `
			function returnToAllTerm() {
				urp.alert("正在跳转……");
				window.location.href = "/student/integratedQuery/scoreQuery/allTermScores/index";
			}
		`;
			$("head")[0].appendChild(script);
			$(
				".header"
			)[0].innerHTML = `<i class="menu-icon fa fa-calendar"></i> 本学期成绩查询列表
				<span class="right_top_oper">
					<button
						class="btn btn-warning btn-xs btn-round"
						onclick="returnToAllTerm()"
					>
						<i class="ace-con fa fa-share white bigger-120" style="transform: scaleX(-1)"></i> 返回
					</button>
				</span>
			`;

			

			if(GM_getValue("moelweijs_forceDetailEntrance", 2) === 1){
				$("#showScoreDetail").val("1");
				$("#timeline-1 > div > div > div > div > table > thead > tr > th:nth-child(9)").after("<th>课程明细</th>");
			}

		}
	}

	if (
		window.location.pathname ===
		"/student/integratedQuery/scoreQuery/subitemScore/index"
	) {
		let params = new URLSearchParams(window.location.search);
		if (params.get("navjs") === "1") {
			if (params.get("initial") === "1") {
				history.pushState(
					{},
					"RW",
					"http://zhjw.scu.edu.cn/student/integratedQuery/scoreQuery/subitemScore/index?navjs=1"
				);
				if(GM_getValue("moelweijs_warningShow", 1) === 1){
					layer.alert(
						"该页面为URP系统存在但四川大学教务系统未前端显示的路由页面，其中内容可能被教务系统限制而不可用。另外由于该页面未公开，请不要大肆传播这一页面的URL。",
						{
							title: "提示",
							btn: ["返回前一页", "确认"],
						},
						function (index) {
							window.location.href = "/student/integratedQuery/scoreQuery/allTermScores/index";
						}
					);
				}
			}
			let script = document.createElement("script");
			script.innerHTML = `
			function returnToAllTerm() {
				urp.alert("正在跳转……");
				window.location.href = "/student/integratedQuery/scoreQuery/allTermScores/index";
			}
		`;
			$("head")[0].appendChild(script);
			$(".header")[0].innerHTML = `
				<i class="ace-icon fa fa-search"></i> 查询条件<span class="right_top_oper">
				<button
					class="btn btn-info btn-xs btn-round"
					onclick="search();return false;"
				>
					<i class="ace-con fa fa-search white bigger-120"></i> 查询
				</button>
				<button
					class="btn btn-warning btn-xs btn-round"
					onclick="returnToAllTerm()"
				>
					<i
					class="ace-con fa fa-share white bigger-120"
					style="transform: scaleX(-1)"
					></i>
					返回
				</button>
				</span>
		`;
		}
	}

	if(	
		//window.location.pathname === "/student/integratedQuery/scoreQuery/allPassingScores/index" || // 全部及格成绩，存在问题，页面中相关函数没有定义
		window.location.pathname === "/student/integratedQuery/scoreQuery/coursePropertyScores/index" || // 课程属性成绩
		window.location.pathname === "/student/integratedQuery/scoreQuery/schemeScores/index" || // 方案成绩
		window.location.pathname === "/student/integratedQuery/scoreQuery/unpassedScores/index" ){ // 不及格成绩
			if(GM_getValue("moelweijs_detailEnableAll", 2) === 1){
				$("#showScoreDetail").val("1");
			}
		}

})();
