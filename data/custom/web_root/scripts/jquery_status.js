// intent to return form
$(document).ready(function() {
	$(".chk_status").each(function() {
		$(this).bind("click", function() { return false; } );
		var src = "#" + $(this).attr('id').replace('_status', '_updated_at');
		if ($(src).val() != "") { $(this).attr("checked", "checked"); }
	});
});

