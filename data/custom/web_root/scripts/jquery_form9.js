function setIfSelectorNotEmpty(val, sel, which) {
  val = '';
  if (!happy.selectorIsEmpty(sel)) {
    val = '1';
    $j(which).attr('checked', 'checked');
  }
  return val;
}

function set_eyeglasses(val) {
  return setIfSelectorNotEmpty(val, '.eyeglasses_chk', '#eyeglasses_yes');
}

function set_allergies(val) {
  return setIfSelectorNotEmpty(val, '.allergies_chk', '#allergies_yes');
}

function set_asthma(val) {
  return setIfSelectorNotEmpty(val, '.asthma_chk', '#asthma_yes');
}

function set_seizures(val) {
  return setIfSelectorNotEmpty(val, '.seizures_chk', '#seizures_yes');
}

function set_diabetes(val) {
  return setIfSelectorNotEmpty(val, '.diabetes_chk', '#diabetes_yes');
}

function set_behavior(val) {
  return setIfSelectorNotEmpty(val, '.behavior_chk', '#behavior_yes');
}

function set_movement(val) {
  return setIfSelectorNotEmpty(val, '.movement_chk', '#movement_yes');
}

function set_med_other(val) {
  return setIfSelectorNotEmpty(val, '.med_other_chk', '#med_other_yes');
}

function set_illness(val) {
  return setIfSelectorNotEmpty(val, '.illness_chk', 'illness_yes');
}

function set_med_accom(val) {
  return setIfSelectorNotEmpty(val, '.med_accom_chk', '#med_accom_yes');
}

// happy.js validations
$j(document).ready(function () {
  $j('#form9').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.requires_meds': {
        required: true,
        message: 'Required field.' },
      '.school_meds': {
        required: true,
        message: 'Required field.' },
      '.emergency_meds': {
        required: true,
        message: 'Required field.' },
      '#health_ins': {
        required: true,
        message: 'Required field.' },
      '#emergency_hospital': {
        required: true,
        message: 'Required field.' },
      '.eyeglasses': {
        required: true,
        clean: set_eyeglasses,
        message: 'Required field.' },
      '#last_eye_exam': {
        required: 'sometimes',
        test: happy.emptyOrDate,
        message: 'Please enter in format M/D/YYYY.' },
      '.hearing_aid': {
        required: true,
        message: 'Required field.' },
      '.allergies': {
        required: true,
        clean: set_allergies,
        message: 'Required field.' },
      '#allergies_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#allergies_yes',
        message: 'Required field.' },
      '.asthma': {
        required: true,
        clean: set_asthma,
        message: 'Required field.' },
      '.asthma_chk': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#asthma_yes',
        message: 'Required field.' },
      '.seizures': {
        required: true,
        clean: set_seizures,
        message: 'Required field.' },
      '.seizures_chk': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#seizures_yes',
        message: 'Required field.' },
      '.diabetes': {
        required: true,
        clean: set_diabetes,
        message: 'Required field.' },
      '.diabetes_chk': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#diabetes_yes',
        message: 'Required field.' },
      '.behavior': {
        required: true,
        clean: set_behavior,
        message: 'Required field.' },
      '#behavior_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#behavior_yes',
        message: 'Required field.' },
      '.movement': {
        required: true,
        clean: set_movement,
        message: 'Required field.' },
      '#movement_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#movement_yes',
        message: 'Required field.' },
      '.med_other': {
        required: true,
        clean: set_med_other,
        message: 'Required field.' },
      '#med_other_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#med_other_yes',
        message: 'Required field.' },
      '.illness': {
        required: true,
        clean: set_illness,
        message: 'Required field.' },
      '#illness_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#illness_yes',
        message: 'Required field.' },
      '.med_accom': {
        required: true,
        clean: set_med_accom,
        message: 'Required field.' },
      '#med_accom_txt': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#med_accom_yes',
        message: 'Required field.' }
    }
  });
});