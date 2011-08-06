jsdom = require('jsdom')
request = require('request')
querystring = require('querystring')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

WarpCookies = require('./warp_cookies').WarpCookies

class Warp
  constructor: (options) ->
    @options = options || {}

    @cookies = new WarpCookies

  postJSON: (options) ->
    httpOptions = @processOptions options
    httpOptions.method = 'POST'
    @get httpOptions, (json) =>
      options.loaded.apply this, [JSON.parse(json)]

  getJSON: (options) ->
    httpOptions = @processOptions options

    @get httpOptions, (json) =>
      options.loaded.apply this, [JSON.parse(json)]

  # base visit class
  visit: (options) ->
    httpOptions = @processOptions options

    @get httpOptions, (html) =>
      jsdom.env
        html: html
        scripts: [ jQueryPath ]
        done: (errors, window) =>
          options.loaded.apply this, [window.$]

  processOptions: (options) ->
    httpOptions =
      url: @urlWithQuery(options.url, options.query)
      headers: {}
      body: querystring.stringify(options.params)
      method: if options.params then 'POST' else 'GET'

    if options.params
      httpOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    # add cookies to httpOptions
    @cookies.apply(httpOptions)

    httpOptions

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
