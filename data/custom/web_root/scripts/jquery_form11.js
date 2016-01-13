// happy.js validations
$j(document).ready(function () {
  $j('#form11').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: { }
  });
});
