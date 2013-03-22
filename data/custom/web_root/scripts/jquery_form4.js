function onForm3Submit() {
  jq15('.copy_address').each(function (i) {
    var src_id = this.id.replace(/^mailing_/, '#');
    this.value = jq15(src_id).val();
  });
  var no_2nd_family = jq15("#family2_no");
  if (no_2nd_family && no_2nd_family.attr("checked")) {
    jq15("#form4_upd_by").val(jq15("#userid").val()); 
    jq15("#form4_upd_at").val(timestamp_now());
    jq15("#nextpage").val(jq15("alt_#nextpage").val());
    jq15("#nexttitle").val(jq15("alt_#nexttitle").val());
  }
  onRegFormSubmit();
}

// happy.js validations
jq15(document).ready(function () {
  jq15('#form3').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onForm3Submit,
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