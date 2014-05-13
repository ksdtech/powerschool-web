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

var scroll_to_el = null;

function delayed_scroll() {
  if (scroll_to_el) {
    scroll_to_el.scrollIntoView(true);
  }
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

  $j('#form16').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.resp_for_student': {
        required: true,
        message: 'Required field.' },
      '#responsibility_sig_1': {
        required: true,
        message: 'Required field.' },
      '#responsibility_date': {
        required: true,
        clean: todayIfBlank,
        test: happy.date,
        message: 'Required field. Format as M/D/YYYY.' }
    }
  });

  setup_reg_year();

  $j("#reg_enroll").bind("change", function() { on_enrollment_change(); });
  $j("#reg_grade_level").bind("change", function() { on_enrollment_change(); });
  on_enrollment_change();

  $j(".chk_status").each(function() {
    var src = "#" + $j(this).attr('id').replace('_status', '_updated_at');
    var dt = $j(src).val();
    if (check_reg_updated_at(dt)) { 
      $j(this).removeClass('feedback-alert').addClass('feedback-confirm');
    }
  });
  
  // attempt to scroll to element in URL
  var frag = window.location.hash;
  if (frag != "") {
    frag = frag.substring(1); 
    scroll_to_el = document.getElementById(frag);
    window.setTimeout(delayed_scroll, 200);
  }
});
