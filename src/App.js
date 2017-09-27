import React, { Component } from 'react';
import './Style.css';
var unirest = require('unirest');
var rapid = new RapidAPI("default-application_59c2c79ae4b0b0cacf7c9eac", "f8369d4e-3470-4e32-9715-6e0e6a85ac3d");
var scopes = 'user-read-private user-read-email'
var toneUsername = "f0cb679b-48fd-4be6-a5ba-e97784f7505d";
var tonePassword = "EJKPkQjbPwQT";
var toneURL = "https://gateway.watsonplatform.net/tone-analyzer/api";
var ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3');
var tone_analyzer = new ToneAnalyzer({
  username: toneUsername,
  password: tonePassword,
  version_date: '2016-05-19'
});
/*
response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
*/
"use strict";function RapidAPI(e,t){this.project=e,this.key=t,this.getBaseURL=function(){return"https://rapidapi.io/connect"},this.blockURLBuilder=function(e,t){return this.getBaseURL()+"/"+e+"/"+t},this.callbackBaseURL=function(){return"https://webhooks.rapidapi.com"},this.call=function(e,t,o){var n,s={},r=new XMLHttpRequest,a=this.blockURLBuilder(e,t);r.open("POST",a,!0),r.setRequestHeader("Authorization","Basic "+btoa(this.project+":"+this.key)),Object.keys(o).reduce(function(e,t){return e||o[t]instanceof File},!1)?(n=new FormData,Object.keys(o).forEach(function(e){n.append(e,o[e])})):(n=JSON.stringify(o)||{},r.setRequestHeader("Content-Type","application/json"),r.setRequestHeader("Accept","application/json")),r.onload=function(){var e;try{e=JSON.parse(this.response)}catch(t){e=this.response}200===this.status&&e.hasOwnProperty("outcome")?s.hasOwnProperty(e.outcome)&&s[e.outcome](e.payload):s.hasOwnProperty("error")&&s.error(e)},r.send(n);var i={on:function(e,t){if("function"!=typeof t||"string"!=typeof e)throw"Invalid event key and callback. Event key should be a string and callback should be a function.";return s[e]=t,i}};return i},this.listen=function(e,t,o){var n={},s=function(e){return n[e]||function(){}},r=e+"."+t+"_"+this.project+":"+this.key,a=new XMLHttpRequest,i=this.callbackBaseURL()+"/api/get_token?user_id="+r;a.open("GET",i,!0),a.setRequestHeader("Content-Type","application/json"),a.setRequestHeader("Authentication","Basic "+btoa(this.project+":"+this.key)),a.onload=function(){var e;if(200===this.status)try{"object"!=typeof this.response&&(e=JSON.parse(this.response))}catch(e){return}var t=e.token,n="wss://webhooks.rapidapi.com/socket/websocket?token="+t,r=new WebSocket(n);r.onopen=function(e){var n={topic:"users_socket:"+t,event:"phx_join",ref:"1",payload:o};r.send(JSON.stringify(n))},r.onerror=s("error"),r.onclose=s("close"),r.onmessage=function(e){try{var t=JSON.parse(e.data);if("phx_reply"===t.event&&"ok"===t.payload.status)return void s("join")();t.payload.body&&t.payload.body.msg&&"error"===t.payload.body.msg.status?s("error")(t.payload.body.msg):s("message")(t.payload.body.text)}catch(e){s("error")()}},setInterval(function(){var e={topic:"phoenix",event:"heartbeat",ref:"1",payload:{}};r.send(JSON.stringify(e))},3e4)},a.send();var c={on:function(e,t){if("function"!=typeof t)throw"Callback must be a function.";if("string"!=typeof e)throw"Event must be a string.";return n[e]=t,c}};return c}}

const Box = (props) => {
  return(
    <div className="HeaderBox">
      <p> {props.text} </p>
    </div>
  );
}

