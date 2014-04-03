// functions to format various text fields
// phone numbers
function na_phone(str, def_ac) {
	var len;
	var c;
	var ret = "";
	var i = 0;
	var ndigits = 0;
	var str = str.replace(/^\s+/, "");
	str = str.replace(/\s+$/, "");
	len = str.length;
	if (len == 0 || str.charAt(0) == "+") {
		ret = str;
	} else {
		while (i < len) {
			c = str.charAt(i);
			if (c.match(/\d/)) {
				if (ndigits == 10) { break; }
				ndigits++; 
				ret = ret + c; 
			} else {
				if (!c.match(/[-\(\)\/\\\s]/)) { break; }
			}
			i++;
		}
		switch (ndigits) {
		case 7:
			ret = "(" + def_ac + ") " +
				ret.substring(0, 3) + "-" + ret.substring(3, 7);
			if (i < len) {
				ret = ret + " " + str.substring(i, len);
			}
			break;
		case 10:
				ret = "(" + ret.substring(0, 3) + ") " + 
					ret.substring(3, 6) + "-" + ret.substring(6, 10);
			if (i < len) {
				ret = ret + " " + str.substring(i, len);
			}
				break;
			default:
				ret = str;
		}
	}
	return ret;
}

function ucfirst(str) {
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1, str.length-1);
}

function uclastword(str) {
	var a = str.split(/\s+/);
	if (a.length < 1) { return str; }
	a.push(ucfirst(a.pop()));
	return a.join(" ");
}

function ucwords(str) {
	return str.replace(/^(.)|\s(.)/g, function ($1) { return $1.toUpperCase(); });
}

function setCAIfBlank(val) {
  val = $j.trim(val);
  if (val === '') {
    val = 'CA';
  } else {
    val = val.toUpperCase();
  }
  return val;
}

function reformatPhone415(val) {
  return na_phone(val, '415');
}


