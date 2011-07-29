var Warp = require('../lib/warp.js');


exports["When you perform a GET you should have the page accessible after loaded"] = function(test) {
  sut = new Warp();

  var mockHttpResponse = {};

  sut.visit({
    host: 'www.google.ca',
    path: '/',
    loaded: function($) {
      test.ok($('#addlang').html().match(/Google.ca/));
      test.done();
    }
  });
}


