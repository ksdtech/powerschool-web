jQuery(document).ready(function() {
  // blank contents have &nbsp; in them; how do I search for these?
  // :contains('&nbsp;') doesn't work
  jQuery(".hideblank .contents").each( function() {
	  if (jQuery(this).is(":not(:contains('@'))")) { jQuery(this).parent().hide(); } });
});
