// uses yui module pattern 
// see http://yuiblog.com/blog/2007/06/12/module-pattern
YAHOO.namespace("ksdregform");

// intent to return handler
YAHOO.ksdregform.ItrHandler = function() {
	var Dom = YAHOO.util.Dom;
	var Event = YAHOO.util.Event;
	
	var generate_h1_login = function() {
		var h1_id = Dom.get("h1_id")
		if (h1_id.value == '') {
			h1_id.value = Dom.get("st_id").value;
		}
		var h1_login = Dom.get("h1_login");
		if (h1_login.value == '') {
			h1_login.value = new_ps_username(Dom.get("st_last").value, 0);
		}
		var h1_password = Dom.get("h1_password");
		if (h1_password.value == '') {
			h1_password.value = new_ps_password();
		}
		Dom.get("h1_web_access").checked = true;
	}

	var generate_h2_login = function() {
		var h2_id = Dom.get("h2_id");
		if (h2_id.value == '') {
			var st_id = Dom.get("st_id").value;
			if (st_id != '') { h2_id.value = parseInt(st_id) + 100000; }
		}
		var h2_login = Dom.get("h2_login");
		if (h2_login.value == '') {
			h2_login.value = new_ps_username(Dom.get("st_last").value, 1);
		}
		var h2_password = Dom.get("h2_password");
		if (h2_password.value == '') {
			h2_password.value = new_ps_password();
		}
		Dom.get("h2_web_access").checked = true;
	}

	var generate_st_login = function() {
		var middle_school = (Dom.get("st_school").value == '104');
		var st_login = Dom.get("st_login");
		if (st_login.value == '') {
			st_login.value = new_student_username(Dom.get("st_last").value, Dom.get("st_first").value, middle_school);
		}
		var st_password = Dom.get("st_password");
		if (st_password.value == '') {
			st_password.value = new_student_password(middle_school);
		}
	}

	var genpass_fptrs = new Array();
	genpass_fptrs['generate_h1_login'] = generate_h1_login;
	genpass_fptrs['generate_h2_login'] = generate_h2_login;
	genpass_fptrs['generate_st_login'] = generate_st_login;

	var on_grade_level_change = function(e) {
		var ar_by_grade = Dom.getElementsByClassName("by_grade", "tr");
		Dom.setStyle(ar_by_grade, "visibility", "hidden");
		var sel_grade = Dom.get("reg_grade_level");
		var grade = sel_grade.options[sel_grade.selectedIndex].value;
		if (grade != "" && grade != "-1") {
			var grade_class = "grade_" + grade;
			Dom.batch(ar_by_grade, function(el) {
				if (Dom.hasClass(el, grade_class)) {
					Dom.setStyle(el, "visibility", "visible");
				}
			});
		}
		return true;
	}

	var on_enrollment_change = function(e) {
		var sel_enroll = Dom.get("reg_enroll");
		var enrollment = sel_enroll.options[sel_enroll.selectedIndex].value;
		var not_enrolling = (enrollment.indexOf("nr-") == 0);
		if (not_enrolling) { 
			Dom.setStyle(Dom.getElementsByClassName("enrolling", "tr"), "visibility", "hidden");
			Dom.setStyle(Dom.getElementsByClassName("not_enrolling", "tr"), "visibility", "visible");
		} else { 
			Dom.setStyle(Dom.getElementsByClassName("enrolling", "tr"), "visibility", "visible");
			Dom.setStyle(Dom.getElementsByClassName("not_enrolling", "tr"), "visibility", "hidden");
			on_grade_level_change();
		}
		return true;
	}

	var set_form_updated = function() {
		Dom.get("upd_by").value = Dom.get("userid").value;
		Dom.get("upd_at").value = timestamp_now(); 
		return true;
	}

	var set_entry_dates = function(force) {
		var el_date = Dom.get("entry_date");
		var entry_date = el_date.value || el_date.innerText || el_date.textContent;
		var a_entry_date = Dom.getElementsByClassName("entry_date");
		Dom.batch(a_entry_date, function(el) {
			if (force || el.value == "") { 
				el.value = entry_date;
			}
		});
		var el_grade = Dom.get("grade_level");
		var entry_grade = el_grade.value || el_grade.innerText || el_grade.textContent;
		var a_grade_level = Dom.getElementsByClassName("entry_grade_level");
		Dom.batch(a_grade_level, function(el) {
			if (force || el.value == "") { 
				el.value = entry_grade;
			}
		});
	}

	var on_entry_dates = function(e) {
		set_entry_dates(1);
	}

	var bind_login_generators = function() {
		var a_pwgen = Dom.getElementsByClassName("pwgen");
		if (a_pwgen.length > 0) {
			Event.addListener(a_pwgen, "click", function(e) {
				var el = Event.getTarget(e);
				var func_name = el.id;
				genpass_fptrs[func_name]();
			}, this, true);
		}
	}

	return {
		init: function() {
			
			// do stuff when user submits
			Event.addListener("attSubmitButton", "click", function(e) {
				if (!Dom.hasClass("upd_by", "disabled")) { set_form_updated(); } }, this, true);
			// change display based on selections
			Event.addListener("admin_update", "click", function(e) {
				var el = Event.getTarget(e);
				if (el.checked) { set_form_updated(); } }, this, true);
			Event.addListener("entry_check", "click", on_entry_dates, this, true);
			Event.addListener("reg_enroll", "change", on_enrollment_change, this, true);
			Event.addListener("reg_grade_level", "change", on_grade_level_change, this, true);
			// do stuff when page is loaded
			bind_login_generators();
			var a_private = Dom.getElementsByClassName("private");
			Dom.setStyle(a_private, "visibility", "hidden");
			on_enrollment_change();
		}
	}
}();

YAHOO.util.Event.onDOMReady(YAHOO.ksdregform.ItrHandler.init, YAHOO.ksdregform.ItrHandler, true);
