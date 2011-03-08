// happy.js validations
jQuery(document).ready(function () {
  jQuery('#form6').isHappy({
    // submitButton: jQuery('#attSubmitButton'),
    fields: {
      '#first_usa_school': {
        required: 'sometimes',
        test: happy.emptyOrDate,
        message: 'Please enter in format M/D/YYYY.',
      },
      '.immigrant': { 
        required: true,
        message: 'Required field.',
      },
      '.hispanic_ethnicity': { 
        required: true,
        message: 'Required field.',
      },
      '#parent_edu': {
        required: true,
        message: 'Required field.',
      },
    }
  });
});