// regform status page
jq15(document).ready(function() {
  var enrollment = jq15("#reg_enroll").val();
	var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    jq15(".enrolling").hide();
  }
  jq15(".chk_status").each(function() {
    jq15(this).bind("click", function() { return false; } );
    var src = "#" + jq15(this).attr('id').replace('_status', '_updated_at');
    var dt = jq15(src).val().match(/^(\d\d\d\d-\d\d-\d\d)/);
    if (dt && dt[1] && dt[1].localeCompare('2013-03-25') >= 0) { 
      jq15(this).attr("checked", "checked"); 
    }
  });
});

