function displayListing() {
  var sample_rows = jq15('#listing .sample');
  var actual_rows = jq15('#listing #sample_last').nextAll();
  var has_actual = (actual_rows.size() > 1);
  if (has_actual) {
    sample_rows.hide();
  } else {
    actual_rows.hide();
  }
}

// happy.js validations
jq15(document).ready(function () {
  displayListing();
  jq15('#form10').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.kikdir_options': {
        required: true,
        message: 'Required field.' }
    }
  });
});
