// jquery calls to set up a PowerSchool form
// requires jquery.js, fmt_date.js, formatters.js and selectlists.js

function pack_checklist(obj) {
	var ret = "";
	$("."+obj.id+"_list:checked").each( function() {
		var val = $(this).val();
		if (val != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + val;
		}
	});
	alert("returning "+ret);
	return ret;
}

// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
$(document).ready(function() {
	// do stuff when DOM is ready
	$("select.mselect").each( function() {
		init_multi_select(this, $("#"+this.id+"_data").val()); });
	$(".hideblank .contents").each( function() {
		if ($(this).is(":empty")) { $(this).parent().hide(); } });
	// do stuff when user blurs
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
	// do stuff when user submits
	$("#attSubmitButton").bind("click", function(e) { 
		$("select.mselect").each( function() {
			$("#"+this.id+"_data").val(pack_multi_select(this)); });
		$(".checklist").each( function() { 
			$(this).val(pack_checklist(this)); });
		$("#upd_by").val($("#userid").val()); 
		$("#upd_at").val(timestamp_now()); return true; });
});