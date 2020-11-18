import React from 'react';
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
import NavBar from './NavBar';
import { CloudinaryContext, Image } from "cloudinary-react";
import { fetchPhotos, openUploadWidget } from "./CloudinaryService";
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
          url: this.props.match.params.user,
          events: null,
          friends: null,
          friendEvents: null
      }
  }

  beginUpload(tag) {
    const uploadOptions = {
      cloudName: "dsnnlkpj9",
      tags: [tag, 'anImage'],
      uploadPreset: "cqswrbcf"
    };
    openUploadWidget(uploadOptions, (error, photos) => {
      if (!error) {
        console.log(photos);
        if(photos.event === 'success'){
        }
      } else {
        console.log(error);
      }
    })
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

    try {
      await fetch('https://localhost:5000/api/user/userInfo', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({events: data.Events, friends: data.friends, friendEvents: data.FriendEvents}));
    }
    catch(e) {
    }


  }
  render() {

    return (
    <Router>
      <NavBar history={this.props.history}/>
      <div className="MainPage">
        <button onClick={(e) => this.beginUpload()}>Upload Image</button>
        <EventMaker />
        <Switch>
          <Route exact path={"/"+this.state.url} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path={"/"+this.state.url+"/:token"} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path="" render={() => <Confirmation data = {this.state}/>}/>


        </Switch>
        <div className='Container'>
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
