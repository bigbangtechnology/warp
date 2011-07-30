Warp = (require '../lib/warp').Warp

module.exports =
  "When you perform a GET you should have the page accessible after loaded": (test) ->
    sut = new Warp

    sut.get = (options, callbackFunction) ->
      callbackFunction "<p>Hello World!</p>"

    sut.visit
      url: 'http://example.com/'
      loaded: ($) ->
        test.equal $('p').html(), "Hello World!"
        test.done()

  "When you visit http://google.ca you redirect to http://www.google.ca!": (test) ->
    sut = new Warp

    sut.visit
      url: 'http://google.ca'
      loaded: ($) ->
        test.equal $('title').text(), "Google"
        test.done()
