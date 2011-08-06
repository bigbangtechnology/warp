jsdom = require('jsdom')
request = require('request')
querystring = require('querystring')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

WarpCookies = require('./warp_cookies').WarpCookies

class Warp
  constructor: (options) ->
    @options = options || {};

    @cookies = new WarpCookies

  # base visit class
  visit: (options) ->
    # append query onto the end of the url

    httpOptions =
      url: @urlWithQuery(options.url, options.query)
      headers: {}
      body: querystring.stringify(options.params)
      method: if options.params then 'POST' else 'GET'

    if options.params
      httpOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded'

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
    @debug("Request options:")
    @debug(options)

    request options, (error, response, body) =>
      @debug("Response headers:")
      @debug(response.headers)

      @cookies.store(response)

      if (response.statusCode == 302)
        options.url = response.headers['location']
        @debug "Redirecting to #{options.url}"

        @cookies.apply(options)
        @get options, callbackFunction
        return

      callbackFunction body

  # loads a cookies into the datastore
  preloadCookie: (cookie) ->
    @cookies.storeOne(cookie)

  urlWithQuery: (url, query) ->
    "#{url}?#{querystring.stringify(query)}"

  debug: (message) ->
    if @options.debug
      console.log message

exports.Warp = Warp
