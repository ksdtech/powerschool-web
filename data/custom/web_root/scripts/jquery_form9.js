// happy.js validations
jQuery(document).ready(function () {
  jQuery('#form9').isHappy({
    // submitButton: jQuery('#attSubmitButton'),
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