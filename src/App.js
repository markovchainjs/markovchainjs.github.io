import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      current_chain: [],
      available_to_choose_from: [],
      current_selection: null
    }
  }

  componentWillMount(){
    this.callAPI()
  }

  callAPI = async () => {
    const response = await fetch('/api/jokes');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.create_markov(body.results)
  }

  create_markov(results){
    let markov_options = []
    results.forEach((result, i) => {
      const indexes_of_next_choice = [ (i + 1) % 20, (i + 2) % 20, (i + 3) % 20 ]
      const joke = result.joke
      const data = { joke, indexes_of_next_choice, i}
      markov_options.push(data)
    })
    this.setState({
      current_chain: [markov_options[0]],
      available_to_choose_from: markov_options,
      current_selection: markov_options[0]
    })

  }

  render_next_joke(){
    const selection = Math.random()
    const indexes_of_next_choice = this.state.current_selection.indexes_of_next_choice
    if(selection <= .3) {
      var index = indexes_of_next_choice[0]
    } else if (selection <= .6) {
      var index = indexes_of_next_choice[1]
    } else if (selection <= 1) {
      var index = indexes_of_next_choice[2]
    }
    const next_choice = this.state.available_to_choose_from[index]
    let new_current_chain = this.state.current_chain.slice()
    new_current_chain.push(next_choice)
    this.setState({ current_selection: next_choice, current_chain: new_current_chain})
  }

  render_current_chain(){
    return this.state.current_chain.map(((past_joke, i) => (
      <div key={i} style={{fontSize: '10px'}}>
        {past_joke.joke}(#{past_joke.i})
        =>
      </div>
    )))
  }


  render() {
   const  {current_selection} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h3>Dad Joke Markov Chain</h3>
          <div>Current Joke:</div>
          {current_selection && current_selection.joke}
          <br></br>
          <br></br>
          <button onClick={() => this.render_next_joke()}>
            Next Joke
          </button>
          <br>
          </br>
          <div>Current Chain (The number to the right signifies the order of the joke, within all jokes): </div>
          {this.render_current_chain()}
        </header>
      </div>
    );
  }
}

export default App;
