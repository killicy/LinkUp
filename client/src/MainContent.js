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
    console.log("help");
    this.setState({
      show: false,
      message: ''
    });
  }
}



async componentDidMount() {
  console.log(this.props);
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
          <div className="contentGrid">{this.props.data.events.map((event, index) => {
            return (
                <Card key={index} className="EventCards border border-dark mb-1">
                <Card.Header>
                  <Card.Title onClick={ () => this.setShow() }>{event.Title}</Card.Title>
                  <DatePicker selected={new Date(event.Date_Start)} showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" />
                </Card.Header>
                <Card.Body>
                  <Card.Text>-{event.Description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                </Card.Footer>
                  {this.props.data.showy[index] === false ? <button type="button" className="searchBtn btn-secondary btn-block" onClick = {() => this.addEvent(event.Title)}>Add Event</button>
                  : <button type="button" className="searchBtn btn-secondary btn-block" onClick = {() => this.addEvent(event.Title)}>Unenroll</button>}
                </Card>
            );
          })}
          </div>
      </div>
    );
  }
}

export default MainContent;
