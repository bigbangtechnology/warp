(function() {
  var Warp, WarpCookies, jQueryPath, jsdom, querystring, request;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jsdom = require('jsdom');
  request = require('request');
  querystring = require('querystring');
  jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';
  WarpCookies = require('./warp_cookies').WarpCookies;
  Warp = (function() {
    function Warp(options) {
      this.options = options || {};
      this.cookies = new WarpCookies;
    }
    Warp.prototype.postJSON = function(options) {
      var httpOptions;
      httpOptions = this.processOptions(options);
      httpOptions.method = 'POST';
      return this.get(httpOptions, __bind(function(json) {
        return options.loaded.apply(this, [JSON.parse(json)]);
      }, this));
    };
    Warp.prototype.getJSON = function(options) {
      var httpOptions;
      httpOptions = this.processOptions(options);
      return this.get(httpOptions, __bind(function(json) {
        return options.loaded.apply(this, [JSON.parse(json)]);
      }, this));
    };
    Warp.prototype.visit = function(options) {
      var httpOptions;
      httpOptions = this.processOptions(options);
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
    Warp.prototype.processOptions = function(options) {
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
      return httpOptions;
    };
    Warp.prototype.get = function(options, callbackFunction) {
      this.debug("Request options:");
      this.debug(options);
      return request(options, __bind(function(error, response, body) {
        this.debug("Response headers:");
        this.debug(response.headers);
        this.cookies.store(response);
        if (response.statusCode === 302) {
          options.url = response.headers['location'];
          this.debug("Redirecting to " + options.url);
          this.cookies.apply(options);
          this.get(options, callbackFunction);
          return;
        }
        return callbackFunction(body);
      }, this));
    };
    Warp.prototype.preloadCookie = function(cookie) {
      return this.cookies.storeOne(cookie);
    };
    Warp.prototype.urlWithQuery = function(url, query) {
      return "" + url + "?" + (querystring.stringify(query));
    };
    Warp.prototype.debug = function(message) {
      if (this.options.debug) {
        return console.log(message);
      }
    };
    return Warp;
  })();
  exports.Warp = Warp;
}).call(this);
