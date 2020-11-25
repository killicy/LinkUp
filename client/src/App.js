import React, { Component } from 'react';
//import ReactDOM from 'react-dom'
import './App.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LinkUp from './LinkUp';
import SubmitButton from './SubmitButton';
import Confirmation from './Confirmation';
import NavBar from './NavBar';
import Void from './Void';
import PasswordRecovery from './PasswordRecovery';
import PasswordRecoveryPage from './PasswordRecoveryPage';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  BrowserRouter as router,
  Switch,
  Link,
  Redirect,
  Route,
  useParams,
} from "react-router-dom";


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
      await fetch('https://localhost:5000/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
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
            <Route path="/TheVoid" component={Void} />
            <Route path="/PasswordRecovery" component={PasswordRecoveryPage} />
            <Route path="/PasswordRecovery/:user" component={PasswordRecovery} />
            <Route exact path="/Register" component={RegisterForm} />
            <Route exact path="/Confirmation/:token" component={Confirmation} />
            <Route path="/Profile/:user" component={LinkUp} />
            <Route path="" component={Void}/>

          </Switch>
        </div>
    </Router>
    );
  }
}

export default App;
