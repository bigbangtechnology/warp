
exports["When you perform a GET you should have the page accessible after loaded"] = function(test) {
  sut = {
    visit: function(options) {
      options.loaded(function() {
        return {
          html: function() {
            return "Hello World!";
          }

        }
      }, null);
    }
  }

  sut.visit({
    host: 'http://example.com',
    path: '/',
    loaded: function($, html) {
      test.equal($('p').html(), "Hello World!", "The body should have a paragraph with Hello World in it");
      test.done();
    }
  });
}
