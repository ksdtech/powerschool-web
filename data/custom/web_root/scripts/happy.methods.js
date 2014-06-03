var happy = {
  USPhone: function (val) {
    return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}$/.test(val)
  },
  
  USPhoneWithExtension: function (val) {
    return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}(?:[ ]+x\d+)?$/.test(val)
  },
  
  USState: function(val) {
    if (val == '') {
      return false;
    }
    var states = [
      "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
      "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
      "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
      "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
      "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
      "AS","DC","FM","GU","MH","MP","PW","PR","VI" ];
    var i = $j.inArray(val.toUpperCase(), states);
    return (i >= 0);
  },
  
  USZip: function(val) {
    return /^[0-9]{5}(?:[\-][0-9]{4})?$/.test(val);
  },
  
  // matches mm/dd/yyyy
  date: function (val) {
    return /^(?:[0]?[1-9]|10|11|12)\/(?:[0]?[1-9]|[12][0-9]|3[01])\/(?:\d{4})/.test(val);
  },
  
  selectorIsEmpty: function(arg) {
    var not_blank = $j.grep($j(arg), function(el, i) {
      var thisEl = $j(el);
      if ((el.type == 'checkbox' || el.type == 'radio') && thisEl.filter(':checked').length == 0) {
        return false;
      }
      return !(thisEl.val() === '');
    });
    return (not_blank.length == 0);
  },
  
  requiredIfArgNotEmpty: function(val, arg) {
    if (!(val === '')) {
      return true;
    }
    return happy.selectorIsEmpty(arg);
  },
  
  // See wikipedia on permitted characters in local part of email addresses:
  // http://en.wikipedia.org/wiki/Email_address
  email: function (val) {
    return /^[-a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~]+@[-a-zA-Z0-9\.]+\.[a-zA-Z]{2,4}$/.test(val);
  },
  
  minLength: function (val, length) {
    return val.length >= length;
  },
  
  maxLength: function (val, length) {
    return val.length <= length;
  },
  
  equal: function (val1, val2) {
    return (val1 == val2);
  },
  
  emptyOrDate: function (val) {
    return (val === '' || happy.date(val));
  },
  
  emptyOrEmail: function (val) {
    return (val === '' || happy.email(val));
  },

  emptyOrUSPhoneWithExtension: function (val) {
    return (val === '' || happy.USPhoneWithExtension(val));
  }
};