
// Sibling data filled in by tlist_sql based on Family_Ident matches
// <input type="hidden" class="sibdata" id="sib_stuid_113960" value="17660" />
// <input type="hidden" class="sibdata" id="sib_famid_113960" value="REDLD3FE" />
// <input type="hidden" class="sibdata" id="sib_first_113960" value="Ethan" />
// <input type="hidden" class="sibdata" id="sib_last_113960" value="Redlin" />
// <input type="hidden" class="sibdata" id="sib_grade_113960" value="0" />
// <input type="hidden" class="sibdata" id="sib_nick_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_unlisted_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_approved_113960" value="" />
// <input type="hidden" class="sibdata" id="sib_approval_113960" value="" />

var sibs = [ ]
var sib_data = { }
var sibs_unlisted = [ ]
var last_sib_approved = null;
var last_approval = null;
var sib_names = [ ];

function get_sibling_data() {
  var my_sid = 'S' + $j('#my_id').val();
  var fam_id = null;
  $j('.sibfamid').each(function(i, el) {
    var val = el.value;
    if (!fam_id && val != '') { fam_id = val; }
  });

  $j('.sibdata').each(function(i, el) {
    var m = el.id.match(/sib_([a-z]+)_([0-9]+)/);
    if (m) {
      var attr = m[1];
      var sid = 'S' + m[2];
      if (fam_id || my_sid == sid) {
        if (!(sid in sib_data)) {
          sibs.push(sid);
          sib_data[sid] = { }
        };
        sib_data[sid][attr] = el.value;
      }
    }
  });
  
  // Pick nickname if they have one
  // See if other sibs have approved a preview or asked to be unlisted
  for (var i = 0; i < sibs.length; i++) {
    var sid = sibs[i];
    var the_sib = sib_data[sid];
    if (the_sib.nick != '') {
      the_sib.first = the_sib.nick;
    }
  }

  // Sort by grade and name
  sibs.sort(function(a, b) {
    var by_grade = parseInt(sib_data[a].grade) - parseInt(sib_data[b].grade);
    if (by_grade != 0) { return by_grade; }
    return sib_data[a].first.localeCompare(sib_data[b].first);
  });
  
  var unlisted_ul = $j('#unlisted_siblings');
  var approved_ul = $j('#approved_siblings');
  for (var i = 0; i < sibs.length; i++) {
    var sid = sibs[i];
    var the_sib = sib_data[sid];
    if (!/^nr-/.test(the_sib.status)) {
      var grade = the_sib.grade;
      if (grade == '0') { grade = 'K' }
      sib_names.push(the_sib.first + ' (' + grade + ')');
    }
    if (sid != my_sid) {
      if (the_sib.unlisted == 'Y') {
        sibs_unlisted.push(sid);
        unlisted_ul.append('<li><a href="javascript:switchStudent(' + the_sib.stuid + ');">' + the_sib.first + ' ' + the_sib.last + '</a></li>');
      } else {
        if (the_sib.approved == '1' && the_sib.approval != '') {
          if (last_approval == null || the_sib.approval.localCompare(last_approval)) {
            last_sib_approved = sid;
            last_approval = the_sib.approval;
            approved_ul.append('<li><a href="javascript:switchStudent(' + the_sib.stuid + ');">' + the_sib.first + ' ' + the_sib.last + '</a></li>');
          }
        }
      }
    }
  }  
  
  
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
  if (mcell != '') {
    if (hphone == '') {
      hphone = mcell;
    } else {
      hphone += ('<br>' + mcell);
    }
  }
  result.push(hphone);
  
  return result;
}

function update_preview() {
  $j('.kpreview_off').hide();
 
  var other_unlisted = sibs_unlisted.length > 0;
  var this_unlisted  = $j('#kikdir_unlisted_y').prop('checked');
  var no_preview = this_unlisted || other_unlisted || last_sib_approved;
  if (no_preview) {
    $j('.kpreview_on').hide();
    $j('#preview_approved').prop('checked', false).prop('disabled', true)
    if (this_unlisted) {
      $j('#this_unlisted').show();
    }
    else if (other_unlisted) {
      $j('#other_unlisted').show();
    }
    else if (last_sib_approved) {
      var the_sib = sib_data[last_sib_approved];
      $j('#other_approved').show();
    }
    return;
  }

  $j('#preview_approved').prop('disabled', false);
  $j('.kpreview_on').show();
  
  var i;
  var a1 = $j('#my_last').val().toUpperCase() + ' ' + sib_names.join(', ');
  var home  = get_parents(PRIMARY_PARENTS);
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
  return true;
}
