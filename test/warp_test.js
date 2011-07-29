var jsdom = require('jsdom'),
fs = require('fs');

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';

exports["When you perform a GET you should have the page accessible after loaded"] = function(test) {
  sut = {
    visit: function(options) {
      jsdom.env({
        html: "<p>Hello World!</p>",
        scripts: [ jQueryPath ],
        done: function(errors, window) {
          options.loaded(window.$);
        }
      });
    }
  }

  sut.visit({
    host: 'http://example.com',
    path: '/',
    loaded: function($) {
      test.equal($('p').html(), "Hello World!", "The body should have a paragraph with Hello World in it");
      test.done();
    }
  });
}
