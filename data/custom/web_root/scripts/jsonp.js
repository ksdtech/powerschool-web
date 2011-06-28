// Lightweight JSONP fetcher - www.nonobstrusive.com
var JSONP = (function(){
  var counter = 0, head, query, key, window = this;
  
  function load(url) {
    var script = document.createElement('script'), done = false;
    script.src = url;
    script.async = true;
    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };
    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  }
  
  function jsonp(url, params, callback) {
    query = "?";
    params = params || {};
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        query += key + "=" + params[key] + "&";
      }
    }
    var jsonp = "json" + (++counter);
    window[jsonp] = function(data) {
      callback(data);
      window[jsonp] = null;
      try {
        delete window[jsonp];
      } catch (e) {}
    };
    load(url + query + "callback=" + jsonp);
    return jsonp;
  }
  return {
    get:jsonp
  };
}());
