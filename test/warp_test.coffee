fs = require('fs')
path = require('path')
server = require('./server')

Warp = (require '../src/warp').Warp

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

        @visit
          url: "#{s.url}/securePage"
          loaded: ($) ->
            test.equal $('p').html(), "Secure Page"
            serverTestDone(s, test)

  "You should be able to pre-fill a cookie if you already know it": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.preloadCookie("session=true; path=/")


    sut.visit
      url: "#{s.url}/securePage"
      loaded: ($) ->
        test.equal $('p').html(), "Secure Page"
        serverTestDone(s, test)

  "You should be able to browse to pages which require multiple cookies": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/loginPageMultiple"
      loaded: ($) ->
        @visit
          url: "#{s.url}/securePageMultiple"
          loaded: ($) ->
            test.equal $('p').html(), "Multiple Cookies Secure"
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

  "When you submit post parameters along with a visit, it should post params to the url": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/testPostParams"
      params:
        login: "login"
        password: "password"
      loaded: ($) ->
        test.equal $('#login').html(), "login"
        test.equal $('#password').html(), "password"
        serverTestDone(s, test)

  "When you submit a post which responds with a redirect, it should save any returned cookies and then redirect": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/loginPage"
      loaded: ($) ->
        @visit
          url: "#{s.url}/loginWithRedirectSessionSave"
          params:
            login: "login"
            password: "password"
          loaded: ($) ->
            test.equal $('p').html(), "Secure Page After Redirect"
            serverTestDone(s, test)

  "After visiting a page, 'this' should refer to the instance of Warp": (test) ->
    sut = new Warp

    s = server.createServer()

    sut.visit
      url: "#{s.url}/helloWorld"
      loaded: ($) ->
        test.equal this, sut
        serverTestDone(s, test)
