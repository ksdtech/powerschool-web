function setup_nexturl() {
  var enrollment = $j("#reg_enroll").val();
  var not_enrolling = (enrollment && /^nr-/.test(enrollment));
  var grade = $j("#reg_grade_level").val();
  if (grade == null || grade == "") {
    grade = -1;
  } else {
    grade = parseInt(grade);
  }
  if (not_enrolling || grade < 5) {
    $j("#nexturl").val("01-registration.html#acknowledgement");
    $j("#nexttitle").val("Acknowledgement and Signature");
    $j("#nextdesc").val("This is the last registration form. After returning to main registration page, scroll down to the Acknowledgement and Responsibility for Student section, sign, date and click the Submit button.")
  }
}

function setup_reg_year() {
  var reg_year = $j('#orig_reg_year').val();
  if (reg_year) {
    $j('.reg_year').text(reg_year); // span 
  }
}

// happy.js validations
$j(document).ready(function () {
  setup_nexturl();
  setup_reg_year();

  $j('#form10').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.annual_notice': {
        required: true,
        message: 'Required field.' },
      '.release_directory_info': {
        required: true,
        message: 'Required field.' },
      '.previous_school_contact': {
        required: true,
        message: 'Required field.' },
      '#emergency_hospital': {
        required: true,
        message: 'Required field.' },
      '.emergency_care': {
        required: true,
        message: 'Required field.' },
      '.ipm_notifications': {
        required: true,
        message: 'Required field.' },
      '.off_campus_walks': {
        required: true,
        message: 'Required field.' },
      '.acceptable_use': {
        required: true,
        message: 'Required field.' },
      '.computer_use': {
        required: true,
        message: 'Required field.' },
      '.google_apps': {
        required: true,
        message: 'Required field.' },
      '.social_learning': {
        required: true,
        message: 'Required field.' },
      '.publish_images': {
        required: true,
        message: 'Required field.' },
      '.publish_articles': {
        required: true,
        message: 'Required field.' },
      '.publish_works': {
        required: true,
        message: 'Required field.' }
    }
  });
});