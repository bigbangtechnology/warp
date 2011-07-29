var Warp = require('../lib/warp.js');

var jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js';

exports["When you perform a GET you should have the page accessible after loaded"] = function(test) {
  sut = new Warp();

  sut.visit({
    host: 'example.com',
    path: '/',
    loaded: function($) {
      test.equal($('p').html(), "Hello World!", "The body should have a paragraph with Hello World in it");
      test.done();
    }
  });
}


