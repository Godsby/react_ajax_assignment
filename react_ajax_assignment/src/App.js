import React, { Component } from 'react';

import './App.css';
import Menu from './components/menu';
// import Hand from './components/hand';

class App extends Component {
  constructor () {
    super();
    this.state = {
      isLoadding: true,
      cardsDrawn: {},
      totalValue: 0
    }
    this.handleRandomTwo = this.handleRandomTwo.bind(this);
    this.pickOne = this.pickOne.bind(this);
  }

  componentDidMount() {
    this.handleRandomTwo();
  }

  handleRandomTwo = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=2')
      .then(response => response.json())
      .then(data => {
        let temp = 0;
        let totalInitial = data.cards.map(card => {
          let cardValue = isNaN(card.value) ? 1 : parseInt(card.value); 
            return temp += cardValue;
        });
        this.setState({
          isLoadding: false,
          cardsDrawn: data,
          totalValue: totalInitial
        })
      })
  }

  pickOne = id => {
    let newCardsDrawn = {...this.state.cardsDrawn};
    let newCardsArr = newCardsDrawn.cards;
    let newTotal = this.state.totalValue;
    fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
      .then(response => response.json())
      .then(data => {
        // debugger
        newCardsArr.push(data.cards[0]);
        newCardsDrawn.cards = newCardsArr;
        newCardsDrawn.remaining = data.remaining;
        newTotal = isNaN(data.cards.value) ? 1 : parseInt(data.cards.value);
        this.setState({
          cardsDrawn: newCardsDrawn,
          totalValue: newTotal
        })
      })
  }

  render() {
    const {isLoadding, cardsDrawn, totalValue}= this.state;
    // let totalValue = cardsDrawn.cards.map(card => totalValue += card.value);
    let results;
    if (totalValue > 21) {
      results = <p>You total exceeds 21, You lose the game!</p>;
    } else if (totalValue === 21) {
      results = <p>No Doubt, perfect Win!</p>
    } else {
      results = <p>You Got Total of {totalValue}, Still Have {21 - parseInt(totalValue)} Left, Hit More!</p>;
    }

    if (!isLoadding) {
      return (
        <div className="App">
          <h2>Welcome to BlackJack Game!</h2>
          <hr /><br />

          <button 
            disabled={cardsDrawn.remaining > 1}
            onClick={this.handleRandomTwo}
            > Start with A New Deck
          </button>
          
          {cardsDrawn.remaining > 1 ? 
          <div>
            <p>Remaining: {cardsDrawn.remaining}</p>
            <p>Deck_ID: {cardsDrawn.deck_id}</p>
            <button onClick={() => this.pickOne(cardsDrawn.deck_id)}>Hit Me TO 21!</button>
            <div className='results'>
              {results}
            </div>
          </div>
          : null }

          <ul>
              <Menu 
                cardsArr={cardsDrawn.cards}
              />
          </ul>

        </div>
      );
    } else {
      return (
        <div className="App">
          <h2>Welcome to BlackJack Game!</h2>
          <hr />
          <h4>Loadding...</h4>
        </div>
      )
    }
  }
}

export default App;