import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";




class MainPage extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          username: '',
          password: '',
          email: '',
          message: '',
          buttonDisabled: false,
          success: false,
          redirect: null
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
         UserStore.login = false;
         UserStore.username = '';
       }

       catch(e) {
           console.log(e)
       }
   }

  render() {
    if (this.state.redirect) {
      return(
        <Router>
          <Redirect to={this.state.redirect} />
        </Router>
      );
    }
    return (
      <div className="MainPage">
        <div className='container'>
          Welcome {UserStore.username}
          <SubmitButton
              text={'Log Out'}
              disabled={false}
              onClick={ () => this.doLogout() }
          />
        </div>
      </div>
    );
  }
}

export default MainPage;
