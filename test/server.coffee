http = require('http')
fs   = require('fs')
path = require('path')
url  = require('url')
ejs  = require('ejs')
querystring = require('querystring')

exports.createServer = (port = 6767) ->
  server = http.createServer (req, resp) ->
    # get the path for the file
    parsedUrl = url.parse req.url, true
    documentPath = parsedUrl.pathname
    redirectTo(req, resp, parsedUrl)

  server.listen port
  server.url = "http://localhost:#{port}"
  return server

redirectTo = (req, resp, parsedUrl) ->
  location = parsedUrl.pathname

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

  body = ""

  req.on 'data', (chunk) ->
    body += chunk

  req.on 'end', ->
    parsedBody = querystring.parse body
    locals = { params: createParams(parsedUrl.query, parsedBody) }
    dynamicBody = ejs.render document.body, { locals: locals }

    resp.writeHead 200, document.headers
    resp.write dynamicBody
    resp.end()

createParams = (query, body) ->
  params = addKeysFrom query, {}
  params = addKeysFrom body, params

  params

addKeysFrom = (object, params) ->
  for key, value of object
    params[key] = value

  params
