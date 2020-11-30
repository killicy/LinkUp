import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import SubmitButton from './SubmitButton';
import EventMaker from './EventMaker';
import { Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Image, Transformation } from "cloudinary-react";

class MainContent extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          message: '',
          username: '',
          showy: [],
          success: false
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
  
  list(data){
    if(data === undefined){
      return(
        null
      )
    }
    return (
      <div className="participants">
        Participants:
        <div className="participantsList">
          {data.map((user, index) =>{
            return (
              <div className="parti">{user.Username},</div>
            )
          })}
        </div>
      </div>
    );
  }
  
  
  
  async componentDidMount() {
    await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedIn', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
      },
      body: JSON.stringify({})
    }).then(response => response.json()).then(data => {
      if (data.success !== false) {
        this.setState({username:data.msg});
      }
    });
  }
  
  async addEvent(Title){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/event/addParticipant', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Title: Title
        })}).then(response => response.json()).then(data => {
          let temp = [];
          let sy = this.props.data.showy;
      
          this.props.data.friendEvents1.forEach((el, i) => {
            if (el.Title === data.Title) {
              sy[i] = true;
              el.Participants = data.Participants;
              
              this.props.data.participants[i] = el.Participants;
            }
            temp.push(el);
          });
          
          this.props.data.friendEvents1 = temp;
          this.props.data.showy = sy;
          
          this.setState({})
        });
    }
    catch(e) {
    }
  }
  
  async removeEvent(Title){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/event/removeParticipant', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Title: Title
        })}).then(response => response.json()).then(data => {
          
          let temp = [];
          let sy = this.props.data.showy;
      
          this.props.data.friendEvents1.forEach((el, i) => {
            if (el.Title === data.Title) {
              let tempPart = [];
              el.Participants.forEach(part => {
                if (part.Username !== this.state.username) {
                  tempPart.push(part);
                }
                else {
                  sy[i] = false;
                }
              });
              
              el.Participants = tempPart;
              this.props.data.participants[i] = tempPart;
            }
            temp.push(el);
          });
          
          this.props.data.friendEvents1 = temp;
          this.props.data.showy = sy;
          
          this.setState({});
        });
    }
    catch(e) {
    }
  }

  render() {
    return(
      <div className= "mainContent">
          <div className="contentGrid">{this.props.data.friendEvents1.map((event, index) => {
            return (
                <Card key={index} className="EventCards">
                <Card.Header>
                  <Card.Title onClick={ () => this.setShow() }>
                    <p className="cardHead">
                      <div className="cardAuthor">
                        <Image cloudName= "dsnnlkpj9" publicId={event.Author.Profile_pic} className = "profilePic">
                          <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
                          <Transformation width="200" crop="scale" />
                        </Image>
                        {event.Author.Username}
                      </div>
                      {event.Title}
                      <div className="eventDate">From { new Intl.DateTimeFormat("en", {dateStyle:'short',timeStyle:'short'}).format(new Date(event.Date_Start)) } to { new Intl.DateTimeFormat("en", {dateStyle:'short',timeStyle:'short'}).format(new Date(event.Date_End)) }</div>
                      
                    </p> 
                  </Card.Title>
                     </Card.Header>
                  <div className="spacer">
                    <Image cloudName= "dsnnlkpj9" publicId={event.Event_Image} className = "eventPic">
                      <Transformation border="8px_solid_black" />
                    </Image>
                  </div>
             
                <Card.Body>
                  <Card.Text>{event.Description}</Card.Text>
                  {this.list(this.props.data.participants[index])}
                </Card.Body>
                <Card.Footer>
                  {this.props.data.showy[index] === false ? <button type="button" className="searchBtn btn-dark btn-block" onClick = {() => this.addEvent(event.Title)}>Subscribe to event</button>
                  : <button type="button" className="searchBtn btn-dark btn-block" onClick = {() => this.removeEvent(event.Title)}>Unsubscribe from event</button>}
                </Card.Footer>

                </Card>
            );
          })}
          </div>
      </div>
    );
  }
}

export default MainContent;
