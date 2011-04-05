// happy.js validations
jq15(document).ready(function () {
  jq15('#form7').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '#lang_earliest': {
        required: true,
        message: 'Required field.' },
      '#lang_primary': {
        required: true,
        message: 'Required field.' },
      '#lang_spoken': {
        required: true,
        message: 'Required field.' },
      '#lang_adults': {
        required: true,
        message: 'Required field.' }
    }
  });
});