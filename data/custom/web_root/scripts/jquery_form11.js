// happy.js validations
jq15(document).ready(function () {
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
