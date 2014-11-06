function rand_chars(str, len) {
	var rv = '';
	for (var i=0; i < len; i++) {
		var rnum = Math.floor(Math.random() * str.length);
		rv = rv + str.substring(rnum, rnum+1);
	}
	return rv;
}

var PSU_LETTERS   = 'ABCDEFGHJKMNPQRSTUVWXYZ';
var PSU_NUMBERS   = '23456789';
var PSU_HEX       = PSU_NUMBERS + 'ABCDEF';
var PSU_ALNUM     = PSU_LETTERS + PSU_NUMBERS;
var PSU_INVALID_LETTER_REGEXP = new RegExp('[^' + PSU_LETTERS + ']', 'g');

function new_ps_fam_ident(last_name, secondary_family) {
	var last = last_name.toUpperCase().replace(PSU_INVALID_LETTER_REGEXP, '');
	var len = last.length;
	if (len > 4) { last = last.substring(0, 4); }
	if (len < 4) { last = last + rand_chars(PSU_LETTERS, 4-len); }
	var fam_ident = null;
	for (var i=0; i < 100; i++) {
		fam_ident = last + rand_chars(PSU_HEX, 4);
		// todo: check uniqueness
		break;
	}
	return fam_ident;
}

function new_ps_username(last_name, secondary_family, student_number) {
	var last = last_name.toUpperCase().replace(PSU_INVALID_LETTER_REGEXP, '');
	var len = last.length;
	if (len > 0) { last = last.substring(0, 1); }
	else { last = rand_chars(PSU_LETTERS, 1); }
	if (secondary_family) { last += 'S'; }
	else { last += 'P'; }
	var suffix = student_number.toString();
	suffix = suffix.substring(suffix.length-3, suffix.length);
	var username = null;
	for (var i=0; i < 100; i++) {
		username = last + rand_chars(PSU_ALNUM, 3) + suffix;
		// todo: check uniqueness
		break;
	}
	return username;
}

function new_ps_password() {
	var passwd = null;
	for (var i=0; i < 100; i++) {
		passwd = rand_chars(PSU_ALNUM, 6);
		// todo: check uniqueness
		break;
	}
	return passwd;
}

function new_student_username(last_name, first_name, middle_school) {
	var first = '';
	var last = '';
	var last_len = 0;
	var i;
	if (middle_school) { 
		// stop last name on hyphen, then remove spaces (vanliere, dhaiti, peltereau)
		var words = last_name.toLowerCase().split(/[^a-z]/);
		for (i=0; i < words.length; i++) {
			var w = words[i];
			if (first.length == 0 && w.length > 4) {
				first = first + w;
				break;
			}
			first = first + w;
			if (first.length > 10) { break; }
		}
		if (first.length > 10) { first = first.substring(0, 10); }
		last = first_name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 1);
		if (last.length > 0) { last_len = 1; }
	} else {
		// stop first name on any non-alpha character
		first = first_name.toLowerCase().replace(/[^a-z].*$/g, '');
		last	= last_name.toLowerCase().replace(/[^a-z]/g, '');
		last_len = last.length;
	} 
	var last_i = 0;
	var last_part, username = null;
	for (i=0; i < 100; i++) {
		if (i < last_len) { last_part = last.substring(0, i+1); }
		else {
			last_i = last_i + 1;
			last_part = last + (last_i + '');
		}
		username = first + last_part;
		// todo: check uniqueness
		break;
	}
	return username;
}

function new_student_password(middle_school) {
	if (middle_school) { return 'aa' + rand_chars(PSU_NUMBERS, 4) + 'aa';  }
	return 'aa123456';
}
