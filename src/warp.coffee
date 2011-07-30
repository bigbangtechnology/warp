jsdom = require('jsdom')
request = require('request')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

WarpCookies = require('./warp_cookies').WarpCookies

class Warp
  constructor: ->
    @cookies = new WarpCookies

  # base visit class
  visit: (options) ->
    httpOptions =
      url: options.url
      headers: {}

    # add cookies to httpOptions
    @cookies.apply(httpOptions)

    @get httpOptions, (html) ->
      jsdom.env
        html: html
        scripts: [ jQueryPath ]
        done: (errors, window) ->
          options.loaded window.$

  # wrapper around http 
  get: (options, callbackFunction) ->
    request options, (error, response, body) =>
      @cookies.store(response)
      callbackFunction body


exports.Warp = Warp
