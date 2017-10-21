<<<<<<< HEAD
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
const base64url = require('base64url');
const opn = require('opn');
var nock = require('nock');
//var urlRoot = "https://www.googleapis.com/gmail/v1/users";

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
 // authorize(JSON.parse(content), listLabels);
//  authorize(JSON.parse(content), listDrafts);
  authorize(JSON.parse(content), getMessage);
 // authorize(JSON.parse(content), ListMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    //console.log('- %s', labels);
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

//Filter and List Messages
function ListMessages(auth) {
  var gmail = google.gmail('v1');
  var query= "from: notifications@github.com view pull request";
  nock('https://www.googleapis.com/gmail/v1/users')
	.get('/jaga4494/messages').reply(200, {
		username: 'davidwalshblog',
		firstname: 'David'
	});
  return new Promise(function (resolve, reject) 
	{

  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
    q: query,
  }, 
  
  function(err, response,body) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var obj = JSON.parse(body);
    resolve(obj);

    /*
    var msgs = response.messages;
    console.log('- %s', msgs);
    if (msgs.length == 0) {
      console.log('No message found.');
    } else {
      console.log('Message:');
      
      
        //console.log('- %s', msgs.messages[1].id);
        
        for (var i = 0; i < msgs.length; i++) {
          var msg = msgs[i];
          console.log('- %s', msg.id);
        }
        
    }*/
  });
});
}

//Get a Message
function getMessage(auth) {
    var gmail = google.gmail('v1');
    gmail.users.messages.get({
      auth: auth,
      userId: 'me',
      id: '15f0987549e59c85',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var msg = response;
      //console.log('- %s', msg);
      if (msg.length == 0) {
        console.log('No message found.');
      } else {
        console.log('Message:');
        var snippet=msg.snippet;
        console.log('- %s', snippet);

        console.log('Pull number');
        var re = new RegExp('/pull/(.*) Commit'); // to get pull number ie 9
        var ans=snippet.match(re);
        //console.log('- %s', ans[1]);

        console.log('Pull link');
        var re1 = new RegExp(': (.*) Commit');  // to get link ie https://github.com/jaga4494/testrepo/pull/1
        var ans1=snippet.match(re1);
        //console.log('- %s', ans1[1]);

        console.log('Repo Name');
        var re2 = new RegExp('github.com/(.*)/(.*)/pull');  // to get Repo Name ie testrepo
        var ans2=snippet.match(re2);
        //console.log('- %s', ans2[2]);

        
          //console.log('- %s', msg.labelIds);// display msg labels
          var msgbody=msg.payload.parts[0].body;
          console.log('-----------------------Base64url Message -----------------------------');
          console.log('- %s', msgbody.data);//display msg in base64 url format
          console.log('-----------------------Original Message -----------------------------');
          var convertedString = base64url.decode(msgbody.data);// get the original message
          console.log('- %s', convertedString);
          console.log('Pull link');
          
          // get the pull request link
          var pullLink = convertedString.split(/Reply to this email directly or view it on GitHub:/)[1].split(/\r\n/)[1];
          
          console.log('%s', pullLink);
          opn(pullLink); //opens in the browser
          //console.log('- %s', answer11[2]);
          console.log('Pull number');
          var ans11=convertedString.match(re1);
          //console.log('- %s', ans11[1]);
          //console.log('- %s', msgbody.size); //display json size attribute size
          
          /*
          for (var i = 0; i < msgbody.length; i++) {
            var msg1 = msgbody[i];
            console.log('- %s', msg1.size);
          }*/
           
      }
    });
  }
//List Drafts
function listDrafts(auth) {
    var gmail = google.gmail('v1');
    gmail.users.drafts.list({
      auth: auth,
      userId: 'me',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var drafts = response.drafts;
      if (drafts.length == 0) {
        console.log('No drafts found.');
      } else {
        console.log('Drafts:');
        for (var i = 0; i < drafts.length; i++) {
          var draft = drafts[i];
          console.log('- %s', draft.id);
        }
      }
    });
  }
  
