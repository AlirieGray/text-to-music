import React, { Component } from 'react';
import 'whatwg-fetch';
import './Style.css';

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
    this.getSentiment(txt);
  }

  getSentiment(text) {
    var url = "https://community-sentiment.p.mashape.com/text/";
    fetch(url, {
      method: 'post',
      headers: {
        "X-Mashape-Key": "XmKB0iIDuwmshZEUmujdaIZklsogp134KaujsnvtdYu8vjdmZl",
        "X-Mashape-Host": "community-sentiment.p.mashape.com",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        txt: text,
      })
    }).then(function(res) {
      console.log(res);
      return res.json();
    }).then(function(json) {
      console.log(json);
    });
      //console.log(result.status, result.headers, result.body);
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
