import React, { Component } from 'react';
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
    <div className="TextIn">
      <form onSubmit={ (event) => {
          event.preventDefault();
          props.handleSubmit(document.getElementById("textIn").value);
        }}>
        <input id="textIn" type="text" placeholder="Enter some text"/>
        <input type="submit" value="Submit" />
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
      text: ""
    }
  }

  enterText(txt) {
    this.setState({
      text: txt
    });
  }

  render() {
    return (
      <div>
        <Box text="Header"/>
        <TextIn handleSubmit={(text) => {
          this.enterText(text);
        }}/>
        <ShowText showText={this.state.text} />
      </div>
    );
  }
}

export default App;
