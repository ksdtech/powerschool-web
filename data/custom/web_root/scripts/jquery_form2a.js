// Validation for form2
// happy.js validations
jq15(document).ready(function () {
  jq15('#form2').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onItrFormSubmit
  });
});