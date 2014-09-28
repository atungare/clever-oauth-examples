var quest = require('quest');

var CLIENT_URI = 'https://localhost';
var PORT = 8000;
var CLEVER_CLIENT_ID = 'x';
var CLEVER_CLIENT_SECRET = 'y';
var CLEVER_CLIENT_REDIRECT = CLIENT_URI + ':' + PORT + '/oauth';
var CLEVER_API_BASE = 'https://api.clever.com';

var express = require('express');
var app = express();

app.get('/oauth', function(req, res){
	if (! req.query.code) {
		res.status(400).end();
	  console.log('Error: code not provided');
	} else {
	  res.status(200).end();

	  console.log('Code is:', req.query.code);

	  var codeExchangeOptions = {
	  	uri: CLEVER_API_BASE + '/oauth/token',
	  	method: 'POST',
	  	headers: {
	  		Authorization: 'Basic ' + new Buffer(CLEVER_CLIENT_ID + ":" + CLEVER_CLIENT_SECRET).toString('base64')
	  	},
	  	json: {
	  		code: req.query.code,
	  		grant_type: 'authorization_code',
	  		redirect_uri: CLEVER_CLIENT_REDIRECT
	  	}
	  };

	  quest(codeExchangeOptions, function (err, resp, body) {
	  	if (! body.access_token) {
	  	  console.log('Error: invalid code');
	  	} else {
	  		console.log('Access Token is:', body.access_token);
	  		console.log('Using token to look up user information.');

	  		var userLookupOptions = {
	  			uri: CLEVER_API_BASE + '/me',
	  			headers: {
			  		Authorization: 'Bearer ' + body.access_token
			  	},
	  		};

	  		quest(userLookupOptions, function (err, resp, body) {
	  			if (! body.data) {
			  	  console.log('Error: invalid access token');
			  	} else {
			  		console.log(body.data);
			  	}
	  		});
	  	}
	  });
	}
});

var server = app.listen(PORT, function() {
    console.log('Listening on port %d', server.address().port);
});