var jsdom = require('jsdom'),
fs = require('fs'),
http = require('http');

module.exports = Warp

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';

function Warp() {

}

Warp.prototype.visit = function(options) {
  var httpOptions = {
    host: options.host,
    path: options.path,
    port: 80,
    method: 'GET'
  };

  this.request(httpOptions, function(html) {
    jsdom.env({
      html: html,
      scripts: [ jQueryPath ],
      done: function(errors, window) {
        options.loaded(window.$);
      }
    });
  });
}

Warp.prototype.request = function(options, callbackFunction) {
  var req = http.request(options, function(res) {
    var html = "";

    res.on('data', function(chunk) { html += chunk });
    res.on('end', function() {
      callbackFunction(html);
    });
  });

  req.end();
}
