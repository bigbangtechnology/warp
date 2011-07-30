jsdom = require('jsdom')
request = require('request')

jQueryPath = 'http://code.jquery.com/jquery-1.4.2.min.js'

class Warp
  # base visit class
  visit: (options) ->
    httpOptions =
      url: options.url

    @get httpOptions, (html) ->
      jsdom.env
        html: html
        scripts: [ jQueryPath ]
        done: (errors, window) ->
          options.loaded window.$

  # wrapper around http 
  get: (options, callbackFunction) ->
    request options, (error, response, body) ->
      callbackFunction body

exports.Warp = Warp
