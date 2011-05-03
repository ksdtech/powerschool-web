function enrollment_setup() {
	var enrollment = jq15("#reg_enroll").val();
	var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
	if (not_enrolling) { 
		jq15("tr.enrolling").hide(); 
		jq15("tr.not_enrolling").show();
	} else { 
		jq15("tr.enrolling").show(); 
		jq15("tr.not_enrolling").hide();
		grade_level_setup();
	}
	return true;
}

function grade_level_setup() {
	jq15("tr.by_grade").hide();
	var grade = jq15("#reg_grade_level").val();
	if (grade != "" && grade != "-1") {
		jq15("tr.by_grade").filter(".grade_" + grade).show();
	}
	return true;
}

// happy.js validations
jq15(document).ready(function () {
  enrollment_setup();
});
