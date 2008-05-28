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
	$("tr.by_grade").hide();
	var grade = $("#reg_grade_level option:selected").val();
	if (grade != "" && grade != "-1") {
		$("tr.by_grade").filter(".grade_" + grade).show();
	}
	return true;
}

function set_form_updated() {
	$("#upd_by").val($("#userid").val()); 
	$("#upd_at").val(timestamp_now()); 
	return true;
}

function set_entry_dates(force) {
	$(".entry_date").each(function() {
		if (force || ($(this).val() == '')) { 
			if ($("#entry_date").is("input")) {
				$(this).val($("#entry_date").val()); 
			} else {
				$(this).val($("#entry_date").text()); 
			}
		}
	});
	$(".entry_grade_level").each(function() {
		if (force || ($(this).val() == '')) { 
			$(this).val($("#entry_grade_level").text()); 
		}
	});
}

function bind_login_generators() {
	if ($(".pwgen").length > 0) {
		$(".pwgen").bind("click", function() {
			var func_name = $(this).attr("id");
			genpass_fptrs[func_name]();
		});
	}
}

// intent to return form
$(document).ready(function() {
	// do stuff when user submits
	$("#attSubmitButton").bind("click", function(e) { 
		if (!$("#upd_by").hasClass("disabled")) { set_form_updated(); }
	});
	// change display based on selections
	$("#admin_update").bind("click", function() {
		if ($("#admin_update").attr("checked")) { set_form_updated(); }
	});
	$("#entry_check").bind("click", function() { set_entry_dates(1); });
	$("#reg_enroll").bind("change", function() { on_enrollment_change(); });
	$("#reg_grade_level").bind("change", function() { on_grade_level_change(); });
	// do stuff when page is loaded
	bind_login_generators();
	$(".private").hide();
	on_enrollment_change();
});

