// scripts for usernames, etc

function generate_h1_id() {
  var fam_ident = $j("#h1_id").val();
  if (fam_ident == '' || fam_ident.length != 8) {
    var last_name = $j("#st_last").val();
    var fam_ident = new_ps_fam_ident(last_name, false);
    $j("#h1_id").val(fam_ident);
  } 
}
  
function generate_h1_login() {
  if ($j("#h1_login").val() == '') {
    var sn = $j("#st_id").val();
    var last_name = $j("#st_last").val();
    $j("#h1_login").val(new_ps_username(last_name, false, sn));
  }
  if ($j("#h1_password").val() == '') {
    $j("#h1_password").val(new_ps_password());
  }
  $j("#h1_web_access").prop('checked', true);
}

function generate_psst_login() {
  if ($j("#psst_login").val() == '') {
    var sn = $j("#st_id").val();
    var last_name = $j("#st_last").val();
    $j("#psst_login").val(new_ps_username(last_name, true, sn));
  }
  if ($j("#psst_password").val() == '') {
    $j("#psst_password").val(new_ps_password());
  }
  $j("#psst_web_access").prop('checked', true);
}

function generate_st_login() {
  var middle_school = ($j("#st_school").val() == '104');
  if ($j("#st_login").val() == '') {
    var last_name = $j("#st_last").val();
    var first_name = $j("#st_first").val();
    $j("#st_login").val(new_student_username(last_name, first_name, middle_school));
  }
  if ($j("#st_password").val() == '') {
    $j("#st_password").val(new_student_password(middle_school));
  }
}

// lame function table
var genpass_fptrs = new Array();
genpass_fptrs['generate_h1_id'] = generate_h1_id;
genpass_fptrs['generate_h1_login'] = generate_h1_login;
genpass_fptrs['generate_psst_login'] = generate_psst_login;
genpass_fptrs['generate_st_login'] = generate_st_login;

function bind_login_generators() {
  if ($j(".pwgen").length > 0) {
    $j(".pwgen").bind("click", function() {
      var func_name = $j(this).attr("id");
      genpass_fptrs[func_name]();
    });
  }
}

function todayIfBlank(val) {
  if (val === '') {
    val = today_mdy();
  }
  return val;
}

function get_school_year(mo, yr) {
  if (mo <= 6) {
    yr = yr - 1;
  }
  var reg_year = yr + '-' + (yr + 1);
  return reg_year;  
}

// regform status page
function setup_reg_year() {
  var today = new Date();
  var tda = today.getDate();
  var tmo = today.getMonth() + 1;
  var tyr = today.getFullYear();
  var cur_year  = get_school_year(tmo, tyr);
  var next_year = get_school_year(tmo, tyr+1);

  var reg_year = $j('#orig_reg_year').val();
  if (reg_year) {
    reg_year = $j.trim(reg_year);
  }
  if (!reg_year) {
    var entrydate = $j('#orig_entrydate').val();
    var enroll_status = parseInt($j('#enroll_status').val())
    if (!entrydate) {
      entrydate = tmo + "/" + tda + "/" + tyr;
    }
    var mdy = entrydate.match(/(\d+)\/\d+\/(\d+)/);
    if (mdy) {
      var mo = parseInt(mdy[1]);
      var yr = parseInt(mdy[2]);
      reg_year = get_school_year(mo, yr)
    }
  }
  
  // Set up select list
  // Add this year and next year
  var sel = $j('#reg_school_year');
  sel.empty();
  sel.append('<option value="">Choose:</option>');
  if (cur_year) {
    sel.append('<option value="' + cur_year + '">' + cur_year + ' (Current Year)</option>');
  }
  if (next_year) {
    sel.append('<option value="' + next_year + '">' + next_year + ' (Next Year)</option>');
  }
  // Add registered year if not in list
  if (reg_year && reg_year != cur_year && reg_year != next_year) {
    sel.append('<option value="' + reg_year + '">' + reg_year + '</option>');
  }
  
  if (reg_year) {
    sel.val(reg_year); // select input
    $j('.reg_year').val(reg_year); // text 
    $j('.for_reg_year').text('for ' + reg_year + ' School Year'); // text
  }
}

function update_reg_year() {
 var reg_year = $j('#reg_school_year').val(); 
 $j('.reg_year').val(reg_year);
 $j('.for_reg_year').text('for ' + reg_year + ' School Year');
}

function check_reg_updated_at(dt) {
  dt = dt.match(/^(\d\d\d\d-\d\d-\d\d)/);
  return dt && dt[1] /* && dt[1].localeCompare('2013-03-25') >= 0 */;
}

function on_enrollment_change() {
  var enrollment = $j("#reg_enroll option:selected").val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    $j("tr.enrolling").hide();
    $j("tr.not_enrolling").show();
  } else { 
    $j("tr.enrolling").show(); 
    $j("tr.not_enrolling").hide();
    var grade = $j("#reg_grade_level").val();
    if (grade != null && grade != "" && grade != "-1") {
      grade = "grade_" + grade;
    } else {
      grade = null;
    }
    $j("tr.enrolling").each(function(i, el) {
      if ($j(this).hasClass("by_grade") && (!grade || !$j(this).hasClass(grade))) {
        $j(this).hide();
      }
    });
  }
  return true;
}

// happy.js validations
$j(document).ready(function () {
  $j('#form01').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.reg_enroll': {
        required: true,
        message: 'Required field.' }
    }
  });

  setup_reg_year();
  bind_login_generators();

  $j("#reg_enroll").bind("change", function() { on_enrollment_change(); });
  $j("#reg_grade_level").bind("change", function() { on_enrollment_change(); });
  on_enrollment_change();
});
