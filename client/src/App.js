import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LinkUp from './LinkUp';
import SubmitButton from './SubmitButton';
import Cookies from 'universal-cookie';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect,
  Route,
} from "react-router-dom";

const cookies = new Cookies();

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          isLoggedin: false
      }
  }
  async componentDidMount() {
    try {
      await fetch('https://localhost:5000/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success, message: data.msg}));
         if (this.state.isLoggedin) {
         }
         else {
         }
    }
    catch(e) {
    }
  }

  async doLogout() {
       try {
         await fetch('https://localhost:5000/api/user/logOut', {
           method: 'GET',
           credentials: 'include',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin':'https://localhost:5000',
           }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
       }

       catch(e) {
           console.log(e)
       }
   }

  render() {
    return(
      <Router>
        <div>NavBar</div>
        <Switch>
          <Route exact path="/" component={LoginForm} />
          <Route path="/:user" component={LinkUp} />
          <Route exact path="/Register" component={RegisterForm} />
        </Switch>
    </Router>
    );
  }
}

export default App;
