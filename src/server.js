var express = require('express');
var app = express();
require('dotenv').config();
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
  id: 'cc686d629de4459bb062466f86c049f9',
  secret: '0898470c4bc44c509bd963655a3526e4'
});

app.get('/:query', function(req, res) {
  spotify.search({ type: 'track', query: req.params.query }, function(err, data) {
    if (err) {
      return console.error(err);
    }
    return data.text();
  });
});

app.listen(3001);
