(function() {
  var WarpCookies;
  WarpCookies = (function() {
    function WarpCookies() {
      this.cookieStore = {};
    }
    WarpCookies.prototype.apply = function(httpOptions) {
      if (!this.hasCookies()) {
        return;
      }
      return httpOptions.headers['Cookie'] = this.getString();
    };
    WarpCookies.prototype.hasCookies = function() {
      if (this.getString().length > 0) {
        return true;
      } else {
        return false;
      }
    };
    WarpCookies.prototype.getString = function() {
      var cookies, key, value, _ref;
      cookies = [];
      _ref = this.cookieStore;
      for (key in _ref) {
        value = _ref[key];
        cookies.push("" + key + "=" + value);
      }
      return cookies.join(";");
    };
    WarpCookies.prototype.store = function(response) {
      var cookies, details, key, rawEntry, value, _i, _len, _ref, _results;
      if (this.empty(response)) {
        return;
      }
      cookies = response.headers['set-cookie'];
      _results = [];
      for (_i = 0, _len = cookies.length; _i < _len; _i++) {
        rawEntry = cookies[_i];
        details = rawEntry.split(";")[0];
        _ref = details.split("="), key = _ref[0], value = _ref[1];
        _results.push(this.cookieStore[key] = value);
      }
      return _results;
    };
    WarpCookies.prototype.empty = function(response) {
      return !(response.headers['set-cookie'] != null);
    };
    return WarpCookies;
  })();
  exports.WarpCookies = WarpCookies;
}).call(this);
