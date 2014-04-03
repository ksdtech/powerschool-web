// Validation for form2 (admin side)

function set_up_reg_year() {
  var reg_year = $j.trim($j('#orig_reg_year').val());
  if (!reg_year) {
    var entrydate = $j('#orig_entrydate').val();
    var mdy = entrydate.match(/(\d+)\/\d+\/(\d+)/);
    if (mdy) {
      var mo = parseInt(mdy[1]);
      var yr = parseInt(mdy[2]);
      if (mo <= 6) {
        yr = yr - 1;
      }
      reg_year = yr + '-' + (yr + 1);
    }
    $j('.reg_year').val(reg_year);
    // $j('.for_reg_year').val('for ' + reg_year + ' School Year');
  }
}

// happy.js validations
$j(document).ready(function () {
  set_up_reg_year();
  $j('#form2').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onItrFormSubmit
  });
});