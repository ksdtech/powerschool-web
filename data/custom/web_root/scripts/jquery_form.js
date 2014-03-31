// jquery calls to set up a PowerSchool form
// requires jquery-1.5.1.min.js, fmt_date.js, formatters.js and selectlists.js

function init_checklist(obj) {
  $j("#"+obj.id).hide();
	var a = $j("#"+obj.id).val().split(/[, \t\r\n]+/);
	var alen = a.length;
	for (var i = 0; i < alen; i++) {
		var val = a[i].replace(/^\s+|\s+$/g, '').toLowerCase();
		if (val != "") {
			$j("."+obj.id+"_list").each( function() { 
				if ($j(this).val().toLowerCase() == val) {
					$j(this).attr("checked", "checked");
				}
			});
		}
	}
}

function pack_checklist(obj) {
	var ret = "";
	$j("."+obj.id+"_list:checked").each( function() {
		var val = $j(this).val();
		if (val != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + val.toLowerCase();
		}
	});
	$j("#"+obj.id).val(ret);
	return ret;
}

function select_one(osel, str) {
	if (str == "") { return -1; }
	var opts = osel.options;
	var olen = opts.length;
	for (var i = 0; i < olen; i++) {
		if (opts[i].value == str) {
			opts[i].selected = true;
			return i;
		}
	}
	return -1;
}

function init_multi_select(osel, str) {
	var count = 0;
	var a = str.split(/[, \t\r\n]+/);
	var alen = a.length;
	for (var j = 0; j < alen; j++) {
		var val = a[j];
		if (select_one(osel, val) >= 0) {
			count = count + 1;
		}
	}
	return count;
}

function pack_multi_select(osel) {
	var ret = "";
	var opts = osel.options;
	var olen = opts.length;
	for (var i = 0; i < olen; i++) {
		if (opts[i].selected && opts[i].value != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + opts[i].value;
		}
	}
	return ret;
}

function set_form_updated() {
	$j("#upd_by").val($j("#userid").val()); 
	$j("#upd_at").val(timestamp_now()); 
	return true;
}

function onRegFormSubmit() {
	$j("select.mselect").each( function() {
		$j("#"+this.id+"_data").val(pack_multi_select(this)); });
	$j(".checklist").each( function() { 
		pack_checklist(this); });
	if (!$j("#upd_by").hasClass("disabled")) { set_form_updated(); }  
}

// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
$j(document).ready(function() {
	// when user submits - now handled by happy.js configuration
	// do stuff when page is loaded
	$j("#admin_update").bind("click", function() {
		if ($j("#admin_update").attr("checked")) { set_form_updated(); }
	});
	$j(".private").hide();
	$j("select.mselect").each( function() {
		init_multi_select(this, $j("#"+this.id+"_data").val()); });
	$j(".checklist").each( function() { init_checklist(this); });
	// blank contents have &nbsp; in them; how do I search for these?
	// :contains('&nbsp;') doesn't work
	$j(".hideblank .contents").each( function() {
		if ($j(this).is(":not(:contains('@'))")) { $j(this).parent().hide(); } });
});