function todayIfBlank(val) {
  if (val === '') {
    val = today_mdy();
  }
  return val;
}

// happy.js validations
jq15(document).ready(function () {
  jq15('#forms').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    // onSubmit: onRegFormSubmit,
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
});