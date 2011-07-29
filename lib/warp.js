var jsdom = require('jsdom'),
fs = require('fs');

module.exports = Warp

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';

function Warp() {

}

Warp.prototype.visit = function(options) {
  jsdom.env({
    html: "<p>Hello World!</p>",
    scripts: [ jQueryPath ],
    done: function(errors, window) {
      options.loaded(window.$);
    }
  });
}
