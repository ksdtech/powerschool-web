function rand_chars(str, len) {
	var rv = '';
	for (var i=0; i < len; i++) {
		var rnum = Math.floor(Math.random() * str.length);
		rv = rv + str.substring(rnum, rnum+1);
	}
	return rv;
}

function new_ps_username(last_name, secondary_family) {
	var prefix;
	if (secondary_family) { prefix = '6789'; }
	else { prefix = '2345'; }
	var last = last_name.toUpperCase().replace(/[^ABCDEFGHJKMNPQRSTUVWXYZ]/g, '');
	var len = last.length;
	if (len > 3) { last = last.substring(0, 3); }
	if (len < 3) { last = last + Array(4 - len).join('Y'); }
	var numbers = '23456789';
	var username;
	for (var i=0; i < 100; i++) {
		username = rand_chars(prefix, 1) + last + rand_chars(numbers, 2);
		// todo: check uniqueness
		if (1) { return username; }
	}
	return undefined;
}

function new_ps_password() {
	var passwd;
	for (var i=0; i < 100; i++) {
		passwd = rand_chars('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 6);
		// todo: check uniqueness
		if (1) { return passwd; }
	}
	return undefined;
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
	var last_part, username;
	for (i=0; i < 100; i++) {
		if (i < last_len) { last_part = last.substring(0, i + 1); }
		else {
			last_i = last_i + 1;
			last_part = last + (last_i + '');
		}
		username = first + last_part;
		// todo: check uniqueness
		if (1) { return username; }
	}
	return undefined;
}

function new_student_password(middle_school) {
	if (middle_school) { return 'aa' + rand_chars('23456789', 4); }
	return 'aa1234';
}
