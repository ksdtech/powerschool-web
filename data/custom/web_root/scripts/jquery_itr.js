
function generate_h1_login() {
  if ($j("#h1_id").val() == '') {
    $j("#h1_id").val($j("#st_id").val());
  }
  if ($j("#h1_login").val() == '') {
    $j("#h1_login").val(new_ps_username($j("#st_last").val(), 0));
  }
  if ($j("#h1_password").val() == '') {
    $j("#h1_password").val(new_ps_password());
  }
  $j("#h1_web_access").attr("checked", "checked");
}

function generate_h2_number() {
  if ($j("#h2_id").val() == '') {
    var st_id = $j("#st_id").val();
    if (st_id != '') { $j("#h2_id").val(parseInt(st_id) + 100000); }
  }
}

function generate_psst_login() {
  if ($j("#psst_login").val() == '') {
    $j("#psst_login").val(new_ps_username($j("#st_last").val(), 1));
  }
  if ($j("#psst_password").val() == '') {
    $j("#psst_password").val(new_ps_password());
  }
  $j("#psst_web_access").attr("checked", "checked");
}

function generate_st_login() {
  var middle_school = ($j("#st_school").val() == '104');
  if ($j("#st_login").val() == '') {
    $j("#st_login").val(new_student_username($j("#st_last").val(), $j("#st_first").val(), middle_school));
  }
  if ($j("#st_password").val() == '') {
    $j("#st_password").val(new_student_password(middle_school));
  }
}

// lame function table
var genpass_fptrs = new Array();
genpass_fptrs['generate_h1_login'] = generate_h1_login;
genpass_fptrs['generate_h2_number'] = generate_h2_number;
genpass_fptrs['generate_psst_login'] = generate_psst_login;
genpass_fptrs['generate_st_login'] = generate_st_login;

function on_enrollment_change() {
  var enrollment = $j("#reg_enroll option:selected").val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    $j("tr.enrolling").hide(); 
    $j("tr.not_enrolling").show();
  } else { 
    $j("tr.enrolling").show(); 
    $j("tr.not_enrolling").hide();
    on_grade_level_change();
  }
  return true;
}

function on_grade_level_change() {
  $j("tr.by_grade").hide();
  var grade = $j("#reg_grade_level option:selected").val();
  if (grade != "" && grade != "-1") {
    $j("tr.by_grade").filter(".grade_" + grade).show();
  }
  return true;
}

function set_form_updated() {
  $j("#upd_by").val($j("#userid").val()); 
  $j("#upd_at").val(timestamp_now()); 
  return true;
}

function set_entry_dates(force) {
  $j(".entry_date").each(function() {
    if (force || ($j(this).val() == '')) { 
      if ($j("#entry_date").is("input")) {
        $j(this).val($j("#entry_date").val()); 
      } else {
        $j(this).val($j("#entry_date").text()); 
      }
    }
  });
  $j(".entry_grade_level").each(function() {
    if (force || ($j(this).val() == '')) { 
      $j(this).val($j("#grade_level").text()); 
    }
  });
}

function bind_login_generators() {
  if ($j(".pwgen").length > 0) {
    $j(".pwgen").bind("click", function() {
      var func_name = $j(this).attr("id");
      genpass_fptrs[func_name]();
    });
  }
}

// change the prompts if student is not returning
function onItrFormSubmit() {
  if (!$j("#upd_by").hasClass("disabled")) { set_form_updated(); }  
  var enrollment = $j("#reg_enroll option:selected").val();
  var not_enrolling = (enrollment != null && enrollment.indexOf("nr-") == 0);
  if (not_enrolling) {
    $j("#nextpage").val('');
    $j("#nexttitle").val('');
    var new_title = $j("#donetitle").val();
    if (new_title != '') {
      $j("#backtitle").val(new_title);
    }
  }
}

// intent to return form
$j(document).ready(function() {
  // when user submits - now handled by happy.js configuration
  // do stuff when page is loaded
  $j("#admin_update").bind("click", function() {
    if ($j("#admin_update").attr("checked")) { set_form_updated(); }
  });
  $j("#entry_check").bind("click", function() { set_entry_dates(1); });
  $j("#reg_enroll").bind("change", function() { on_enrollment_change(); });
  $j("#reg_grade_level").bind("change", function() { on_grade_level_change(); });
  bind_login_generators();
  $j(".private").hide();
  on_enrollment_change();
});

