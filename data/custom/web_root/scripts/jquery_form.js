// jquery calls to set up a PowerSchool form
// requires jquery.js, fmt_date.js, formatters.js and selectlists.js

function init_checklist(obj) {
	var a = $("#"+obj.id).val().split(/[, \t\r\n]+/);
	var alen = a.length;
	for (var i = 0; i < alen; i++) {
		var val = a[i].replace(/^\s+|\s+$/g, '').toLowerCase();
		if (val != "") {
			$("."+obj.id+"_list").each( function() { 
				if ($(this).val().toLowerCase() == val) {
					$(this).attr("checked", "checked");
				}
			});
		}
	}
}

function pack_checklist(obj) {
	var ret = "";
	$("."+obj.id+"_list:checked").each( function() {
		var val = $(this).val();
		if (val != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + val.toLowerCase();
		}
	});
	return ret;
}

// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
$(document).ready(function() {
	// do stuff when user submits
	$("#attSubmitButton").bind("click", function(e) { 
		$("select.mselect").each( function() {
			$("#"+this.id+"_data").val(pack_multi_select(this)); });
		$(".checklist").each( function() { 
			$(this).val(pack_checklist(this)); });
		$("#upd_by").val($("#userid").val()); 
		$("#upd_at").val(timestamp_now()); return true; });
	// format field values for specific input types
	$("input.first").bind("blur", function(e) { 
		this.value = ucfirst(this.value); });
	$("input.last").bind("blur", function(e) { 
		this.value = uclastword(this.value); });
	$("input.street").bind("blur", function(e) { 
		this.value = ucwords(this.value); });
	$("input.city").bind("blur", function(e) { 
		this.value = ucwords(this.value); });
	$("input.state").bind("blur", function(e) { 
		this.value = this.value.toUpperCase(); });
	$("input.email").bind("blur", function(e) { 
		this.value = this.value.toLowerCase(); });
	$("input.phone").bind("blur", function(e) { 
		this.value = na_phone(this.value, "415"); });
	// do stuff when page is loaded
	$(".private").hide();
	$("select.mselect").each( function() {
		init_multi_select(this, $("#"+this.id+"_data").val()); });
	$(".checklist").each( function() { init_checklist(this); });
	// blank contents have &nbsp; in them; how do I search for these?
	// :contains('&nbsp;') doesn't work
	$(".hideblank .contents").each( function() {
		if ($(this).is(":not(:contains('@'))")) { $(this).parent().hide(); } });
});