// happy.js validations
$j(document).ready(function () {
  $j('#form7').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '#first_usa_school': {
        required: 'sometimes',
        test: happy.emptyOrDate,
        message: 'Please enter in format M/D/YYYY.' },
      '.immigrant': { 
        required: true,
        message: 'Required field.' },
      '.hispanic_ethnicity': { 
        required: true,
        message: 'Required field.' },
      '#parent_edu': {
        required: true,
        message: 'Required field.' }
    }
  });
});