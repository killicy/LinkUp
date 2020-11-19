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
          events: [],
          friends: [],
          friendEvents: []
      }
  }
  render() {

    return (
    <Router>
      <NavBar history={this.props.history}/>
      <div className="MainPage">
        <EventMaker data={this.state} />
        <Switch>
          <Route exact path={"/"+this.state.url} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path={"/"+this.state.url+"/:token"} render={() => <MainContent data = {this.state}/>}/>
          <Route exact path="" render={() => <Confirmation data = {this.state}/>}/>
        </Switch>
        <div className='Container'>
        </div>
        <div className="leftContainer">
          <Friends data={this.state}/>
        </div>
      </div>
    </Router>
    );
  }
}

export default LinkUp;
