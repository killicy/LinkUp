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

class MainContent extends React.Component {


  componentDidUpdate(prevProps) {
}

async addEvent(Title){
  try {
    await fetch('https://localhost:5000/api/event/addParticipant', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'https://localhost:5000',
      },
      body: JSON.stringify({
        Title: Title
      })}).then(response => response.json()).then(data => this.setState({}));
  }
  catch(e) {
  }
}

    render() {
          if(this.props.data.friend){
            return(
              <div className= "mainContent">
                  <div className="contentGrid">{this.props.data.events.map((event, index) => {
                    return (
                        <Card key={index} className="EventCards border border-dark mb-1">
                        <Card.Body>
                          <Card.Title>{event.Title} <DatePicker selected={new Date(event.Date_Start)} showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" /></Card.Title>
                          <Card.Text>-{event.Description}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <button type="button" className="searchBtn btn-secondary btn-block" onClick = {() => this.addEvent(event.Title)}>Add Event</button>
                        </Card.Footer>
                        </Card>
                    );
                  })}
                  </div>
              </div>
            );
          }
          else {
            return(
              <div className= "mainContent">
                  <div className="contentGrid">{this.props.data.events.map((event, index) => {
                    return (
                        <Card key={index} className="EventCards border border-dark mb-1">
                        <Card.Header>
                          <Card.Title>{event.Title}</Card.Title>
                          <DatePicker selected={new Date(event.Date_Start)} showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" />
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>-{event.Description}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
                        </Card>
                    );
                  })}
                  </div>
              </div>
            );
          }
      }
}

export default MainContent;
