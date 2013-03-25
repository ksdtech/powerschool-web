(function($){
  function trim(el) {
    return (''.trim) ? el.val().trim() : $.trim(el.val());
  }
  $.fn.isHappy = function (config) {
    var fields = [], item;
    
    function setDefaultRadio(radio_group, default_radio) {
      var num_checked = radio_group.filter(':checked').length;
      if (num_checked == 0) {
        $(default_radio).attr('checked', 'checked');
      }
    }
    function getError(error) {
      return $('<span id="'+error.id+'" class="unhappyMessage">'+error.message+'</span>');
    }
    function handleSubmit() {
      var errors = false, i, l;
      for (i = 0, l = fields.length; i < l; i += 1) {
        if (!fields[i].testValid(true)) {
          errors = true;
        }
      }
      if (errors) {
        if (isFunction(config.unHappy)) config.unHappy();
        // PFZ scroll to first error
        if (!config.suppressErrorScroll) {
          var top = $('.unhappy').offset().top;
          if (top > 60) {
            top = top - 60;
          } else {
            top = 0;
          }
          $(window).scrollTop(top);
        }
        return false;
      }
      if (isFunction(config.onSubmit)) {
        config.onSubmit();
      }
      if (config.testMode) {
        if (window.console) console.warn('would have submitted');
        return false;
      }
      return true;
    }
    function isFunction (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    }
    function processField(opts, selector) {
      var field = $(selector),
        error = {
          message: opts.message,
          id: selector.slice(1) + '_unhappy'
        },
        errorEl = $(error.id).length > 0 ? $(error.id) : getError(error);
        
      if (opts.default_radio) {
        setDefaultRadio(field, opts.default_radio);
      }
      fields.push(field);
      field.testValid = function (submit) {
        var val,
          el = $(this),
          gotFunc,
          error = false,
          temp,
          required = !!el.get(0).attributes.getNamedItem('required') || opts.required,
          field_type = el.get(0).type,
          checked_radio,
          has_val = false,
          arg = isFunction(opts.arg) ? opts.arg() : opts.arg;
        
        // special handling for radio buttons
        if (field_type == 'radio') {
          checked_radio = el.filter(':checked');
          has_val = (checked_radio.length != 0);
          val = has_val ? checked_radio.val() : '';
          if (isFunction(opts.clean)) {
            val = opts.clean(val);
          }
        } else {
          // text, password, textarea, or select
          // clean it or trim it
          if (isFunction(opts.clean)) {
            val = opts.clean(el.val());
          } else if (!opts.trim && !(field_type == 'password')) {
            val = trim(el);
          } else {
            val = el.val();
          }
        
          // write it back to the field
          el.val(val);
          has_val = !(val === '');
        }
        
        // get the value
        gotFunc = ((has_val || required === 'sometimes') && isFunction(opts.test));
        
        // check if we've got an error on our hands
        if (submit === true && required === true && !has_val) {
          error = true;
        } else if (gotFunc) {
          error = !opts.test(val, arg);
        }
        if (error) {
          // only first() in case of radio
          el.first().addClass('unhappy').before(errorEl);
          return false;
        }
        
        temp = errorEl.get(0);
        // this is for zepto
        if (temp.parentNode) {
          temp.parentNode.removeChild(temp);
        }
        el.first().removeClass('unhappy');
        return true;
      };
      field.bind(config.when || 'blur', field.testValid);
    }
    
    for (item in config.fields) {
      processField(config.fields[item], item);
    }
    
    if (config.submitButton) {
      $(config.submitButton).click(handleSubmit);
    } else {
      this.bind('submit', handleSubmit);
    }
  };
})(this.jQuery || this.Zepto);