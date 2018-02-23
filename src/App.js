import React, { Component } from 'react';
import './app.css';
import Ant from './Ant.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ants: null,
      fetching: false,
      testing: false,
      tested: false
    }
  }

  componentDidMount() {
    const api = 'https://antserver-blocjgjbpw.now.sh/graphql';

    const query = `{
      ants {
        name,
        weight,
        length,
        color
      }
    }`;

    this.setState({
      fetching: true
    });
    
    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({query: query})
    })
      .then(res => res.json())
      .then(json => {
        const ants = json.data.ants.map(e => {
          return {
            ...e,
            testing: false,
            win: null
          }
        });
        this.setState({
          ants: ants
        });
      });
  }

  changeAntData(ant) {
    this.setState({
      ants: this.state.ants.map(e => e.name !== ant.name ? e : ant)
    });
  }

  runTest(event) {
    const { ants } = this.state;
    const promises = [];

    this.setState({
      ants: ants.map(e => ({...e, testing: true})),
      testing: true
    });

    for(const ant of ants) {
      const promise = new Promise(resolve => {
        generateAntWinLikelihoodCalculator()(chance => {
          this.changeAntData({
            ...ant,
            testing: false,
            win: chance
          });
          resolve(true);
        });
      });

      promises.push(promise);
    }

    Promise.all(promises).then(res => {
      this.setState({
        ants: [...this.state.ants].sort((a,b) => b.win - a.win),
        testing: false,
        tested: true
      });
    });
  }

  render() {
    const { ants, fetching, testing, tested } = this.state;
    if(!ants) {
      return (
        <div className='fetch'>
          {
            fetching
              ? <h1>Fetching data</h1>
              : <h1>Failed to fetch data</h1>
          }
        </div>
      );
    }

    const testStatus = testing
      ? `Testing all ants`
      : tested
        ? `All ants have been tested`
        : `Ants haven't been tested`;

    return (
      <div className='app'>
        <button onClick={(e) => this.runTest(e)} disabled={testing}>Run test</button>
        <h3>{testStatus}</h3>
        <div className='ants-container'>
          { ants.map((e,i) => <Ant key={e.name + i} ant={e}/>) }
        </div>
      </div>
    );
  }
}

function generateAntWinLikelihoodCalculator() {
  var delay = 7000 + Math.random() * 7000;
  var likelihoodOfAntWinning = Math.random();

  return function(callback) {
    setTimeout(function() {
      callback(likelihoodOfAntWinning);
    }, delay);
  };
}

export default App;
