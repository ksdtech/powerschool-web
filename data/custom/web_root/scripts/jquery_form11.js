// happy.js validations
$j(document).ready(function () {
  $j('#form11').isHappy({
    // submitButton: $j('#attSubmitButton'),
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
