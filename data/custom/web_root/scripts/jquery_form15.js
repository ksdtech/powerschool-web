// Validation for form10

function returning_to_grade(gl) {
  var enrollment = $j('#reg_enroll').val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) {
    return false;
  }
  var grade = $j('#reg_grade_level').val();
  return (grade == gl);
}

function required_if_6(val) {
  if (!returning_to_grade('6'))
    return true;
  return !(val === '');
}

function required_if_7(val) {
  if (!returning_to_grade('7'))
    return true;
  return !(val === '');
}

function required_if_8(val) {
  if (!returning_to_grade('8'))
    return true;
  return !(val === '');
}

function filter_by_enrollment() {
  var enrollment = $j("#reg_enroll").val();
  var not_enrolling = (enrollment  && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    $j("tr.enrolling").hide(); 
  } else { 
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
}

// happy.js validations
$j(document).ready(function () {
  filter_by_enrollment();
  
  $j('#form15').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.electives_6_pa': {
        required: 'sometimes',
        test: required_if_6,
        message: 'Please choose Band or Chorus' },
      '.electives_7_band': {
        required: 'sometimes',
        test: required_if_7,
        message: 'Please choose Yes or No' },
      '.electives_7_choir': {
        required: 'sometimes',
        test: required_if_7,
        message: 'Please choose Yes or No' },
      '.electives_8_band': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose Yes or No' },
      '.electives_8_choir': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose Yes or No' }
    }
  });
});