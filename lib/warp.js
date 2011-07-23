var https = require('https'),
http = require('http'),
jsdom = require('jsdom'),
querystring = require('querystring'),
url = require('url');

var WarpCookies = require('./wormhole_cookies');

module.exports = Warp

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';

var httpStatus = {
  OK: 200,
  FOUND: 302
}

function Warp(config) {
  this.config = config;
  this.defaultOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.8',
      'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
      'Referer': 'http://www.fido.ca/'
    }
  };

  this.cookies = new WarpCookies();
}

Warp.prototype.visit = function(params) {
  var self = this;
  var loadedCallback = self.emptyFunction;

  if (params.loaded instanceof Function)
    loadedCallback = params.loaded;

  var options = self.prepareOptions(params);

  self.logRequest(options);

  if (params.postParams) {
    var body = querystring.stringify(params.postParams);
    options.headers['Content-Length'] = body.length;
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  var req = https.request(options, function(res) {
    self.cookies.save(res);

    var html = "";

    res.setEncoding('utf8');
    res.on('data', function(chunk) { html += chunk });
    res.on('end', function() {
      switch (res.statusCode) {
        case httpStatus.OK:

          self.debug("STATUS: OK");

          jsdom.env({
            html: html,
            scripts: [ jQueryPath ],
            done: function(errors, window) {
              loadedCallback.apply(self, [window.$, html]);
            }
          });
          break;
        case httpStatus.FOUND:
          self.debug("REDIRECT: " + res.headers.location);

          var location = url.parse(res.headers.location, true);

          self.visit({
            host: location.host,
            path: location.pathname,
            method: 'GET',
            queryParams: location.query,
            loaded: function($, html) {
              loadedCallback.apply(self, [$, html]);
            }
          });
          break;
      }
    });
  });

  req.on('error', function(e) {
    self.debug('Problem with request: ' + e.message);
  });

  if (params.postParams) {
    req.end(body);
  } else {
    req.end();
  }
}

Warp.prototype.prepareOptions = function(params) {
  var self = this;

  function clone(object) {
    return JSON.parse(JSON.stringify(object));
  }

  var options = clone(self.defaultOptions);

  if (params.method) {
    options.method = params.method;
  }

  options.host   = params.host;
  options.path   = params.path + "?" + querystring.stringify(params.queryParams);

  if (self.cookies.exist()) {
    options.headers['Cookie'] = self.cookies.retrieve();
    self.debug("Transmitting Cookies: ");
    self.debug(options.headers['Cookie']);
  } else {
    self.debug("Transmitting without cookies");
  }

  return options;
}

Warp.prototype.logRequest = function(options) {
  var self = this;
  self.debug(options.method + " " + options.host + options.path);
}

Warp.prototype.debug = function(message) {
  var self = this;
  if (self.config.debug)
    console.log(message);
}

Warp.prototype.emptyFunction = function() { /* empty on purpose */ };
