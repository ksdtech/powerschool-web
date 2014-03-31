// regform status page
$j(document).ready(function() {
  var enrollment = $j("#reg_enroll").val();
	var not_enrolling = (enrollment != null && /^nr-/.test(enrollment));
  if (not_enrolling) { 
    $j(".enrolling").hide();
  }
  $j(".chk_status").each(function() {
    $j(this).bind("click", function() { return false; } );
    var src = "#" + $j(this).attr('id').replace('_status', '_updated_at');
    var dt = $j(src).val().match(/^(\d\d\d\d-\d\d-\d\d)/);
    if (dt && dt[1] && dt[1].localeCompare('2013-03-25') >= 0) { 
      $j(this).attr("checked", "checked"); 
    }
  });
});

