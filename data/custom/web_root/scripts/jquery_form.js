// jquery calls to set up a PowerSchool form
// requires jquery.js, fmt_date.js and formatters.js
// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
$(document).ready(function() {
	// do stuff when DOM is ready
	$("#attSubmitButton").bind("click", function(e) { 
		$("#upd_by").val($("userid").val()); 
		$("#upd_at").val(timestamp_now()); });
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
});