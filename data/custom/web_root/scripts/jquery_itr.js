function on_enrollment_change() {
	var enrollment = jQuery("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment.indexOf("nr-") == 0);
	if (not_enrolling) { 
		jQuery("tr.enrolling").hide(); 
		jQuery("tr.not_enrolling").show();
	} else { 
		jQuery("tr.enrolling").show(); 
		jQuery("tr.not_enrolling").hide();
		on_grade_level_change();
	}
	return true;
}

function on_grade_level_change() {
	jQuery("tr.by_grade").hide();
	var grade = jQuery("#reg_grade_level option:selected").val();
	if (grade != "" && grade != "-1") {
		jQuery("tr.by_grade").filter(".grade_" + grade).show();
	}
	return true;
}

function set_form_updated() {
	jQuery("#upd_by").val(jQuery("#userid").val()); 
	jQuery("#upd_at").val(timestamp_now()); 
	return true;
}

function set_entry_dates(force) {
	jQuery(".entry_date").each(function() {
		if (force || (jQuery(this).val() == '')) { 
			if (jQuery("#entry_date").is("input")) {
				jQuery(this).val(jQuery("#entry_date").val()); 
			} else {
				jQuery(this).val(jQuery("#entry_date").text()); 
			}
		}
	});
	jQuery(".entry_grade_level").each(function() {
		if (force || (jQuery(this).val() == '')) { 
			jQuery(this).val(jQuery("#grade_level").text()); 
		}
	});
}

function bind_login_generators() {
	if (jQuery(".pwgen").length > 0) {
		jQuery(".pwgen").bind("click", function() {
			var func_name = jQuery(this).attr("id");
			genpass_fptrs[func_name]();
		});
	}
}

// intent to return form
jQuery(document).ready(function() {
	// do stuff when user submits
	jQuery("#attSubmitButton").bind("click", function(e) { 
		if (!jQuery("#upd_by").hasClass("disabled")) { set_form_updated(); }
	});
	// change display based on selections
	jQuery("#admin_update").bind("click", function() {
		if (jQuery("#admin_update").attr("checked")) { set_form_updated(); }
	});
	jQuery("#entry_check").bind("click", function() { set_entry_dates(1); });
	jQuery("#reg_enroll").bind("change", function() { on_enrollment_change(); });
	jQuery("#reg_grade_level").bind("change", function() { on_grade_level_change(); });
	// do stuff when page is loaded
	bind_login_generators();
	jQuery(".private").hide();
	on_enrollment_change();
});

