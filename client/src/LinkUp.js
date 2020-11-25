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
import Profile from './Profile';
import { fetchPhotos, openUploadWidget } from "./CloudinaryService";
import { CloudinaryContext, Image, Transformation } from "cloudinary-react";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";



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
          id: 'a',
          url: this.props.match.params.user,
          events: [],
          friends: [],
          friendEvents: [],
          show: false,
          startDate: new Date(),
          description: '',
          title: '',
          success: false,
          addFriend: false,
          friend: false,
          Profile_pic: 'pzeegrq7gjtnhhn54clg'
      }
  }

  setInputValue(property, val) {
      val = val.trim();

      // Username and Password is 12 characters max
      if (val.length > 50) {
          return;
      }
      this.setState({
          [property]: val
      })
  }

  async addEvent(){
    try {
      await fetch('https://localhost:5000/api/event/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          Title: this.state.title,
          Description: this.state.description,
          Date_Start: this.state.startDate,
          Date_End: this.state.startDate
        })}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg}));
        if(this.state.success){
          this.setShow();
          this.state.success = false;
        }
        else{
          this.setState({message: this.state.message});
        }
     }
     catch(e) {
        this.setState({message: this.state.message});
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
           this.state.success = false;
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
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         if (this.state.isLoggedin) {
         }
         else {
           this.props.history.push('/');
         }
    }
    catch(e) {
    }
    try {
      await fetch('https://localhost:5000/api/user/usernameInfo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          Username: this.state.url
        })}).then(response => response.json()).then(data => this.setState({events: data.UserEvents, friends: data.Friends, friendEvents: data.FriendEvents, success: data.success, addFriend: data.addFriend, friend: data.friend, Profile_pic: data.Profile_pic}));
        if(this.state.success === true){
          this.state.success = false;
          console.log(this.state.Profile_pic);
        }
        else{
        }
    }
    catch(e) {
    }
  }

  setShow(){
    if(this.state.show === false){
      this.setState({
        show: true
      });
    }
    else{
      console.log("help");
      this.setState({
        show: false,
        message: ''
      });
    }
  }

  async addFriend(){
    try {
      await fetch('https://localhost:5000/api/user/addFriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          Username: this.state.url
        })}).then(response => response.json()).then(data => this.setState({success: data.success}));
        if(this.state.success === true){
          this.state.success = false;
        }
        else{
        }
    }
    catch(e) {
    }
  }
  render() {

    return (
    <Router>
      <NavBar history={this.props.history}/>
      <div className="MainPage">
        <EventMaker data={this.state} />
        <div className="middleContainer">
          {this.state.addFriend ? <button type="button" className="btnEvent btn-secondary" onClick={ () => this.addFriend() }>Add Friend</button> : this.state.friend ? null :  <button type="button" className="btnEvent btn-secondary" onClick={ () => this.setShow() }>Add Event</button>}
          <Switch>
            <Route exact path={"/Profile/"+this.state.url} render={() => <MainContent data = {this.state}/>}/>
            <Route exact path={"/Profile/"+this.state.url+"/:token"} render={() => <MainContent data = {this.state}/>}/>
          </Switch>
        </div>
        <div className="leftContainer">
          <Profile data={this.state}/>
          <Friends data={this.state}/>
        </div>
      </div>
      <div>
        <Modal show={this.state.show} onHide={ () => this.setShow() }>
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>
                {this.state.message}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="addEvent">
                <form>
                   <h3>Add Event</h3>
                   <div className="form-group">
                       <label>Title:</label>
                       <input type="text" className="form-control" placeholder="What's your title?" onChange = {e => this.setInputValue("title", e.target.value)}/>
                   </div>
                   <div className="form-group">
                       <label>Description:</label>
                       <textarea className="form-control" placeholder="Give us a quick description" onChange = {e => this.setInputValue("description", e.target.value)}/>
                   </div>
                   <div className="form-group">
                       From: <DatePicker selected={this.state.startDate} onChange={date => this.setState({startDate: new Date(date)})} showTimeSelect dateFormat="Pp" />
                       To: <DatePicker selected={this.state.startDate} onChange={date => this.setState({startDate: new Date(date)})} showTimeSelect dateFormat="Pp" />
                   </div>
                   <button type="button" className="eventBtn btn-primary btn-block" onClick = {() => this.addEvent()}>Post Your Event</button>
               </form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={ () => this.setShow() } >Close</Button>
              <Button variant="primary">Add Event</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
      </div>
    </Router>
    );
  }
}

export default LinkUp;
