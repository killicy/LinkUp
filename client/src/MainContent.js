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
      })}).then(response => response.json()).then(data => this.setState({}));
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
                  <Card.Title onClick={ () => this.setShow() }><p className="cardHead">{event.Title}<br/><br/>Made by:<div>{" "}</div>{event.Author.Username}</p></Card.Title>
                  <div className="eventDate"><DatePicker selected={new Date(event.Date_Start)} todayHighlight showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" /></div>
                  <Image cloudName= "dsnnlkpj9" publicId={event.Event_Image} className = "eventPic">
                    <Transformation border="8px_solid_black" />
                  </Image>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{event.Description}</Card.Text>
                  {this.list(this.props.data.participants[index])}
                </Card.Body>
                <Card.Footer>
                </Card.Footer>
                  {this.props.data.showy[index] === false ? <button type="button" className="searchBtn btn-dark btn-block" onClick = {() => this.addEvent(event.Title)}>Join Event</button>
                  : <button type="button" className="searchBtn btn-dark btn-block" onClick = {() => this.addEvent(event.Title)}>Remove Event</button>}
                </Card>
            );
          })}
          </div>
      </div>
    );
  }
}

export default MainContent;
