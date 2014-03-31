function onFormTSubmit() {
  // alert("testing");
  onRegFormSubmit();
}

// happy.js validations
$j(document).ready(function () {
  $j('#formt').isHappy({
    submitButton: $j('#btnSubmit'),
    onSubmit: onFormTSubmit,
    fields: {
      '#street': {
        required: true,
        message: 'Required field.' },
      '#city': { 
        required: true,
        message: 'Required field.' },
      '#state': {
        required: true,
        clean: setCAIfBlank,
        test: happy.USState,
        message: 'Required field: format as "CA".' },
      '#zip': { 
        required: true,
        test: happy.USZip,
        message: 'Required field: format as "94904" or "94904-0001"' },
      '#email_addr': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' },
      '#email_personal': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' },
      '#home_phone': { 
        required: true,
        clean: reformatPhone415,
        test: happy.USPhoneWithExtension,
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '#cell': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#summer_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#summer_email': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' },
      '#emerg1_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg1_phone2': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg2_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#emerg2_phone2': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#doctor_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' },
      '#medical_phone': {
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Format as (415) 333-2222 x5555.' }
    }
  });
});
