(function() {
  var Warp, jQueryPath, jsdom, request;
  jsdom = require('jsdom');
  request = require('request');
  jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
  Warp = (function() {
    function Warp() {}
    Warp.prototype.visit = function(options) {
      var httpOptions;
      httpOptions = {
        url: options.url
      };
      return this.get(httpOptions, function(html) {
        return jsdom.env({
          html: html,
          scripts: [jQueryPath],
          done: function(errors, window) {
            return options.loaded(window.$);
          }
        });
      });
    };
    Warp.prototype.get = function(options, callbackFunction) {
      return request(options, function(error, response, body) {
        return callbackFunction(body);
      });
    };
    return Warp;
  })();
  exports.Warp = Warp;
}).call(this);
