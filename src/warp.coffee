jsdom = require('jsdom')
http = require('http')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

class Warp
  # base visit class
  visit: (options) ->
    httpOptions =
      host: options.host
      path: options.path
      port: 80
      method: 'GET'

    @get httpOptions, (html) ->
      jsdom.env
        html: html
        scripts: [ jQueryPath ]
        done: (errors, window) ->
          options.loaded window.$

  # wrapper around http 
  get: (options, callbackFunction) ->
    req = http.request options, (res) ->
      html = ""

      res.on 'data', (chunk) -> html += chunk
      res.on 'end', ->
        callbackFunction html

exports.Warp = Warp
