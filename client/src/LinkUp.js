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
import Confirmation from './Confirmation';
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
          event: [{title: 'Movie Night', description: 'Friday the 13th part 13: The Final Friday'}, {title: 'BBQ', description: 'Ribs, Burgers, Obesity'}],
          id: 'a',
          url: this.props.match.params.user
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

  async resendConfirmation(){
    try {
      await fetch('https://localhost:5000/api/user/confirmationEmail', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg, username: data.username}));
         if (this.state.success) {

         }
         else {
         }
    }
    catch(e) {
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
          <Route exact path={"/"+this.state.url} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path={"/"+this.state.url+"/:token"} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path="" render={() => <Confirmation data = {this.state}/>}/>


        </Switch>
        <div className='Container'>
          <SubmitButton
              text={'Log Out'}
              disabled={false}
              onClick={ () => this.doLogout() }
          />
          <SubmitButton
              text={'Resend Confirmation'}
              disabled={false}
              onClick={ () => this.resendConfirmation() }
          />
        </div>
        <Friends/>
      </div>
    </Router>
    );
  }
}

export default LinkUp;
