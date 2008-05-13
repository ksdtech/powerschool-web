// intent to return form
$(document).ready(function() {
	var enrollment = $("#reg_enroll").val();
	var not_enrolling = (enrollment.indexOf("nr-") == 0);
	if (not_enrolling) { 
		$(".enrolling").hide();
	}
	$(".chk_status").each(function() {
		$(this).bind("click", function() { return false; } );
		var src = "#" + $(this).attr('id').replace('_status', '_updated_at');
		if ($(src).val() != "") { $(this).attr("checked", "checked"); }
	});
});

