// jquery calls to set up a PowerSchool form
// requires jquery.js, fmt_date.js, formatters.js and selectlists.js

function init_checklist(obj) {
  jQuery("#"+obj.id).hide();
	var a = jQuery("#"+obj.id).val().split(/[, \t\r\n]+/);
	var alen = a.length;
	for (var i = 0; i < alen; i++) {
		var val = a[i].replace(/^\s+|\s+$/g, '').toLowerCase();
		if (val != "") {
			jQuery("."+obj.id+"_list").each( function() { 
				if (jQuery(this).val().toLowerCase() == val) {
					jQuery(this).attr("checked", "checked");
				}
			});
		}
	}
}

function pack_checklist(obj) {
	var ret = "";
	jQuery("."+obj.id+"_list:checked").each( function() {
		var val = jQuery(this).val();
		if (val != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + val.toLowerCase();
		}
	});
	alert("pack_checklist(" + obj.id + "), setting val to '" + ret + "'");
	jQuery("#"+obj.id).val(ret);
	return ret;
}

function ethn2_allowed() {
	var primary_ethn = jQuery("#ethnicity option:selected").val();
	if (primary_ethn == "" || primary_ethn == "999") {
		jQuery(".ethn2").attr("disabled", "disabled");
	} else {
		jQuery(".ethn2").removeAttr("disabled");
		jQuery("#ethn2_" + primary_ethn).removeAttr("checked").attr("disabled", "disabled");
	}
}

function set_form_updated() {
	jQuery("#upd_by").val(jQuery("#userid").val()); 
	jQuery("#upd_at").val(timestamp_now()); 
	return true;
}

// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
jQuery(document).ready(function() {
	// do stuff when user submits
	jQuery("#attSubmitButton").bind("click", function(e) { 
		jQuery("select.mselect").each( function() {
			jQuery("#"+this.id+"_data").val(pack_multi_select(this)); });
		jQuery(".checklist").each( function() { 
			pack_checklist(this); });
		if (!jQuery("#upd_by").hasClass("disabled")) { set_form_updated(); }
	});
	// format field values for specific input types
	jQuery("#admin_update").bind("click", function() {
		if (jQuery("#admin_update").attr("checked")) { set_form_updated(); }
	});
	jQuery(".copyfields").bind("click", function(e) {
		jQuery("."+jQuery(this).attr("id")).each( function() {
			var src = "#"+jQuery(this).attr("id")+"_src";
			jQuery(this).val(jQuery(src).val());
		});
	});
	jQuery("#ethnicity").bind("change", function(e) { ethn2_allowed(); } );
	jQuery("input.first").bind("blur", function(e) { 
		this.value = ucfirst(this.value); });
	jQuery("input.last").bind("blur", function(e) { 
		this.value = uclastword(this.value); });
	jQuery("input.street").bind("blur", function(e) { 
		this.value = ucwords(this.value); });
	jQuery("input.city").bind("blur", function(e) { 
		this.value = ucwords(this.value); });
	jQuery("input.state").bind("blur", function(e) { 
		this.value = this.value.toUpperCase(); });
	jQuery("input.email").bind("blur", function(e) { 
		this.value = this.value.toLowerCase(); });
	jQuery("input.phone").bind("blur", function(e) { 
		this.value = na_phone(this.value, "415"); });
	// do stuff when page is loaded
	jQuery(".private").hide();
	jQuery("select.mselect").each( function() {
		init_multi_select(this, jQuery("#"+this.id+"_data").val()); });
	ethn2_allowed();
	jQuery(".checklist").each( function() { init_checklist(this); });
	// blank contents have &nbsp; in them; how do I search for these?
	// :contains('&nbsp;') doesn't work
	jQuery(".hideblank .contents").each( function() {
		if (jQuery(this).is(":not(:contains('@'))")) { jQuery(this).parent().hide(); } });
});