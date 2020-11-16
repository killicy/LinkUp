import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import './App.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LinkUp from './LinkUp';
import SubmitButton from './SubmitButton';
import Confirmation from './Confirmation';
import logo from './stores/user.svg';

import {
  BrowserRouter as Router,
  BrowserRouter as router,
  Switch,
  Link,
  Redirect,
  Route,
  useParams,
} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory"


export const history = createBrowserHistory({
  forceRefresh: true
})

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          success: false,
          username: ''
      }
  }

  async profile(){
    try {
      await fetch('https://localhost:5000/api/user/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg, username: data.username}));
         if (this.state.success) {
           history.replace('/');
           history.push('/' + this.state.username);
         }
         else {
           history.replace('/');
         }
    }
    catch(e) {
      history.replace('/');
    }
  }

  render() {
    return(
      <Router>
        <div className= "app">
          <div className="NavBar">
            <figure onClick={e => this.profile()}>
              <img src={logo} alt="image"/>
            </figure>
          </div>
          <Switch>
            <Route exact path="/" component={LoginForm} />
            <Route exact path="/Register" component={RegisterForm} />
            <Route exact path="/Confirmation/:token" component={Confirmation} />
            <Route exact path="/:user" component={LinkUp} />
          </Switch>
        </div>
    </Router>
    );
  }
}

export default App;
