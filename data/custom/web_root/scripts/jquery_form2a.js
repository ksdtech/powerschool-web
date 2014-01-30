// Validation for form2 (admin side)

function set_up_reg_year() {
  var reg_year = jq15.trim(jq15('#orig_reg_year').val());
  if (!reg_year) {
    var entrydate = jq15('#orig_entrydate').val();
    var mdy = entrydate.match(/(\d+)\/\d+\/(\d+)/);
    if (mdy) {
      var mo = parseInt(mdy[1]);
      var yr = parseInt(mdy[2]);
      if (mo <= 6) {
        yr = yr - 1;
      }
      reg_year = yr + '-' + (yr + 1);
    }
    jq15('.reg_year').val(reg_year);
    // jq15('.for_reg_year').val('for ' + reg_year + ' School Year');
  }
}

// happy.js validations
jq15(document).ready(function () {
  set_up_reg_year();
  jq15('#form2').isHappy({
    // submitButton: jq15('#attSubmitButton'),
    onSubmit: onItrFormSubmit
  });
});