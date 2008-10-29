// intent to return form
jQuery(document).ready(function() {
	var enrollment = jQuery("#reg_enroll").val();
	var not_enrolling = (enrollment.indexOf("nr-") == 0);
	if (not_enrolling) { 
		jQuery(".enrolling").hide();
	}
	jQuery(".chk_status").each(function() {
		jQuery(this).bind("click", function() { return false; } );
		var src = "#" + jQuery(this).attr('id').replace('_status', '_updated_at');
		if (jQuery(src).val() != "") { jQuery(this).attr("checked", "checked"); }
	});
});

