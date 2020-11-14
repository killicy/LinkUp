import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import SubmitButton from './SubmitButton';
import EventMaker from './EventMaker'; 
import MainContent from './MainContent';  
import Friends from './Friends';
import { Card } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect,
  Route,
} from "react-router-dom";


class LinkUp extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          isLoggedin: false,
          event: [{title: 'Help'}],
          id: 'a'
      }
  }
  async doLogout(){
    try {
       await fetch('https://localhost:5000/api/user/logOut', {
         method: 'GET',
         credentials: 'include',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin':'https://localhost:5000',
         }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         this.props.history.push('/');
     }
     catch(e) {
         console.log(e)
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
           this.props.history.push('/');
         }
    }
    catch(e) {
    }


  }

  render() {
    return (
    <Router>
      <div className="MainPage">
        <EventMaker />
        <Switch>
        <Route exact path="/LinkUp" render={() => <MainContent data = {this.state}/>}/>
        </Switch> 
        <div className='container'>
          <SubmitButton
              text={'Log Out'}
              disabled={false}
              onClick={ () => this.doLogout() }
          />
        </div>
        <Friends/>
      </div>
    </Router>
    );
  }
}

export default LinkUp;
