(function() {
  var Warp, http, jQueryPath, jsdom;
  jsdom = require('jsdom');
  http = require('http');
  jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
  Warp = (function() {
    function Warp() {}
    Warp.prototype.visit = function(options) {
      var httpOptions;
      httpOptions = {
        host: options.host,
        path: options.path,
        port: 80,
        method: 'GET'
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
      var req;
      return req = http.request(options, function(res) {
        var html;
        html = "";
        res.on('data', function(chunk) {
          return html += chunk;
        });
        return res.on('end', function() {
          return callbackFunction(html);
        });
      });
    };
    return Warp;
  })();
  exports.Warp = Warp;
}).call(this);
