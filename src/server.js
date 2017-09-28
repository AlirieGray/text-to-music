var express = require('express');
var app = express();
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: 'cc686d629de4459bb062466f86c049f9',
  secret: '0898470c4bc44c509bd963655a3526e4'
});
require('dotenv').config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/search', function(req, res) {
  spotify.search({ type: 'track', query: "ok", limit: 1 }, function(err, result) {
    if (err) {
      return console.log(error);
    }
    var id = result.tracks.items[0].id;
    res.send(id);
  })
});

app.listen(3001);
