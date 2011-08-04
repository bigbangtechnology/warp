(function() {
  var Warp, WarpCookies, jQueryPath, jsdom, querystring, request;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jsdom = require('jsdom');
  request = require('request');
  querystring = require('querystring');
  jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
  WarpCookies = require('./warp_cookies').WarpCookies;
  Warp = (function() {
    function Warp() {
      this.cookies = new WarpCookies;
    }
    Warp.prototype.visit = function(options) {
      var httpOptions;
      httpOptions = {
        url: this.urlWithQuery(options.url, options.query),
        headers: {},
        body: querystring.stringify(options.params),
        method: options.params ? 'POST' : 'GET'
      };
      if (options.params) {
        httpOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      this.cookies.apply(httpOptions);
      return this.get(httpOptions, __bind(function(html) {
        return jsdom.env({
          html: html,
          scripts: [jQueryPath],
          done: __bind(function(errors, window) {
            return options.loaded.apply(this, [window.$]);
          }, this)
        });
      }, this));
    };
    Warp.prototype.get = function(options, callbackFunction) {
      return request(options, __bind(function(error, response, body) {
        this.cookies.store(response);
        return callbackFunction(body);
      }, this));
    };
    Warp.prototype.urlWithQuery = function(url, query) {
      return "" + url + "?" + (querystring.stringify(query));
    };
    return Warp;
  })();
  exports.Warp = Warp;
}).call(this);
