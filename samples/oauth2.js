const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const opn = require('opn');
const destroyer = require('server-destroy');
let server = require('http').Server();
const {google} = require('googleapis');
const plus = google.plus('v1');
var express = require('express');
var app     = express();
app.set('port',  5000);
/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */
const keyPath = path.join(__dirname, 'oauth2.keys.json');
let keys = { redirect_uris: ['http://swaggeryoutube.herokuapp.com/quickstart.html'] };

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
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
function auth() {
const scopes = ['https://www.googleapis.com/auth/plus.me'];
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    });
    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/quickstart') > -1) {
          const qs = querystring.parse(url.parse(req.url).query);
          res.end('Authentication successful! Please return to the console.');
          server.destroy();
          const {tokens} = await oauth2Client.getToken(qs.code);
          oauth2Client.credentials = tokens;
          resolve(oauth2Client);
        }
      } catch (e) {
        reject(e);
      }
    }).listen(3000, () => {
      // open the browser to the authorize url to start the workflow
      opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
    });
    //destroyer(server);
  });
}

async function runSample () {
  // retrieve user profile
  const res = await plus.people.get({ userId: 'me' });
  console.log(res.data);
}

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
});
app.get('/auth', function(request, response) {
    const scopes = ['https://www.googleapis.com/auth/plus.me'];
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' ')
    });
    console.log(authorizeUrl);
    response.end();
})

app.listen(5000, function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
