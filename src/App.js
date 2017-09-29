import React, { Component } from 'react';
import './Style.css';
var unirest = require('unirest');
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
      //console.log(res.body.result.sentiment);
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
    fetch('http://localhost:3001/search').then((res) => {
      console.log("fetched!");
      return res.text();
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error(error);
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
