var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var opn = require('opn');
var destroyer = require('server-destroy');
var server = require('http').Server();
var {google} = require('googleapis');
var plus = google.plus('v1');
var express = require('express');
var app     = express();
app.set('port',  5000);
/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
var keyPath = path.join(__dirname, 'oauth2.keys.json');
var keys = { redirect_uris: ['http://swaggeryoutube.herokuapp.com/quickstart.html'] };

/**
 * Create a new OAuth2 client with the configured keys.
 */
var oauth2Client = new google.auth.OAuth2(
  "838639081436-hjg5pob0as5rrjuf6ce3fnosskvhl8f7.apps.googleusercontent.com",
  "JlDLWHrBDdYvlf3iagqmYn28",
  keys.redirect_uris[0]
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

/**
 * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
 */

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
});
app.get('/auth', function(request, response) {
    var scopes = ['https://www.googleapis.com/auth/plus.me'];
    var authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    });
    console.log(authorizeUrl);
    response.end();
})

app.listen(5000, function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
