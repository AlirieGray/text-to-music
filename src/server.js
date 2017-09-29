var express = require('express');
var app = express();
var Spotify = require('node-spotify-api');
var bodyParser = require('body-parser');
var spotify = new Spotify({
  id: 'cc686d629de4459bb062466f86c049f9',
  secret: '0898470c4bc44c509bd963655a3526e4'
});
var toneUsername = "f0cb679b-48fd-4be6-a5ba-e97784f7505d";
var tonePassword = "EJKPkQjbPwQT";
var toneURL = "https://gateway.watsonplatform.net/tone-analyzer/api";
var ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');
var tone_analyzer = new ToneAnalyzer({
  username: toneUsername,
  password: tonePassword,
  version_date: '2016-05-19'
});
require('dotenv').config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

// returns a url
app.post('/search', function(req, res) {
  console.log("posting!");
  console.log(req.body);
  spotify.search({ type: 'track', query: req.body.query, limit: 1 }, function(err, result) {
    if (err) {
      return console.log(err);
    }
    var link = result.tracks.items[0].external_urls.spotify;
    //var id = result.tracks.items[0].id;
    res.send(link);
  })
});

app.post('/analyze', function(req, res) {
  console.log("analyzing!");
  console.log(req.body);
  var params = {
    text: req.body.text,
    tones: 'emotion'
  };
  tone_analyzer.tone(params, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      var analysis = JSON.stringify(response, null, 2);
      console.log(analysis);
      res.send(analysis);
    }
  })

})

app.listen(3001);
