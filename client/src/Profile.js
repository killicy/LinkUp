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
import { CloudinaryContext, Image, Transformation } from "cloudinary-react";
import { fetchPhotos, openUploadWidget } from "./CloudinaryService";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect,
  Route,
} from "react-router-dom";


class Profile extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          isLoggedin: false,
          event: [{title: 'Movie Night', description: 'Friday the 13th part 13: The Final Friday'}, {title: 'BBQ', description: 'Ribs, Burgers, Obesity'}],
          id: 'a',
      }
  }
  render() {
    return (
      <div className="Profile border border-dark">
        <div className="space"></div>
        <Card className="profileStuff mb-4 border-0">
          <Image cloudName= "demo" publicId="lady.jpg" className = "profilePic">
            <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
            <Transformation width="200" crop="scale" />
          </Image>
          <Card.Body>
            <Card.Title><div className="name">Jen Eric Ladee</div></Card.Title>
            <Card.Text><p>About Me: I spend my free time posing for stock images. I enjoy events where I can eat food such as salads and yogurt while laughing with my head thrown back.</p></Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Profile;
