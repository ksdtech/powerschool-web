var happy = {
  USPhone: function (val) {
    return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}$/.test(val)
  },
  
  USPhoneWithExtension: function (val) {
    return /^\(?(\d{3})\)?[\- ]?\d{3}[\- ]?\d{4}(?:[ ]+x\d+)?$/.test(val)
  },
  
  USState: function(val) {
    return /^[A-Z]{2}$/.test(val);
  },
  
  USZip: function(val) {
    return /^[0-9]{5}(?:[\-][0-9]{4})?$/.test(val);
  },
  
  // matches mm/dd/yyyy
  date: function (val) {
    return /^(?:[1-9]|10|11|12)\/(?:[1-9]|[12][0-9]|3[01])\/(?:\d{4})/.test(val);
  },
  
  selectorIsEmpty: function(arg) {
    var not_blank = jQuery.grep($j(arg), function(el, i) {
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