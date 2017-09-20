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
    <div className="textIn">
      <form onSubmit={ (e) => {
          props.handleSubmit(e.target.value)
        }}>
        <input type="text" placeholder="Enter some text"/>
        <input type="submit" value="Submit" />
      </form>
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

  enterText(theText) {
    console.log(theText);
  }

  render() {
    return (
      <div>
        <Box text="Header"/>
        <TextIn handleSubmit={(text) => {
          this.enterText(text);
        }}/>
      </div>
    );
  }
}

export default App;
