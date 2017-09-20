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
      <form onSubmit={ () => {
          props.handleSubmit()
        }}>
        <label> Enter some text:
          <input type="text" />
        </label>
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

  enterText() {
    console.log("entered text!");
  }

  render() {
    return (
      <div>
        <Box text="Header"/>
        <TextIn handleSubmit={() => {
          this.enterText();
        }}/>
      </div>
    );
  }
}

export default App;
