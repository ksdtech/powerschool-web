// happy.js validations
jQuery(document).ready(function () {
  jQuery('#form7').isHappy({
    // submitButton: jQuery('#attSubmitButton'),
    fields: {
      '#lang_earliest': {
        required: true,
        message: 'Required field.',
      },
      '#lang_primary': {
        required: true,
        message: 'Required field.',
      },
      '#lang_spoken': {
        required: true,
        message: 'Required field.',
      },
      '#lang_adults': {
        required: true,
        message: 'Required field.',
      },
    }
  });
});