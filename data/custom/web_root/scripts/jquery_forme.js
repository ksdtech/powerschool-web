// happy.js validations
jQuery(document).ready(function () {
  jQuery('#form1').isHappy({
    // submitButton: jQuery('#attSubmitButton'),
    fields: {
      '#reg_enroll': {
        required: true,
        message: 'Required field: whether this student is re-enrolling or not.',
      },
      '#reg_exitcode': { 
        required: 'sometimes',
        test: required_if_not_returning,
        message: 'Please choose a reason from the list.',
      },
      '#reg_exitcomment': { 
        required: 'sometimes',
        test: required_if_transfering,
        message: 'Please give the name of the school, or type "Don't know'"',
      },
    }
  });
});