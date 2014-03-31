// happy.js validations
$j(document).ready(function () {
  $j('#form8').isHappy({
    // submitButton: $j('#attSubmitButton'),
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