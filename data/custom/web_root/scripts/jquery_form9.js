function todayIfBlank(val) {
  if (val === '') {
    val = today_mdy();
  }
  return val;
}

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
      '.pub_waiver_public': {
        required: true,
        message: 'Required field.',
      },
      '.pub_waiver_restricted': {
        required: true,
        message: 'Required field.',
      },
      '.acceptable_use': {
        required: true,
        message: 'Required field.',
      },
      '.responsibility': {
        required: true,
        message: 'Required field.',
      },
      '#signature': {
        required: true,
        message: 'Required field.',
      },
      '#signed_date': {
        required: true,
        clean: todayIfBlank,
        test: happy.date,
        message: 'Required field. Format as M/D/YYYY.'
      },
    }
  });
});