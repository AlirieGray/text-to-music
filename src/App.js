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

  // when the user enters text, call a function to analyze the tone
  // and search for a song based on the results 
  enterText(txt) {
    this.setState({
      text: txt
    });
    this.analyzeTone(txt);
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
      var categories = data.document_tone.tone_categories[0].tones;
      console.log("anger: " + categories[toneIndexes.anger].score);
      console.log("joy: " + categories[toneIndexes.joy].score);
      console.log("fear: " + categories[toneIndexes.fear].score);
      console.log("disgust: " + categories[toneIndexes.disgust].score);
      console.log("sadness: " + categories[toneIndexes.sadness].score);

      // find the most prominent emotion in the source text
      // returns an object with the score, tone_id and tone_name
      var maxEmotion = categories.reduce(function (left, right) {
        return (left.score > right.score) ? left : right;
      }, 0);

      console.log(maxEmotion.tone_name + " " + maxEmotion.score);

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
