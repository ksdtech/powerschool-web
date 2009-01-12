// module pattern
var ParentPhones = function() {
  // "private" variables:
  var phones = new Array;

  // "private" methods:
  function find_phone(phone) {
    var i = 0;
    for (i = 0; i < phones.length && phones[i].phone != phone; i++) { }
    if (i >= phones.length) {
      phones[i] = {"phone": phone, "priority": 0};
    }
    return i;
  };
  
  function set_phone(phone, priority) {
    var i = find_phone(phone);
    phones[i].priority += priority;
  }
  
  function sort_phones() {
    phones.sort(function(a, b) {
      if (a.priority == b.priority) { return 0; }
      if (a.priority > b.priority) { return -1; }
      return 1;
    });
  }
  
  // return "public" methods:
  return {
    load_and_sort_phones: function(plist) {
      for (var i = 0; i < plist.length; i += 2) {
        var phone = plist[i+1];
        var ptype = plist[i].toLowerCase();
        var priority = 0;
        if (ptype == 'mother_cell' || ptype == 'mother2_cell') {
          priority += 4;
        }
        if (ptype == 'father_cell' || ptype == 'father2_cell') {
          priority += 2;
        }
        if (ptype == 'mother_work_phone' || ptype == 'mother2_work_phone') {
          priority += 1;
        }
        set_phone(phone, priority);
      }
      sort_phones();
    },
  
    get_options: function(idx, sels) {
      var options = '<option value="">Choose a phone number:</option>';
      for (var i = 0; i < phones.length; i++) {
        var phone = phones[i].phone;
        for (var j = 0; j < idx; j++) { 
          if (phone == sels[j]) {
            phone = null;
            break;
          }
        }
        if (phone != null) {
          options += "<option value=\"" + phone + "\"";
          if (phone == sels[idx]) {
            options += " selected=\"selected\"";
          }
          options += ">" + phone + "</option>";
        }
      }
      return options;
    }
  };  
} (); // initialize anonymous function

// these will be set in html file
var all_phones;
var init_sels;

function on_contact_change(idx) {
  var sels = [ "", "", "" ];
  if (idx == 0) {
    // initialization
    ParentPhones.load_and_sort_phones(all_phones);
    sels[0] = init_sels[0];
    sels[1] = init_sels[1];
    sels[2] = init_sels[2];
  } else {
    // menu selection
    sels[0] = jQuery("#contact_1 option:selected").val();
    if (idx >= 2) {
      sels[1] = jQuery("#contact_2 option:selected").val();
    }
  }
  for (var i = idx; i < 3; i++) {
    var options = ParentPhones.get_options(i, sels);
    jQuery("#contact_" + (i+1)).html(options);
  }
}

function set_form_updated() {
  jQuery("#upd_by").val(jQuery("#userid").val()); 
  jQuery("#upd_at").val(timestamp_now()); 
  return true;
}

// encode the field type in the class of the input (text field)
// form should also have three hidden fields with these ids:
//  #userid (no name) should have a value of ~[x:userid]
//  #upd_by should use a custom field name like [05]form0_updated_by
//  #upd_at should use a custom field name like [05]form0_updated_at
jQuery(document).ready(function() {
  // do stuff when user submits
  jQuery("#attSubmitButton").bind("click", function(e) { 
    if (!jQuery("#upd_by").hasClass("disabled")) { set_form_updated(); }
  });
  // format field values for specific input types
  jQuery("#admin_update").bind("click", function() {
    if (jQuery("#admin_update").attr("checked")) { set_form_updated(); }
  });
  jQuery(".private").hide();
  // load everything!
  on_contact_change(0);
});
