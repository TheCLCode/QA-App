import React, { Component } from 'react';
import NavBar from './NavBar/NavBar';
import Questions from './Questions/Questions';
import Question from './Question/Question';
import {Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (<div>
      <NavBar/>
      <Route exact path='/' component={Questions}/>
      <Route exact path='/question/:questionId' component={Question}/>
    </div>
    );
  }
}

export default App;
