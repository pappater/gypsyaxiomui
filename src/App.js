import React, { Component } from 'react';
import './App.css';
import config from './config';

export default class App extends Component {
  state = {
    quotes: [],
    currentIndex: 0,
    loading: true
  }

  componentDidMount() {
    this.fetchQuotes();
  }

  // Fisher-Yates shuffle algorithm to randomize array
  shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  fetchQuotes = () => {
    fetch(config.quotesUrl)
      .then((response) => response.json())
      .then((data) => {
        const quotes = data[0] || [];
        const shuffledQuotes = this.shuffleArray(quotes);
        this.setState({ quotes: shuffledQuotes, loading: false });
      })
      .catch((error) => {
        console.log('Request failed', error);
        this.setState({ loading: false });
      });
  }

  handleNext = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex + 1) % prevState.quotes.length
    }));
  }

  handlePrevious = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex === 0 
        ? prevState.quotes.length - 1 
        : prevState.currentIndex - 1
    }));
  }

  render() {
    const { quotes, currentIndex, loading } = this.state;
    const currentQuote = quotes[currentIndex];

    if (loading) {
      return (
        <div className='container'>
          <div className='quote-section'>
            <p className='loading'>Loading...</p>
          </div>
        </div>
      );
    }

    if (!currentQuote) {
      return (
        <div className='container'>
          <div className='quote-section'>
            <p className='loading'>No quotes available</p>
          </div>
        </div>
      );
    }

    return (
      <div className='container'>
        <div className='quote-section'>
          <blockquote className='quote'>{currentQuote.quote}</blockquote>
          <p className='author'>— {currentQuote.author}</p>
        </div>
        <div className='navigation'>
          <button 
            className='nav-button' 
            onClick={this.handlePrevious}
            aria-label='Previous quote'
          >
            ←
          </button>
          <button 
            className='nav-button' 
            onClick={this.handleNext}
            aria-label='Next quote'
          >
            →
          </button>
        </div>
      </div>
    );
  }
}
