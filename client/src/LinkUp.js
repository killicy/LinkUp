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
          friendEvents1: [],
          show: false,
          startDate: new Date(),
          startDate1: new Date(),
          description: '',
          title: '',
          success: false,
          addFriend: false,
          friend: false,
          Profile_pic: '',
          user: {Username: 'placeholder'},
          showy: [],
          event_id: null,
          participants: [],
          showy1: [],
          participants1: []
      }
  }

  setInputValue(property, val) {

      this.setState({
          [property]: val
      })
  }

  async addEvent(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/event/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Title: this.state.title,
          Description: this.state.description,
          Date_Start: this.state.startDate,
          Date_End: this.state.startDate1,
          Event_Image: this.state.event_id
        })}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg}));
        if(this.state.success){
          this.setShow();
          this.state.success = false;
          window.location.reload();
        }
        else{
          this.setState({message: this.state.message});
        }
     }
     catch(e) {
        this.setState({message: this.state.message});
     }
  }

  async participate(event, index, string){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/event/participants', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Title: event.Title
        })}).then(response => response.json()).then(data => {
          if(data.success === true){
            this.state[string][index] = data.participants;
          }
        });
        this.setState({
          success: false
        });
     }
     catch(e) {
     }
  }

  sort_by(field, reverse, primer){

  const key = primer ?
    function(x) {
      return primer(x[field])
    } :
    function(x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}



  async resendConfirmation(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/confirmationEmail', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({success: data.success, username: data.username}));
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
      await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
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
      await fetch(process.env.REACT_APP_API_URL + '/api/user/usernameInfo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Username: this.state.url
        })}).then(response => response.json()).then(data => {
          if(data.success === false)
          {
            this.props.history.push('/TheVoid');
          }
          this.setState({events: data.UserEvents, friends: data.Friends, friendEvents: data.FriendEvents, success: data.success, addFriend: data.addFriend, friend: data.friend, Profile_pic: data.Profile_pic, user: data.user});
        });
        if(this.state.success === true){
          this.state.friendEvents.map((events, index) => {
              var User = this.state.friends[index].Username;
              events[User].map((event, index) =>{
                console.log(event);
                this.state.friendEvents1.push(event);
              });
          });

          var seenNames = {};
          this.state.friendEvents1 = this.state.friendEvents1.filter(function(currentObject) {
              if (currentObject.Title in seenNames) {
                  return false;
              } else {
                  seenNames[currentObject.Title] = true;
                  return true;
              }
          });
          console.log(this.state.friendEvents1[1]);
          this.state.friendEvents1 = this.state.friendEvents1.sort((a,b) => {
              return new Date(b.Date_Added) - new Date(a.Date_Added);})

          this.state.friendEvents1.map((event, index) => {
              this.enrolled(event, index, "showy");
              this.participate(event, index, "participants");
          });
          this.state.events.map((event, index) => {
              this.enrolled(event, index, "showy1");
              this.participate(event, index, "participants1");
          });
          this.setState({
            success: true,
            friend: this.state.friend
          })
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
      this.setState({
        show: false,
        message: ''
      });
    }
  }

  async addFriend(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/addFriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Username: this.state.url
        })}).then(response => response.json()).then(data => this.setState({success: data.success}));
        if(this.state.success === true){
          this.setState({
            success: false
          });
        }
        else{
        }
    }
    catch(e) {
    }
  }
  setDater(date){
    this.setState({startDate: new Date(date), startDate1: new Date(date)});
  }

  async enrolled(event, index, string){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/event/attendingEvent', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Title: event.Title,
        })}).then(response => response.json()).then(data => {
          if(data.success === true){
            this.state[string][index] = true;
          }
          else{
            this.state[string][index] = false;
          }
      });
        this.setState({
          success: false
        });
    }
    catch(e) {
    }
  }

  beginUpload(tag) {
  // <button onClick={(e) => this.beginUpload()}>Upload Image</button>
  const uploadOptions = {
    cloudName: "dsnnlkpj9",
    tags: [tag, 'anImage'],
    uploadPreset: "cqswrbcf"
  };
  openUploadWidget(uploadOptions, (error, photos) => {
    if (!error) {
      if(photos.event === 'success'){
        this.state.event_id = photos.info.public_id;
      }
    } else {
      console.log(error);
    }
  })
}

  render() {

    return (
    <Router>
      <NavBar history={this.props.history}/>
      <div className="MainPage">
        <EventMaker data={this.state} />
        <div className="middleContainer">
          {this.state.addFriend ? <button type="button" className="btnEvent btn-secondary" onClick={ () => this.addFriend() }>Add Friend</button> : this.state.friend ? null :  <button type="button" className="btnEvent btn-secondary" onClick={ () => this.setShow() }>Create Event</button>}
          <Switch>
            <Route exact path={"/Profile/"+this.state.url} render={() => <MainContent data = {this.state}/>}/>
            <Route exact path={"/Profile/"+this.state.url+"/:token"} render={() => <MainContent data = {this.state}/>}/>
          </Switch>
        </div>
        <div className="leftContainer">
          <Profile data={this.state}/>
          <Friends data={this.state} data2={this.props}/>
        </div>
      </div>
      <div>
        <Modal show={this.state.show} onHide={ () => this.setShow() }>
          <Modal.Dialog>
            <Modal.Header closeButton>
              <div/>
              <Modal.Title className="title">
                <h3>Add Event</h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="addEvent">
                <form>
                   <div className="form-group">
                       <label>Title:</label>
                       <input type="text" className="form-control" placeholder="What's your title?" onChange = {e => this.setInputValue("title", e.target.value)}/>
                   </div>
                   <div className="form-group">
                       <label>Description:</label>
                       <textarea className="form-control" placeholder="Give us a quick description" onChange = {e => this.setInputValue("description", e.target.value)}/>
                   </div>
                   <div className="form-group">
                       From: <DatePicker selected={this.state.startDate} onChange={date => this.setDater(date)} showTimeSelect dateFormat="Pp" />
                       To: <DatePicker selected={this.state.startDate1} onChange={date => this.setState({startDate1: new Date(date)})} showTimeSelect dateFormat="Pp" />
                   </div>
                   <div className="form-group2">
                    <Button variant="secondary" onClick={(e) => this.beginUpload()}>Add an Image</Button>
                   </div>
               </form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {this.state.message}
              <Button variant="secondary" onClick={ () => this.setShow() } >Close</Button>
              <Button variant="primary" onClick = {() => this.addEvent()}>Post Event</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
      </div>
    </Router>
    );
  }
}

export default LinkUp;
