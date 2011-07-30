http = require('http')
fs   = require('fs')
path = require('path')
url  = require('url')

exports.createServer = (port = 6767) ->
  server = http.createServer (req, resp) ->
    # get the path for the file
    documentPath = (url.parse req.url).pathname
    redirectTo(req, resp, documentPath)

  server.listen port
  server.url = "http://localhost:#{port}"
  return server

redirectTo = (req, resp, location) ->
  # grab the json document
  documentJSON = (fs.readFileSync (path.resolve "test/fixtures/#{location}.json"))
  document = JSON.parse(documentJSON)

  # check to see if the page transmits the required cookies
  if document.requireCookies?
    for cookieRequirement in document.requireCookies
      cookieName = cookieRequirement.name
      redirectLocation = cookieRequirement.redirectLocation

      if !req.headers['cookie']?.match(new RegExp cookieName)
        redirectTo req, resp, redirectLocation

  resp.writeHead 200, document.headers
  resp.write(document.body)
  resp.end()
