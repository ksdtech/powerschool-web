// Validation for form1

function required_if_not_returning(val) {
	var enrollment = jq15("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
	var error = false
	if (not_enrolling) {
	  error = (val.length === 0);
	}
	return !error;
}

function required_if_transfering(val) {
	var enrollment = jq15("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment != null && enrollment.indexOf("nr-") == 0);
	var error = false
	if (not_enrolling) {
  	var exitcode = jq15("#reg_exitcode option:selected").val();
  	if (exitcode != null && /^160|180$/.test(exitcode)) {
	    error = (val.length === 0);
	  }
	}
	return !error;
}

// happy.js validations
jq15(document).ready(function () {
  jq15('#form1').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onItrFormSubmit,
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