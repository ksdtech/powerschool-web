// happy.js validations
jq15(document).ready(function () {
  jq15('#forms').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit,,
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
        message: 'Please give the name of the school, or type \"Don\'t know.\"' }
      '.responsibility_for_student': {
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