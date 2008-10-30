// uses yui module pattern 
// see http://yuiblog.com/blog/2007/06/12/module-pattern
YAHOO.namespace("ksdregform");

// reform status page
YAHOO.ksdregform.StatusHandler = function() {
	var Dom = YAHOO.util.Dom;

	return {
		init: function() {
			var el_enroll = Dom.get("reg_enroll");
			var not_enrolling = (el_enroll.value.indexOf("nr-") == 0);
			if (not_enrolling) { 
				var ar_enroll = Dom.getElementsByClassName("enrolling");
				Dom.setStyle(ar_enroll, "visibility", "hidden");
			} else {
				var ar_status = Dom.getElementsByClassName("chk_status", "input");
				Dom.batch(a_status, function(el) {
					YAHOO.util.Event.addListener(el, "click", function(e) { return false; });
					var src_id = el.id.replace("_status", "_updated_at");
					var el_src = Dom.get(src_id);
					if (el_src.value != "") { el.checked = true; }
				});
			}
		}
	}
}();

YAHOO.util.Event.onDOMReady(YAHOO.ksdregform.StatusHandler.init, YAHOO.ksdregform.StatusHandler, true);

