fs = require('fs')
path = require('path')
server = require('./server')

Warp = (require '../lib/warp').Warp

serverTestDone = (s, test) ->
  s.close()
  delete s
  test.done()

module.exports =
  "When you perform a GET you should have the page accessible after loaded": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/helloWorld"
      loaded: ($) ->
        test.equal $('p').html(), "Hello World!"
        serverTestDone(s, test)

  "When you visit loginPage which sets a session cookie, you should be able to visit securePage which requires the session cookie": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/loginPage"
      loaded: ($) ->
        test.equal $('p').html(), "Login Page"

        sut.visit
          url: "#{s.url}/securePage"
          loaded: ($) ->
            test.equal $('p').html(), "Secure Page"
            serverTestDone(s, test)

  "When you submit query along with a visit, it should be added to the url": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/testQueryString"
      query:
        q: "SEARCH STRING"
      loaded: ($) ->
        test.equal $('p').html(), "SEARCH STRING"
        serverTestDone(s, test)
