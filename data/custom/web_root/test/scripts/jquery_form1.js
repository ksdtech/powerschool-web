// Validation for form1

function required_if_not_returning(val) {
	var enrollment = jQuery("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment != null && enrollment.indexOf("nr-") == 0);
	var error = false
	if (not_enrolling) {
	  error = (val.length === 0);
	}
	return !error;
}

function required_if_transfering(val) {
	var enrollment = jQuery("#reg_enroll option:selected").val();
	var not_enrolling = (enrollment != null && enrollment.indexOf("nr-") == 0);
	var error = false
	if (not_enrolling) {
  	var exitcode = jQuery("#reg_exitcode option:selected").val();
  	if (exitcode == "160" || exitcode == "180") {
	    error = (val.length === 0);
	  }
	}
	return !error;
}


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