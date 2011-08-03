jsdom = require('jsdom')
request = require('request')
querystring = require('querystring')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

WarpCookies = require('./warp_cookies').WarpCookies

class Warp
  constructor: ->
    @cookies = new WarpCookies

  # base visit class
  visit: (options) ->
    # append query onto the end of the url

    
    httpOptions =
      url: @urlWithQuery(options.url, options.query)
      headers: {}
      body: querystring.stringify(options.params)

    # add cookies to httpOptions
    @cookies.apply(httpOptions)

    @get httpOptions, (html) =>
      jsdom.env
        html: html
        scripts: [ jQueryPath ]
        done: (errors, window) =>
          options.loaded.apply this, [window.$]

  # wrapper around http 
  get: (options, callbackFunction) ->
    request options, (error, response, body) =>
      @cookies.store(response)
      callbackFunction body

  urlWithQuery: (url, query) ->
    "#{url}?#{querystring.stringify(query)}"

exports.Warp = Warp
