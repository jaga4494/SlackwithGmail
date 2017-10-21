var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');

var token1 = "token " + "AIzaSyCJ32PZRBxPguu2pS-jUhbPV_69NowLNrQ";
var urlRoot = "https://www.googleapis.com/gmail/v1/users";

var userId1 = "jaga4494";
var listMessage=
{
	"maxResults": 4,
	
} ;

ListMessages();
function ListMessages()
{

	var options = {
		url: urlRoot + '/' + 'jaga4494' + "/messages",
        method: 'GET',
        json: listMessage,
        key: 'AIzaSyCJ32PZRBxPguu2pS-jUhbPV_69NowLNrQ',
       // auth: auth,
        userId: 'me',
        //Authorization: token1,
		
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) 
	{
        console.log( body );
		var obj = JSON.parse(body);
		console.log( obj );
		/*for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].messages;
			console.log( name );
		}*/
	});

}