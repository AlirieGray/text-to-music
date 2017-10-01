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

// stores a collection of songs for each emotion recognized by the tone analyzer
var happySongs = ["All Star", "I'm a Believer", "Sugar, Sugar", "Twist and Shout", "Margaritaville"];
var sadSongs = ["I'm so lonesome I could cry", "Cry", "Jocelyn Flores", "Time Lapse", "Pain in my heart"];
var fearfulSongs = ["Undercover of the night", "Morning dew", "White room", "Scary monsters", "The Fixer", "The Gates of Eden"];
var angrySongs = ["Breaking the Law", "Get at me dog", "Violet", "Straight Outta Compton", "Head like a Hole", "Bombtrack"];
var disgustedSongs = ["Revolution 9"];

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
      var maxEmotionName = maxEmotion.tone_name;
      switch(maxEmotionName) {
        case "Joy":
          var i = Math.floor(Math.random() * happySongs.length);
          this.searchForSong(happySongs[i]);
          break;
        case "Sadness":
          var i = Math.floor(Math.random() * sadSongs.length);
          this.searchForSong(sadSongs[i]);
          break;
        case "Fear":
          var i = Math.floor(Math.random() * fearfulSongs.length);
          this.searchForSong(fearfulSongs[i]);
          break;
        case "Disgust":
          var i = Math.floor(Math.random() * disgustedSongs.length);
          this.searchForSong(disgustedSongs[i]);
          break;
        case "Anger":
          var i = Math.floor(Math.random() * angrySongs.length);
          this.searchForSong(angrySongs[i]);
          break;
        default:
          console.log("default!");
          this.searchForSong("All Star");
      }

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
        <textarea className="TextInput" id="textIn" type="text" placeholder="Enter some text and get a song based on its mood!"/>
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
