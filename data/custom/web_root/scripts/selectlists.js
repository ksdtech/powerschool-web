function select_one(osel, str) {
	if (str == "") { return -1; }
	var opts = osel.options;
	var olen = opts.length;
	for (var i = 0; i < olen; i++) {
		if (opts[i].value == str) {
			opts[i].selected = true;
			return i;
		}
	}
	return -1;
}

function init_multi_select(osel, str) {
	var count = 0;
	var a = str.split(/[, \t\r\n]+/);
	var alen = a.length;
	for (var j = 0; j < alen; j++) {
		var val = a[j];
		if (select_one(osel, val) >= 0) {
			count = count + 1;
		}
	}
	return count;
}

function pack_multi_select(osel) {
	var ret = "";
	var opts = osel.options;
	var olen = opts.length;
	for (var i = 0; i < olen; i++) {
		if (opts[i].selected && opts[i].value != "") {
			if (ret != "") { ret = ret + ","; }
			ret = ret + opts[i].value;
		}
	}
	return ret;
}

