// Validation for form1
// happy.js validations
jq15(document).ready(function () {
  jq15('#form1').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onItrFormSubmit
  });
});