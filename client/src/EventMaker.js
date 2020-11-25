import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import {BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card } from "react-bootstrap";
import InputField from './InputField';


class EventMaker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            buttonDisabled: false,
            success: false,
            isLoggedin: false,
            msg: ''
        }
    }
    async doEvent() {

        this.setState({
            buttonDisabled: true
        })

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
          Date_End: this.state.endDate
        })}).then(response => response.json()).then(data => this.setState({msg: data.msg}));

        if(this.state.msg == 'Event already exists'){
            console.log("error");
            this.resetForm();
        }
        else {

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

  render() {
    return(
      <div className= "userEvents flex-nowrap border border-dark">
        <div className="myeventHeader">
          <p>Events</p>
        </div>
        <div className="eventGrid">{this.props.data.events.map((event, index) => {
          return (
              <Card key={index} className="boxer border border-dark mb-1">
              <Card.Body>
                  <Card.Title><p>{event.Title}</p></Card.Title>
                  <Card.Text><p className="ptag">-{event.Description}</p></Card.Text>
              </Card.Body>
              </Card>
          );
          })}
        </div>
      </div>
    );
  }
}

export default EventMaker;
