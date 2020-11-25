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

    render() {
        return(
          <div className= "mainContent">
              <div className="contentGrid">{this.props.data.events.map((event, index) => {
                return (
                    <Card key={index} className="EventCards border border-dark mb-1">
                    <Card.Body>
                      <Card.Title>{event.Title} <DatePicker selected={new Date(event.Date_Start)} showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" /></Card.Title>
                      <Card.Text>-{event.Description}</Card.Text>
                    </Card.Body>
                    </Card>
                );
              })}
              </div>
          </div>
        );
      }
}

export default MainContent;
