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
      var cookies, rawEntry, _i, _len, _results;
      if (this.empty(response)) {
        return;
      }
      cookies = response.headers['set-cookie'];
      _results = [];
      for (_i = 0, _len = cookies.length; _i < _len; _i++) {
        rawEntry = cookies[_i];
        _results.push(this.storeOne(rawEntry));
      }
      return _results;
    };
    WarpCookies.prototype.storeOne = function(rawEntry) {
      var details, key, value, _ref;
      details = rawEntry.split(";")[0];
      _ref = details.split("="), key = _ref[0], value = _ref[1];
      return this.cookieStore[key] = value;
    };
    WarpCookies.prototype.empty = function(response) {
      return !(response.headers['set-cookie'] != null);
    };
    return WarpCookies;
  })();
  exports.WarpCookies = WarpCookies;
}).call(this);
