// intent to return form
$(document).ready(function() {
	// do stuff when user submits
	$("#attSubmitButton").bind("click", function(e) { 
		$("#upd_by").val($("#userid").val()); 
		$("#upd_at").val(timestamp_now()); return true; });
	// change display based on selections
	$("#reg_enroll").bind("change", function() { on_enrollment_change(); });
	$("#reg_grade_level").bind("change", function() { on_grade_level_change(); });
	// do stuff when page is loaded
	on_enrollment_change();
});

function on_enrollment_change() {
	var enrollment = $("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment.indexOf("nr-") == 0);
	if (not_enrolling) { 
		$("tr.enrolling").hide(); 
		$("tr.not_enrolling").show();
	} else { 
		$("tr.enrolling").show(); 
		$("tr.not_enrolling").hide();
		on_grade_level_change();
	}
	return true;
}

function on_grade_level_change() {
	var grade = $("#reg_grade_level option:selected").val();
	if (grade == "" || grade == "-1") { 
		$("tr.by_grade").hide();
	} else { 
		grade = ".grade_" + grade; 
		var not_grade = ':not("' + grade + '")';
		$("tr.by_grade").filter(grade).show();
		$("tr.by_grade").filter(not_grade).hide();
	}
	return true;
}
