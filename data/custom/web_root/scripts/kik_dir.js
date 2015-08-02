
function get_sib_names(sibs) {
  // assume sibs array has all the info about siblings:
  // .status
  // .grade
  // .first
  // .last
  // right now, we don't filter on last name, but we could
  var sib_names = [ ];
  for (var i = 0; i < sibs.length; i++) {
    var sid = sibs[i];
    var the_sib = sib_data[sid];
    if (!/^nr-/.test(the_sib.status)) {
      var grade = the_sib.grade;
      if (grade == '0') { grade = 'K' }
      sib_names.push(the_sib.first + ' (' + grade + ')');
    }
  }
  return sib_names;
}

var PRIMARY_PARENTS = 0;
var SECONDARY_PARENTS = 21;

var pfields = [ 
  '#kikdir_home_addr',
  '#street',
  '#city',
  '#state',
  '#zip',
  '#kikdir_mother_name',
  '#mother_first',
  '#mother_last',
  '#kikdir_father_name',
  '#father_first',
  '#father_last',
  '#kikdir_mother_email',
  '#mother_email',
  '#kikdir_father_email',
  '#father_email',
  '#kikdir_home_phone',
  '#home_phone',
  '#kikdir_mother_cell',
  '#mother_cell',
  '#kikdir_father_cell',
  '#father_cell',
  '#kikdir_home2_addr',
  '#home2_street',
  '#home2_city',
  '#home2_state',
  '#home2_zip',
  '#kikdir_mother2_name',
  '#mother2_first',
  '#mother2_last',
  '#kikdir_father2_name',
  '#father2_first',
  '#father2_last',
  '#kikdir_mother2_email',
  '#mother2_email',
  '#kikdir_father2_email',
  '#father2_email',
  '#kikdir_home2_phone',
  '#home2_phone',
  '#kikdir_mother2_cell',
  '#mother2_cell',
  '#kikdir_father2_cell',
  '#father2_cell'
]


function get_parents(i) {
  // i = index into array of parent fields
  
  var result = [ ];
  var street   = '';
  var city     = '';
  var state    = '';
  var zip      = '';
  var mfirst   = '';
  var mlast    = '';
  var ffirst   = '';
  var flast    = '';
  var mabbr    = '';
  var fabbr    = '';
  var parents  = '';
  var mmail    = '';
  var fmail    = '';
  var hphone   = '';
  var mcell    = '';
  var fcell    = '';
  
  // physical address
  if (!$j(pfields[i+0]).prop('checked')) {
    street = $j(pfields[i+1]).val();
    city   = $j(pfields[i+2]).val();
    state  = $j(pfields[i+3]).val();
    zip    = $j(pfields[i+4]).val();
  }
  
  // excluded residence
  if (!(street == '' || city == '' || state == '' || zip == '')) {
    // html-ize it
    street += (', ' + city + ', ' + state + ' ' + zip);
  }
  
  // parents
  if (!$j(pfields[i+5]).prop('checked')) {
    mfirst = $j(pfields[i+6]).val();
    mlast = $j(pfields[i+7]).val();
  }
  if (!$j(pfields[i+8]).prop('checked')) {
    ffirst = $j(pfields[i+9]).val();
    flast = $j(pfields[i+10]).val();
  }
  if (mlast != '' && flast != '') {
    if (mlast != flast) {
      parents = mfirst + ' ' + mlast + ' and ' + ffirst + ' ' + flast;
    } else {
      parents = mfirst + ' and ' + ffirst + ' ' + flast;
    }
    mabbr = mfirst.substring(0, 1) + '.';
    fabbr = ffirst.substring(0, 1) + '.';
    if (mabbr == fabbr) {
      mabbr = mfirst;
      fabbr = ffirst;
    }
  } else if (mlast != '') {
    parents = mfirst + ' ' + mlast;
  } else if (flast != '') {
    parents = ffirst + ' ' + flast;
  }
  result.push(parents);
  result.push(street);
  
  if (!$j(pfields[i+11]).prop('checked')) {
    mmail = $j(pfields[i+12]).val();
  }
  if (!$j(pfields[i+13]).prop('checked')) {
    fmail = $j(pfields[i+14]).val();
  }
  if (mmail != '') {
    if (mmail == fmail) {
      fmail = '';
    } else {
      if (mabbr != '') {
        mmail += (' (' + mabbr + ')');
      }
    }
  }
  if (fmail != '') {
    if (fabbr != '') {
      fmail += (' (' + fabbr + ')');
    }
    if (mmail != '') {
      mmail += ('<br>' + fmail);
    } else {
      mmail = fmail;
    }
  }
  result.push(mmail);
  
  if (!$j(pfields[i+15]).prop('checked')) {
    hphone = $j(pfields[i+16]).val();
  }
  if (!$j(pfields[i+17]).prop('checked')) {
    mcell = $j(pfields[i+18]).val();
  }
  if (!$j(pfields[i+19]).prop('checked')) {
    fcell = $j(pfields[i+20]).val();
  }
  if (mcell != '') {
    if (mcell == hphone) {
      mcell = '';
    } else if (mcell == fcell) {
      fcell = '';
    } else {
      if (mabbr != '') {
        mcell += (' (' + mabbr + ')');
      }
    }
  }
  if (fcell != '') {
    if (fcell == hphone) {
      fcell = '';
    } else {
      if (fabbr != '') {
        fcell += (' (' + fabbr + ')');
      }
      if (mcell != '') {
        mcell += ('<br>' + fcell);
      } else {
        mcell = fcell;
      }
    }
  }
  if (hphone != '') {
    if (mcell != '') {
      hphone += ('<br>' + mcell);
    }
  }
  result.push(hphone);
  
  return result;
}


// build 4 table cells: a1, b1, a2, b2
//
// +----+----+
// | a1 | b1 |
// +----+----+
// | a2 | b2 |
// +----+----+
//
// a1 contains sibling names, parent names, street address and emails
// b1 contains phone numbers
// a2 contains parent names, street address and emails for 2nd home
// b2 contains phone numbers for 2nd home

var i;
var sib_names = get_sib_names(sibs);
var a1 = $j('#my_last').val().toUpperCase() + ' ' + sib_names.join(', ');
var home  = get_parents(PRIMARY_PARENTS);
// home array contains 4 elements (possibly empty):
// 0 - parent names (one line)
// 1 - home street address (one line)
// 2 - email addresses ('<br>' separated lines)
// 3 - phone numbers ('<br>' separated lines)
for (i = 0; i < 3; i++) {
  if (home[i] != '') {
    a1 += ('<br>' + home[i]);
  }
}
$j('#preview_a1').html(a1);
$j('#preview_b1').html(home[3]);

var a2 = '';
var home2 = get_parents(SECONDARY_PARENTS);
for (i = 0; i < 3; i++) {
  if (home2[i] != '') {
    if (a2 == '') {
      a2 = home2[i];
    } else {
      a2 += ('<br>' + home2[i]);
    }
  }
}
$j('#preview_a2').html(a2);
$j('#preview_b2').html(home2[3]);
