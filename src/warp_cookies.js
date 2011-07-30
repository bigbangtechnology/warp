module.exports = WarpCookies;

// stores cookies in a unique table and outputs them to a string
function WarpCookies() {
  this.cookieStore = {};
  this.length = 0;
}


// saves any response cookies into the cookie store, keys are unique
// and we'll overwrite any duplicates
WarpCookies.prototype.save = function(res) {
  var self = this;

  if (res.headers['set-cookie'] == undefined)
    return;

  var returnedCookies = res.headers['set-cookie'];

  returnedCookies.forEach(function(rawCookie) {
    var cookieColumns = rawCookie.split(";");
    var cookieKeyValue = cookieColumns[0].split("=");

    //console.log("Saving cookie: " + cookieKeyValue);

    var cookieKey = cookieKeyValue[0];
    var cookieValue = cookieKeyValue[1];

    // this will be sure to overwrite any stored cookies
    self.cookieStore[cookieKey] = cookieValue;
    self.length += 1;
  });
}

// retrieves cookies into a semi-colon seperated string
WarpCookies.prototype.retrieve = function() {
  var self = this;

  var rawCookies = [];

  for (var key in self.cookieStore) {
    rawCookies.push(key + "=" + self.cookieStore[key]);
  }

  return rawCookies.join("; ");
}

WarpCookies.prototype.exist = function() {
  var self = this;

  return self.length > 0;
}
