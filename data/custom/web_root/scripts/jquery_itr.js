
function generate_h1_login() {
  if (jq15("#h1_id").val() == '') {
    jq15("#h1_id").val(jq15("#st_id").val());
  }
  if (jq15("#h1_login").val() == '') {
    jq15("#h1_login").val(new_ps_username(jq15("#st_last").val(), 0));
  }
  if (jq15("#h1_password").val() == '') {
    jq15("#h1_password").val(new_ps_password());
  }
  jq15("#h1_web_access").attr("checked", "checked");
}

function generate_h2_number() {
  if (jq15("#h2_id").val() == '') {
    var st_id = jq15("#st_id").val();
    if (st_id != '') { jq15("#h2_id").val(parseInt(st_id) + 100000); }
  }
}

function generate_psst_login() {
  if (jq15("#psst_login").val() == '') {
    jq15("#psst_login").val(new_ps_username(jq15("#st_last").val(), 1));
  }
  if (jq15("#psst_password").val() == '') {
    jq15("#psst_password").val(new_ps_password());
  }
  jq15("#psst_web_access").attr("checked", "checked");
}

function generate_st_login() {
  var middle_school = (jq15("#st_school").val() == '104');
  if (jq15("#st_login").val() == '') {
    jq15("#st_login").val(new_student_username(jq15("#st_last").val(), jq15("#st_first").val(), middle_school));
  }
  if (jq15("#st_password").val() == '') {
    jq15("#st_password").val(new_student_password(middle_school));
  }
}

// lame function table
var genpass_fptrs = new Array();
genpass_fptrs['generate_h1_login'] = generate_h1_login;
genpass_fptrs['generate_h2_number'] = generate_h2_number;
genpass_fptrs['generate_psst_login'] = generate_psst_login;
genpass_fptrs['generate_st_login'] = generate_st_login;

function on_enrollment_change() {
  var enrollment = jq15("#reg_enroll option:selected").val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    jq15("tr.enrolling").hide(); 
    jq15("tr.not_enrolling").show();
  } else { 
    jq15("tr.enrolling").show(); 
    jq15("tr.not_enrolling").hide();
    on_grade_level_change();
  }
  return true;
}

function on_grade_level_change() {
  jq15("tr.by_grade").hide();
  var grade = jq15("#reg_grade_level option:selected").val();
  if (grade != "" && grade != "-1") {
    jq15("tr.by_grade").filter(".grade_" + grade).show();
  }
  return true;
}

function set_form_updated() {
  jq15("#upd_by").val(jq15("#userid").val()); 
  jq15("#upd_at").val(timestamp_now()); 
  return true;
}

function set_entry_dates(force) {
  jq15(".entry_date").each(function() {
    if (force || (jq15(this).val() == '')) { 
      if (jq15("#entry_date").is("input")) {
        jq15(this).val(jq15("#entry_date").val()); 
      } else {
        jq15(this).val(jq15("#entry_date").text()); 
      }
    }
  });
  jq15(".entry_grade_level").each(function() {
    if (force || (jq15(this).val() == '')) { 
      jq15(this).val(jq15("#grade_level").text()); 
    }
  });
}

function bind_login_generators() {
  if (jq15(".pwgen").length > 0) {
    jq15(".pwgen").bind("click", function() {
      var func_name = jq15(this).attr("id");
      genpass_fptrs[func_name]();
    });
  }
}

// change the prompts if student is not returning
function onItrFormSubmit() {
  if (!jq15("#upd_by").hasClass("disabled")) { set_form_updated(); }  
  var enrollment = jq15("#reg_enroll option:selected").val();
  var not_enrolling = (enrollment != null && enrollment.indexOf("nr-") == 0);
  if (not_enrolling) {
    jq15("#nextpage").val('');
    jq15("#nexttitle").val('');
    var new_title = jq15("#donetitle").val();
    if (new_title != '') {
      jq15("#backtitle").val(new_title);
    }
  }
}

// intent to return form
jq15(document).ready(function() {
  // when user submits - now handled by happy.js configuration
  // do stuff when page is loaded
  jq15("#admin_update").bind("click", function() {
    if (jq15("#admin_update").attr("checked")) { set_form_updated(); }
  });
  jq15("#entry_check").bind("click", function() { set_entry_dates(1); });
  jq15("#reg_enroll").bind("change", function() { on_enrollment_change(); });
  jq15("#reg_grade_level").bind("change", function() { on_grade_level_change(); });
  bind_login_generators();
  jq15(".private").hide();
  on_enrollment_change();
});

