class WarpCookies
  constructor: ->
    @cookieStore = {}

  # applies to cookie to the http options object
  apply: (httpOptions) ->
    return unless @hasCookies()

    httpOptions.headers['Cookie'] = @getString()

  # checks to see if we have cookies stored
  hasCookies: ->
    if @getString().length > 0
      return true
    else
      return false

  # converts the internal cookie store into a cookie string
  getString: ->
    cookieString = ""

    for key, value of @cookieStore
      cookieString += "#{key}=#{value}"

    return cookieString

  # saves the cookies for transmission on subsequent requests
  store: (response) ->
    return if @empty(response)
    cookies = response.headers['set-cookie'];

    for rawEntry in cookies
      # we're only concerned with the cookie details
      details = rawEntry.split(";")[0]
      [key, value] = details.split("=")
      @cookieStore[key] = value

  # returns true of the response has no cookies
  empty: (response) ->
    !response.headers['set-cookie']?

exports.WarpCookies = WarpCookies

