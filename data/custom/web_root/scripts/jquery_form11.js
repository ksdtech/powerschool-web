// happy.js validations
jq15(document).ready(function () {
  jq15('#form10').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.pta_contact': {
        required: true,
        message: 'Required field.' },
      '.pta_room_parent': {
        required: true,
        message: 'Required field.' }
    }
  });
});