const TextIn = (props) => {
  return(
    <div>
      <form onSubmit={ (event) => {
          event.preventDefault();
          props.handleSubmit(document.getElementById("textIn").value);
        }}>
        <p>
          <input className="TextInput" id="textIn" type="text" placeholder="Enter some text..."/>
        </p>
        <input className="btn" type="submit" value="Submit" />
      </form>
    </div>
  );
}

const ShowText = (props) => {
  return(
    <div className="ShowText">
      <p>{props.showText}</p>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      mood: ""
    }
  }

  enterText(txt) {
    this.setState({
      text: txt
    });
    this.getSentiment(txt);
    /*
    this.getToken().then((token) => {
      //this.analyzeTone(txt, token);
    });
    */
  }

  getSentiment(text) {
    return new Promise((resolve, reject) => {
      unirest.post("https://community-sentiment.p.mashape.com/text/")
      .header("X-Mashape-Key", "XmKB0iIDuwmshZEUmujdaIZklsogp134KaujsnvtdYu8vjdmZl")
      .header("X-Mashape-Host", "community-sentiment.p.mashape.com")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .send("txt=" + text)
      .send("")
      .end(function (result) {
        if(result) {
          resolve(result);
        }
      })
    }).then((res) => {
      console.log(res.body.result.sentiment);
      this.searchForSong(res.body.result.sentiment)
      this.setState({
        mood: res.body.result.sentiment
      });
    });
  }

  getToken() {
    return fetch('/api/token/tone_analyzer').then((res) => {
      console.log("does this log");
      var text = res.text();
      console.log(text);
      return text;
    });
  }

  analyzeTone(txt, token) {
    var tone_analyzer = new ToneAnalyzer({
      token: token,
      version_date: '2016-05-19'
    });
    var params = {
      text: txt,
      tones: 'emotion'
    };
    return new Promise((resolve, reject) => {
      tone_analyzer.tone(params, function(error, response) {
        if (error) {
          console.log('error: ', error);
        } else {
          return (JSON.stringify(response, null, 2));
        }
      })
    }).then((res) => {
        console.log(res);
    });
  }

  searchForSong(searchTerm) {
    fetch('/' + searchTerm).then(res => console.log(res));
  }

  /*
  searchForSong(searchTerm) {
    return new Promise((resolve, reject) => {
      rapid.call('SpotifyPublicAPI', 'searchTracks', {
        'accessToken': 'BQAQCP2Edv163O6R-7Efe4ezNcQ3YYaKc5yjj4uRiIkkLbFH_yiO9NKwCP5B7A65bODtlkYZom14yxJJBGRVC0Vg0sF8nR8yhpefmnd-HripnBA8Psqn4Yrfig31gUKFhAccegNSCj6b',
        'query': searchTerm,
        'limit': 1
      }).on('success', function (payload) {
         resolve(payload.tracks.items[0].id);
      }).on('error', function (payload) {
         console.error("Error occurred in search for song function");
         console.log(payload);
         reject(payload);
      });
    }).then((res) => {
      this.getSong(res);
    });
  }
  */

  getSong(id) {
    console.log(id);
    return new Promise((resolve, reject) => {
      rapid.call('SpotifyPublicAPI', 'getTrack', {
	       'accessToken': 'BQAQCP2Edv163O6R-7Efe4ezNcQ3YYaKc5yjj4uRiIkkLbFH_yiO9NKwCP5B7A65bODtlkYZom14yxJJBGRVC0Vg0sF8nR8yhpefmnd-HripnBA8Psqn4Yrfig31gUKFhAccegNSCj6b',
	        'id': id
        }).on('success', function (payload) {
           resolve(payload);
         }).on('error', function (payload) {
	          console.log("error in function getSong");
            reject(payload);
          });
        }).then((res) => {
          console.log("look up song url now");
          window.location = res.preview_url;
        });
      }

  render() {
    return (
      <div className="Container">
        <Box text="Text to Music"/>
        <TextIn className="TextInput" handleSubmit={(text) => {
          this.enterText(text);
        }}/>
        <ShowText showText={this.state.mood} />
      </div>
    );
  }
}

export default App;
