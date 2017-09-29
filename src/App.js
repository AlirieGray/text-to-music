import React, { Component } from 'react';
import './Style.css';
var unirest = require('unirest');

// stores the index of each emotion as it appears
// in the object returned by the tone analyzer function
var toneIndexes = {
  anger: 0,
  disgust: 1,
  fear: 2,
  joy: 3,
  sadness: 4
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
    //this.getSentiment(txt);
    this.analyzeTone(txt);
    /*
    this.getToken().then((token) => {
      //this.analyzeTone(txt, token);
    });
    */
  }

  /* takes in a body of text, analyses its tone, and sets the state
   * of the app component to either positive, neutral, or negative
   * based on the text (using the sentiment api)*/
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

  // gets an authentication token for the watson tone analyzer api
  getToken() {
    return fetch('/api/token/tone_analyzer').then((res) => {
      console.log("does this log");
      var text = res.text();
      console.log(text);
      return text;
    });
  }

  /* takes in a body of text and returns a JSON object with
   * information about its tone (using the watson tone analyzer api) */
  analyzeTone(txt, token) {
    fetch('http://localhost:3001/analyze', {
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/plain',
         'Content-Type': 'application/json',
       },
      body: JSON.stringify({
        text: txt
      })
    }).then((res) => {
      console.log("fetched!");
      return res.json();
    }).then((data) => {
      //console.log(data);
      var tones_array = data.document_tone.tone_categories[0].tones;
      console.log("anger: " + tones_array[toneIndexes.anger].score)
      console.log("joy: " + tones_array[toneIndexes.joy].score)
      console.log("fear: " + tones_array[toneIndexes.fear].score)
      console.log("disgust: " + tones_array[toneIndexes.disgust].score)
      console.log("sadness: " + tones_array[toneIndexes.sadness].score)
    }).catch((error) => {
      console.error(error);
    });
  }

  /* searches for a song in Spotify based on a search term
   * and redirects the user to that song's url
   * TODO: add song player component to main page */
  searchForSong(searchTerm) {
    fetch('http://localhost:3001/search', {
      method: 'POST',
      headers: {
         'Accept': 'application/json, text/plain',
         'Content-Type': 'application/json',
       },
      body: JSON.stringify({
        query: searchTerm
      })
    }).then((res) => {
      console.log("fetched!");
      return res.text();
    }).then((data) => {
      console.log(data);
      // redirect to song url
      window.location = data;
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

const Box = (props) => {
  return(
    <div className="HeaderBox">
      <p> {props.text} </p>
    </div>
  );
}

const TextIn = (props) => {
  const styles = {
    flexContainer: {
      display: 'flex',
      justifyContent: 'center',

    }
  }

  return(
      <form style={styles.flexContainer} onSubmit={ (event) => {
          event.preventDefault();
          props.handleSubmit(document.getElementById("textIn").value);
        }}>
        <input className="TextInput" id="textIn" type="text" placeholder="Enter some text..."/>
        <input className="btn" type="submit" value="Submit" />
      </form>
  );
}

const ShowText = (props) => {
  return(
    <div className="ShowText">
      <p>{props.showText}</p>
    </div>
  );
}


export default App;
