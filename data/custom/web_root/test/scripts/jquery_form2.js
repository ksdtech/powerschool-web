function required_if_north_american(val) {
	var birth_country = jQuery("#birth_country option:selected").val();
	var error = false
	if (birth_country != null && /^US|CA|MX$/.test(birth_country)) {
	  error = (val.length === 0);
	}
	return !error;
}

// happy.js validations
jQuery(document).ready(function () {
  jQuery('#form2').isHappy({
    // submitButton: jQuery('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '#dob': {
        required: true,
        test: happy.date,
        message: 'Required field: please enter in format M/D/YYYY.',
      },
      '#gender': { 
        required: true,
        message: 'Please choose a gender from the list.',
      },
      '#birth_city': { 
        required: true,
        message: 'Required field: birth place city.',
      },
      '#birth_state': { 
        required: 'sometimes',
        test: required_if_north_american,
        message: 'Required field for US, Canada or Mexico birth place: state or province.',
      },
      '#birth_country': { 
        required: true,
        message: 'Required field: birth place country.',
      },
      '#lives_with_rel': { 
        required: true,
        message: 'Required field.',
      },
      '.custody_orders': {
        default_radio: '#co_no',
        required: true,
        message: 'Required field.'
      },
    }
  });
});