(function() {
  var Warp, WarpCookies, jQueryPath, jsdom, request;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jsdom = require('jsdom');
  request = require('request');
  jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
  WarpCookies = require('./warp_cookies').WarpCookies;
  Warp = (function() {
    function Warp() {
      this.cookies = new WarpCookies;
    }
    Warp.prototype.visit = function(options) {
      var httpOptions;
      httpOptions = {
        url: options.url,
        headers: {}
      };
      this.cookies.apply(httpOptions);
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
      return request(options, __bind(function(error, response, body) {
        this.cookies.store(response);
        return callbackFunction(body);
      }, this));
    };
    return Warp;
  })();
  exports.Warp = Warp;
}).call(this);
