function required_contact_phone(val, arg) {
  if (val === '') {
    return happy.selectorIsEmpty(arg);
  }
  return happy.USPhoneWithExtension(val);
}

// happy.js validations
$j(document).ready(function () {
  $j('#form6').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '#emerg1_last': {
        required: true,
        message: 'Required field.' },
      '#emerg1_first': {
        required: true,
        message: 'Required field.' },
      '#emerg1_rel': {
        required: true,
        message: 'Required field.' },
      '#emerg1_phone': {
        required: true,
        clean: reformatPhone415,
        test: happy.USPhoneWithExtension,
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '#emerg1_ptype': {
        required: true,
        message: 'Required field.' },
      '#emerg1_phone2': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg1_ptype2': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#emerg1_phone2',
        message: 'Required field.' },
      '#emerg2_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg2_name',
        message: 'Required field.' },
      '#emerg2_first': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg2_name',
        message: 'Required field.' },
      '#emerg2_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg2_name',
        message: 'Required field.' },
      '#emerg2_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: required_contact_phone,
        arg: '.emerg2_name',
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '#emerg2_ptype': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg2_name',
        message: 'Required field.' },
      '#emerg2_phone2': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg2_ptype2': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#emerg2_phone2',
        message: 'Required field.' },
      '#emerg3_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg3_name',
        message: 'Required field.' },
      '#emerg3_first': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg3_name',
        message: 'Required field.' },
      '#emerg3_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg3_name',
        message: 'Required field.' },
      '#emerg3_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: required_contact_phone,
        arg: '.emerg3_name',
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '#emerg3_ptype': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.emerg3_name',
        message: 'Required field.' },
      '#emerg3_phone2': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg3_ptype2': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#emerg3_phone2',
        message: 'Required field.' }
    }
  });
});