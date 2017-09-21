import React, { Component } from 'react';
import 'whatwg-fetch';
import './Style.css';
var unirest = require('unirest');

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
        <input className="SubmitButton" type="submit" value="Submit" />
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
    this.getSentiment(txt).bind(this);
    fetch("https://community-sentiment.p.mashape.com/text/")
      .then()
  }

  getSentiment(text) {
    unirest.post("https://community-sentiment.p.mashape.com/text/")
    .header("X-Mashape-Key", "XmKB0iIDuwmshZEUmujdaIZklsogp134KaujsnvtdYu8vjdmZl")
    .header("X-Mashape-Host", "community-sentiment.p.mashape.com")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .send("txt=" + text)
    .send("")
    .end(function (result) {
      /*
      this.setState({
        mood:result.body
      });
      */
      console.log(result.status, result.headers, result.body);
    });
  }

  render() {
    return (
      <div className="Container">
        <Box text="Text to Music"/>
        <TextIn className="TextInput" handleSubmit={(text) => {
          this.enterText(text);
        }}/>
        <ShowText showText={this.state.text} />
        <ShowText showText={this.state.mood} />
      </div>
    );
  }
}

export default App;
