import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import './App.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LinkUp from './LinkUp';
import Confirmation from './Confirmation';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
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
          username: '',
          isLoggedin: false
      }
  }

  async componentDidMount() {
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success, message: data.msg}));
    }
    catch(e) {
    }
  }

  render() {
    return(
      <Router>
        <div className= "app">
          <Switch>
            <Route exact path="/" component={LoginForm}/>
            <Route exact path="/Register" component={RegisterForm} />
            <Route exact path="/Confirmation/:token" component={Confirmation} />
            <Route path="/Profile/:user" component={LinkUp} />
          </Switch>
        </div>
    </Router>
    );
  }
}

export default App;
