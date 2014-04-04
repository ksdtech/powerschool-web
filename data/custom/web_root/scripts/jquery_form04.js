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

function onForm04Submit() {
  // update mailing addresses
  $j('.copy_address').each(function (i) {
    var src_id = this.id.replace(/^mailing_/, '#');
    this.value = $j(src_id).val();
  });
  $j('.copy_address2').each(function (i) {
    var src_id = this.id.replace(/^mailing2_/, '#home2_');
    this.value = $j(src_id).val();
  });
  
  
  // update if this is the "master" record
  if ($j("#preview_approved").prop('checked')) {
    $j("#preview_approved_at").val(timestamp_now());
  } else {
    $j("#preview_approved_at").val('');
  }
  onRegFormSubmit();
}

// Sibling data filled in by tlist_sql based on Web_ID matches
// <input type="hidden" class="sibdata" id="sib_webid_113960" value="REDLD3FE.113960" />
// <input type="hidden" class="sibdata" id="sib_first_113960" value="Ethan" />
// <input type="hidden" class="sibdata" id="sib_last_113960" value="Redlin" />
// <input type="hidden" class="sibdata" id="sib_grade_113960" value="0" />
// <input type="hidden" class="sibdata" id="sib_nick_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_unlisted_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_approved_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_approval_113960" value="" />

var sibs = [ ]
var sib_data = { }
var sib_unlisted = null;
var sib_approved = null;
var last_approval = null;
var sib_names = [ ];

function get_sibling_data() {
  $j('.sibdata').each(function(i, el) {
    var m = el.id.match(/sib_([a-z]+)_([0-9]+)/);
    if (m) {
      var attr = m[1];
      var sid = 'S' + m[2];
      if (!(sid in sib_data)) {
        sibs.push(sid);
        sib_data[sid] = { }
      };
      sib_data[sid][attr] = el.value;
    }
  });
  
  // Pick nickname if they have one
  // See if other sibs have approved a preview or asked to be unlisted
  var my_sid = 'S' + $j('#my_id').val();
  for (var i = 0; i < sibs.length; i++) {
    var sid = sibs[i];
    var the_sib = sib_data[sid];
    if (the_sib.nick != "") {
      the_sib.first = the_sib.nick;
    }
    if (sid != my_sid) {
      if (the_sib.unlisted == '1') {
        sib_unlisted = sid;
      } 
      if (the_sib.approved == '1' && the_sib.approval != "") {
        if (last_approval == null || the_sib.approval.localCompare(last_approval)) {
          sib_approved = sid;
          last_approval = the_sib.approval;
        }
      }
    }
  }

  // Sort by grade and name
  sibs.sort(function(a, b) {
    var by_grade = parseInt(sib_data[a].grade) - parseInt(sib_data[b].grade);
    if (by_grade != 0) { return by_grade; }
    return sib_data[a].first.localeCompare(sib_data[b].first);
  });
  
  for (var i = 0; i < sibs.length; i++) {
    var sid = sibs[i];
    var the_sib = sib_data[sid];
    if (!/^nr-/.test(the_sib.status)) {
      var grade = the_sib.grade;
      if (grade == '0') { grade = 'K' }
      sib_names.push(the_sib.first + ' (' + grade + ')');
    }
  }
}

function update_preview() {
  var students = $j('#my_last').val().toUpperCase() + ' ' + sib_names.join(', ');
  var parents  = '';
  var mfirst   = '';
  var mlast    = '';
  var ffirst   = '';
  var flast    = '';
  if (!$j('#kikdir_mother_name').prop('checked')) {
    mfirst = $j('mother_first').val();
    mlast = $j('mother_last').val();
  }
  if (!$j('#kikdir_father_name').prop('checked')) {
    mfirst = $j('father_first').val();
    mlast = $j('father_last').val();
  }
  if (mlast != '' && flast != '') {
    if (mlast != flast) {
      parents = mfirst + ' ' + mlast + ' and ' + ffirst + ' ' + flast;
    } else {
      parents = mfirst + ' and ' + ffirst + ' ' + flast;
    }
  } else if (mlast != '') {
    parents = mfirst + ' ' + mlast;
  } else if (flast != '') {
    parents = ffirst + ' ' + flast;
  }
  var b1 = "(415) 300-5555";
  $j('#preview_a1').html(students + '<br>' + parents);
  $j('#preview_b1').html(b1);
  return true;
}

// happy.js validations
$j(document).ready(function () {
  get_sibling_data();
  $j('.ksource').bind('click', update_preview);
  update_preview();
  
  $j('#form04').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onForm04Submit,
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
        message: 'Must be a valid email address.' },
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