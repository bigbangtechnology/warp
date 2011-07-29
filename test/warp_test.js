var Warp = require('../lib/warp.js');





exports["When you perform a GET you should have the page accessible after loaded"] = function(test) {
  sut = new Warp();

  sut.request = function(options, callbackFunction) {
    callbackFunction("<p>Hello World!</p>");
  }

  sut.visit({
    host: 'example.com',
    path: '/',
    loaded: function($) {
      test.equal($('p').html(), "Hello World!");
      test.done();
    }
  });
}
