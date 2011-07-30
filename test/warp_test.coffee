Warp = (require '../lib/warp').Warp

module.exports =
  "When you perform a GET you should have the page accessible after loaded": (test) ->
    sut = new Warp

    sut.get = (options, callbackFunction) ->
      callbackFunction "<p>Hello World!</p>"

    sut.visit
      host: 'example.com'
      path: '/'
      loaded: ($) ->
        console.log "LOADED!"
        test.equal $('p').html(), "Hello World!"
        test.done()
