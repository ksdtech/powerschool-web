// happy.js validations
jq15(document).ready(function () {
  jq15('#form9').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    fields: {
      '.med_treatment': {
        required: true,
        message: 'Required field.',
      },
      '.prev_school_contact': {
        required: true,
        message: 'Required field.',
      },
      '.pub_waver_public': {
        required: true,
        message: 'Required field.',
      },
      '.pub_waver_private': {
        required: true,
        message: 'Required field.',
      },
      '.acceptable_use': {
        required: true,
        message: 'Required field.',
      },
      '.signature': {
        required: true,
        message: 'Required field.',
      },
    }
  });
});