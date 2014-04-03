// Validation for form2

function required_if_not_returning(val) {
  var enrollment = $j('#reg_enroll option:selected').val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  var error = false;
  if (not_enrolling) {
    error = (val === '');
  }
  return !error;
}

function required_if_transfering(val) {
  var enrollment = $j('#reg_enroll option:selected').val();
  var not_enrolling = (enrollment != null && enrollment.indexOf('nr-') == 0);
  var error = false;
  if (not_enrolling) {
    var exitcode = $j('#reg_exitcode option:selected').val();
    if (exitcode != null && /^160|180$/.test(exitcode)) {
      error = (val === '');
    }
  }
  return !error;
}

function returning_to_grade(gl) {
  var enrollment = $j('#reg_enroll option:selected').val();
  var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) {
    return false;
  }
  var grade = $j('#reg_grade_level option:selected').val();
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

function set_up_reg_year() {
  var reg_year = $j.trim($j('#orig_reg_year').val());
  if (!reg_year) {
    var entrydate = $j('#orig_entrydate').val();
    var mdy = entrydate.match(/(\d+)\/\d+\/(\d+)/);
    if (mdy) {
      var mo = parseInt(mdy[1]);
      var yr = parseInt(mdy[2]);
      if (mo <= 6) {
        yr = yr - 1;
      }
      reg_year = yr + '-' + (yr + 1);
    }
    $j('.reg_year').val(reg_year);
    $j('.for_reg_year').val('for ' + reg_year + ' School Year');
  }
}

// happy.js validations
$j(document).ready(function () {
  set_up_reg_year();
  $j('#form2').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onItrFormSubmit,
    fields: {
      '#reg_enroll': {
        required: true,
        message: 'Required field: whether this student is re-enrolling or not.' },
      '#reg_exitcode': { 
        required: 'sometimes',
        test: required_if_not_returning,
        message: 'Please choose a reason from the list.' },
      '#reg_exitcomment': { 
        required: 'sometimes',
        test: required_if_transfering,
        message: 'Please give the name of the school, or type \"Don\'t know.\"' },
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
      '.electives_7_mathletes': {
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
        message: 'Please choose Yes or No' },
      '.electives_8_mathletes': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose Yes or No' },
      '.electives_8_yearbook': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose Yes or No' },
      '#electives_8_enrich1': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose an enrichment preference' },
      '#electives_8_enrich1': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose an enrichment preference' },
      '#electives_8_enrich1': {
        required: 'sometimes',
        test: required_if_8,
        message: 'Please choose an enrichment preference' }
    }
  });
});