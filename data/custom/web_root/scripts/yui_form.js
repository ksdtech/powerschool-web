// uses yui module pattern 
// see http://yuiblog.com/blog/2007/06/12/module-pattern
YAHOO.namespace("ksdregform");

// regform handler
YAHOO.ksdregform.FormHandler = function() {
	var Dom = YAHOO.util.Dom;
	var Event = YAHOO.util.Event;
	
	var init_checklist = function(el) {
		var ar_list = Dom.getElementsByClassName(el.id + "_list");
		var a = el.value.split(/[, \t\r\n]+/);
		var alen = a.length;
		for (var i = 0; i < alen; i++) {
			var val = a[i].replace(/^\s+|\s+$/g, '').toLowerCase();
			if (val != "") {
				Dom.batch(ar_list, function(el) { 
					if (el.value.toLowerCase() == val) {
						el.checked = true;
					}
				});
			}
		}
	}

	var pack_checklist = function(el) {
		var ret = "";
		var ar_list = Dom.getElementsByClassName(el.id + "_list");
		Dom.batch(ar_list, function(el) {
			if (el.checked) {
				var val = el.value;
				if (val != "") {
					if (ret != "") { ret = ret + ","; }
					ret = ret + val.toLowerCase();
				}
			}
		});
		return ret;
	}

	var set_form_updated = function() {
		Dom.get("upd_by").value = Dom.get("userid").value;
		Dom.get("upd_at").value = timestamp_now(); 
		return true;
	}

	var on_ethnicity_change = function(e) {
		var ar_ethn2 = Dom.getElementsByClassName("ethn2");
		var sel_ethn = YAHOO.util.getTarget(e);
		var primary_ethn = sel_ethn.options[sel_ethn.selectedIndex].value;
		if (primary_ethn == "" || primary_ethn == "999") {
			Dom.batch(ar_ethn2, function(el) { el.disabled = true; });
		} else {
			Dom.batch(ar_ethn2, function(el) { el.disabled = false; });
			var ethn2_class = "ethn2_" + primary_ethn;
			ar_ethn2 = Dom.getElementsByClassName(ethn2_class);
			Dom.batch(ar_ethn2, function(el) {
				el.checked = false;
				el.disabled = true;
			});
		}
	}

	var on_copyfield_click = function(e) {
		var el = Event.getTarget(e);
		var ar_dest = Dom.getElementsByClassName(el.id);
		Dom.batch(ar_dest, function(el) {
			el.value = Dom.get(el.id + "_src").value;
		});	
	}

	var on_submit = function(e) {
		var ar_mselect = Dom.getElementsByClassName("mselect", "select");
		Dom.batch(ar_mselect, function(el) {
			Dom.get(el.id + "_data").value = pack_multi_select(el); 
		});
		var ar_checklist = Dom.getElementsByClassName("checklist");
		Dom.batch(ar_checklist, function(el) { 
			el.value = pack_checklist(el);
		});
		if (!Dom.hasClass("upd_by", "disabled")) { set_form_updated(); }
	}

	return {
		// encode the field type in the class of the input (text field)
		// form should also have three hidden fields with these ids:
		//  #userid (no name) should have a value of ~[x:userid]
		//  #upd_by should use a custom field name like [05]form0_updated_by
		//  #upd_at should use a custom field name like [05]form0_updated_at
		init: function() {
			// do stuff when user submits
			Event.addListener("attSubmitButton", "click", on_submit, this, true); 
			// format field values for specific input types
			Event.addListener("admin_update", "click", function(e) {
				var el = Event.getTarget(e);
				if (el.checked) { set_form_updated(); } }, this, true);
			var ar_copyfields = Dom.getElementsByClassName("copyfields");
			Event.addListener(ar_copyfields, "click", on_copyfield_click, this, true);
			Event.addListener("ethnicity", "change", on_ethnicity_change, this, true);
			var input_first = Dom.getElementsByClassName("first", "input");
			Event.addListener(input_first, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = ucfirst(el.value); }, this, true);
			var input_last = Dom.getElementsByClassName("last", "input");
			Event.addListener(input_last, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = uclastword(el.value); }, this, true);
			var input_street = Dom.getElementsByClassName("street", "input");
			Event.addListener(input_street, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = ucwords(el.value); }, this, true);
			var input_city = Dom.getElementsByClassName("city", "input");
			Event.addListener(input_city, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = ucwords(el.value); }, this, true);
			var input_state = Dom.getElementsByClassName("state", "input");
			Event.addListener(input_state, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = el.value.toUpperCase(); }, this, true);
			var input_email = Dom.getElementsByClassName("email", "input");
			Event.addListener(input_email, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = el.value.toLowerCase(); }, this, true);
			var input_phone = Dom.getElementsByClassName("phone", "input");
			Event.addListener(input_phone, "blur", function(e) { 
				var el = Event.getTarget(e);
				el.value = na_phone(el.value, "415"); }, this, true);
			// do stuff when page is loaded
			Dom.setStyle(Dom.getElementsByClassName("private"), "visibility", "hidden");
			var ar_mselect = Dom.getElementsByClassName("mselect", "select");
			Dom.batch(ar_mselect, function(el) {
				var el_src = Dom.get(this.id + "_data");
				init_multi_select(el, el_src.value); 
			});
			ethn2_allowed();
			var ar_checklist = Dom.getElementsByClassName("checklist");
			Dom.batch(ar_checklist, function(el) { init_checklist(el); });
			var ar_hideblank = Dom.getElementsByClassName("hideblank");
			Dom.batch(ar_hideblank, function(el) {
				var ar_contents = Dom.getElementsByClassName("contents", el);
				Dom.batch(ar_contents, function(ec) {
					var txt = ec.innerText || ec.textContent;
					// blank contents have &nbsp; in them; how do I search for these?
					if (txt.indexOf("@") == -1) {
						Dom.setStyle(el, "visibility", "hidden");
					}
				});
			});
		}
	}
	
}();

YAHOO.util.Event.onDOMReady(YAHOO.ksdregform.FormHandler.init, YAHOO.ksdregform.FormHandler, true);

