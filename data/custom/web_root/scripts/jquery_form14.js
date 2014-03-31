function todayIfBlank(val) {
  if (val === '') {
    val = today_mdy();
  }
  return val;
}

function validateAllFields() {
  var forms = new Array();
  var count = 0;
  $j('.always').not('.oneorblank').each(function (i) {
    count = count + 1;
    var el = $j(this);
    if (el.val() == '') {
      var regform = this.className.match(/(regform(\d+))/);
      if (regform) {
        regform = regform[2];
      } else {
        regform = "?";
      }
      forms.push(el.attr("id") + " on form " + regform);
    }
  });
  if (count > 0) {
    if (forms.length > 0) {
      alert("You have incomplete data:\n" + forms.join("\n"));
    } else {
      alert("All " + count + " required fields are complete.");
    }
  }
}

// happy.js validations
$j(document).ready(function () {
  validateAllFields();
  $j('#form14').isHappy({
    // submitButton: $j('#attSubmitButton'),
    onSubmit: onRegFormSubmit,
    fields: {
      '.resp_for_student': {
        required: true,
        message: 'Required field.' },
      '#responsibility_sig_1': {
        required: true,
        message: 'Required field.' },
      '#responsibility_date': {
        required: true,
        clean: todayIfBlank,
        test: happy.date,
        message: 'Required field. Format as M/D/YYYY.' }
    }
  });
});