=======
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
const base64url = require('base64url');
const opn = require('opn');
var nock = require('nock');
//var urlRoot = "https://www.googleapis.com/gmail/v1/users";

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
 // authorize(JSON.parse(content), listLabels);
//  authorize(JSON.parse(content), listDrafts);
  authorize(JSON.parse(content), getMessage);
 // authorize(JSON.parse(content), ListMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    //console.log('- %s', labels);
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

//Filter and List Messages
function ListMessages(auth) {
  var gmail = google.gmail('v1');
  var query= "from: notifications@github.com view pull request";
  nock('https://www.googleapis.com/gmail/v1/users')
	.get('/jaga4494/messages').reply(200, {
		username: 'davidwalshblog',
		firstname: 'David'
	});
  return new Promise(function (resolve, reject) 
	{

  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
    q: query,
  }, 
  
  function(err, response,body) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var obj = JSON.parse(body);
    resolve(obj);

    /*
    var msgs = response.messages;
    console.log('- %s', msgs);
    if (msgs.length == 0) {
      console.log('No message found.');
    } else {
      console.log('Message:');
      
      
        //console.log('- %s', msgs.messages[1].id);
        
        for (var i = 0; i < msgs.length; i++) {
          var msg = msgs[i];
          console.log('- %s', msg.id);
        }
        
    }*/
  });
});
}

//Get a Message
function getMessage(auth) {
    var gmail = google.gmail('v1');
    gmail.users.messages.get({
      auth: auth,
      userId: 'me',
      id: '15f0987549e59c85',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var msg = response;
      //console.log('- %s', msg);
      if (msg.length == 0) {
        console.log('No message found.');
      } else {
        console.log('Message:');
        var snippet=msg.snippet;
        console.log('- %s', snippet);

        console.log('Pull number');
        var re = new RegExp('/pull/(.*) Commit'); // to get pull number ie 9
        var ans=snippet.match(re);
        //console.log('- %s', ans[1]);

        console.log('Pull link');
        var re1 = new RegExp(': (.*) Commit');  // to get link ie https://github.com/jaga4494/testrepo/pull/1
        var ans1=snippet.match(re1);
        //console.log('- %s', ans1[1]);

        console.log('Repo Name');
        var re2 = new RegExp('github.com/(.*)/(.*)/pull');  // to get Repo Name ie testrepo
        var ans2=snippet.match(re2);
        //console.log('- %s', ans2[2]);

        
          //console.log('- %s', msg.labelIds);// display msg labels
          var msgbody=msg.payload.parts[0].body;
          console.log('-----------------------Base64url Message -----------------------------');
          console.log('- %s', msgbody.data);//display msg in base64 url format
          console.log('-----------------------Original Message -----------------------------');
          var convertedString = base64url.decode(msgbody.data);// get the original message
          console.log('- %s', convertedString);
          console.log('Pull link');
          
          // get the pull request link
          var pullLink = convertedString.split(/Reply to this email directly or view it on GitHub:/)[1].split(/\r\n/)[1];
          
          console.log('%s', pullLink);
          opn(pullLink); //opens in the browser
          //console.log('- %s', answer11[2]);
          console.log('Pull number');
          var ans11=convertedString.match(re1);
          //console.log('- %s', ans11[1]);
          //console.log('- %s', msgbody.size); //display json size attribute size
          
          /*
          for (var i = 0; i < msgbody.length; i++) {
            var msg1 = msgbody[i];
            console.log('- %s', msg1.size);
          }*/
           
      }
    });
  }
//List Drafts
function listDrafts(auth) {
    var gmail = google.gmail('v1');
    gmail.users.drafts.list({
      auth: auth,
      userId: 'me',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var drafts = response.drafts;
      if (drafts.length == 0) {
        console.log('No drafts found.');
      } else {
        console.log('Drafts:');
        for (var i = 0; i < drafts.length; i++) {
          var draft = drafts[i];
          console.log('- %s', draft.id);
        }
      }
    });
  }
  
>>>>>>> 1ac12b62325115aa1ee669df4527fce619813e9d
  exports.ListMessages=ListMessages;