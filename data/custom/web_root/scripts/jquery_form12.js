function displayListing() {
  var sample_rows = $j('#listing .sample');
  var actual_rows = $j('#listing #sample_last').nextAll();
  var has_actual = (actual_rows.size() > 1);
  if (has_actual) {
    sample_rows.hide();
  } else {
    actual_rows.hide();
  }
}

// happy.js validations
$j(document).ready(function () {
  displayListing();
  $j('#form12').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.kikdir_options': {
        required: true,
        message: 'Required field.' }
    }
  });
});
