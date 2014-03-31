function onForm4Submit() {
  $j('.copy_address').each(function (i) {
    var src_id = this.id.replace(/^mailing_/, '#');
    this.value = $j(src_id).val();
  });
  var no_2nd_family = $j("#family2_no");
  if (no_2nd_family && no_2nd_family.attr("checked")) {
    $j("#form5_upd_by").val($j("#userid").val()); 
    $j("#form5_upd_at").val(timestamp_now());
    $j("#nextpage").val($j("#alt_nextpage").val());
    $j("#nexttitle").val($j("#alt_nexttitle").val());
  }
  onRegFormSubmit();
}

// happy.js validations
$j(document).ready(function () {
  $j('#form4').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onForm4Submit,
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
      '#home_phone': { 
        required: true,
        clean: reformatPhone415,
        test: happy.USPhoneWithExtension,
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '.family2': {
        default_radio: '#family2_no' },
      '.inet_access': {
        default_radio: '#inet_yes',
        required: true,
        message: 'Required field.' },
      '.printed_material': {
        default_radio: '#printed_no',
        required: true,
        message: 'Required field.' },
      '.spanish_material': {
        default_radio: '#spanish_no',
        required: true,
        message: 'Required field.' },
      '#mother_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother_first',
        message: 'Required field.' },
      '#mother_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother_first',
        message: 'Required field.' },
      '.mother_guardian': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother_first',
        message: 'Required field.' },
      '#mother_work_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother_home_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother_cell': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother_email': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' },
      '#father_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father_first',
        message: 'Required field.' },
      '#father_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father_first',
        message: 'Required field.' },
      '.father_guardian': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father_first',
        message: 'Required field.' },
      '#father_work_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father_home_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father_cell': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father_email': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' }
    }
  });
});