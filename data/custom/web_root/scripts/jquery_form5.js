function onForm5Submit() {
  var any_family2 = "";
  var fam2_text, fam2_yes, fam2_no;
  $j('.copy_address2').each(function (i) {
    var src_id = this.id.replace(/^mailing2_/, '#home2_');
    this.value = $j(src_id).val();
  });
  fam2_text = $j("#family2");
  fam2_yes =  $j("#family2_yes");
  if (fam2_text || fam2_yes) {
    $j(".family2_test").each(function() {
      if ($j.trim($j(this).val()) != "") {
        any_family2 = "1";
      }
    });
    if (fam2_text) {
      fam2_text.val(any_family2);
    } else {
      fam2_no = $j("#family2_no");
      if (any_family2 == "1") {
        fam2_yes.attr('checked', 'checked');
        fam2_no.removeAttr('checked');
      } else {
        fam2_no.attr('checked', 'checked');
        fam2_yes.removeAttr('checked');
      }
    }
  }
  onRegFormSubmit();
}

function required_if_guardian2_test(val, radio_class) {
  var checked_radio = $j(radio_class).filter(':checked');
  var has_val = (checked_radio.length != 0);
  return has_val || happy.selectorIsEmpty('.guardian2_name');
}

function home2_state_test(val) {
  if (val === '') {
    return happy.selectorIsEmpty('.guardian2_name');
  }
  return happy.USState(val);
}

function home2_zip_test(val) {
  if (val === '') {
    return happy.selectorIsEmpty('.guardian2_name');
  }
  return happy.USZip(val);
}

function home2_phone_test(val) {
  if (val === '') {
    return happy.selectorIsEmpty('.guardian2_name');
  }
  return happy.USPhoneWithExtension(val);
}

// happy.js validations
$j(document).ready(function () {
  $j('#form5').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onForm5Submit,
    fields: {
      '#home2_street': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.guardian2_name',
        message: 'Required field.' },
      '#home2_city': { 
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '.guardian2_name',
        message: 'Required field.' },
      '#home2_state': {
        required: 'sometimes',
        test: home2_state_test,
        message: 'Required field: format as "CA".' },
      '#home2_zip': { 
        required: 'sometimes',
        test: home2_zip_test,
        message: 'Required field: format as "94904" or "94904-0001"' },
      '#home2_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: home2_phone_test,
        message: 'Required field: format as (415) 333-2222 x5555.' },
      '.inet_access2': {
        default_radio: '#inet_yes',
        required: 'sometimes',
        test: required_if_guardian2_test,
        arg: '.inet_access2',
        message: 'Required field.' },
      '.printed_material2': {
        default_radio: '#printed_no',
        required: 'sometimes',
        test: required_if_guardian2_test,
        arg: '.printed_material2',
        message: 'Required field.' },
      '.spanish_material2': {
        default_radio: '#spanish_no',
        required: 'sometimes',
        test: required_if_guardian2_test,
        arg: '.spanish_material2',
        message: 'Required field.' },
      '#mother2_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother2_first',
        message: 'Required field.' },
      '#mother2_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother2_first',
        message: 'Required field.' },
      '.mother2_guardian': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#mother2_first',
        message: 'Required field.' },
      '#mother2_work_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother2_home_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother2_cell': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#mother2_email': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' },
      '#father2_last': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father2_first',
        message: 'Required field.' },
      '#father2_rel': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father2_first',
        message: 'Required field.' },
      '.father2_guardian': {
        required: 'sometimes',
        test: happy.requiredIfArgNotEmpty,
        arg: '#father2_first',
        message: 'Required field.' },
      '#father2_work_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father2_home_phone': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father2_cell': { 
        required: 'sometimes',
        clean: reformatPhone415,
        test: happy.emptyOrUSPhoneWithExtension,
        message: 'Please format as (415) 333-2222 x5555.' },
      '#father2_email': { 
        required: 'sometimes',
        test: happy.emptyOrEmail,
        message: 'Must be a valid email address.' }
    }
  });
});