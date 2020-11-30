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
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Image, Transformation } from "cloudinary-react";


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
            msg: '',
            show: []
        }
    }

    setShow(index){

      if(this.state.show[index] === undefined || this.state.show[index] === false){
        this.state.show[index] = true;
        this.setState({
          message: ''
        });
      }
      else{
        this.state.show[index] = false;
        this.setState({
          message: ''
        });
      }
    }
    async doEvent() {

        this.setState({
            buttonDisabled: true
        })

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

  render() {
    return(
      <div className= "userEvents flex-nowrap border">
        <div className="myeventHeader">
          <p className="headerText">Events</p>
        </div>
        <div className="eventGrid">{this.props.data.events.map((event, index) => {
          return (
            <div>
              <Card key={index} className="boxer border mb-1">
              <Card.Header className="eventhead"onClick={ () => this.setShow(index) }>
                <Card.Title><p className="eventHeight">{event.Title}</p></Card.Title>
                <DatePicker selected={new Date(event.Date_Start)} zIndexOffset={-50} showTimeSelect dateFormat="Pp" />
              </Card.Header>
              <Card.Body>
                <Card.Text><p className="ptag">-{event.Description}</p></Card.Text>
              </Card.Body>
              <Card.Footer>
                <button type="button" className="searchBtn btn-dark btn-block" onClick={ () => this.setShow(index) }>Remove Event</button>
              </Card.Footer>
              </Card>
              <Modal show={this.state.show[index]} onHide={ () => this.setShow(index) }>
                <Modal.Dialog>
                  <Modal.Body>
                    <Card key={index} className="EventCards border">
                    <Card.Header>
                      <Card.Title><p className="cardHead">{event.Title}<br/><br/>Made by:<div>{" "}</div>{event.Author.Username}</p></Card.Title>
                      <div className="eventDate"><DatePicker selected={new Date(event.Date_Start)} showTimeSelect dateFormat="Pp" /> <DatePicker selected={new Date(event.Date_End)} showTimeSelect dateFormat="Pp" /></div>
                      <Image cloudName= "dsnnlkpj9" publicId={event.Event_Image} className = "eventPic">
                        <Transformation border="8px_solid_black" />
                      </Image>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>{event.Description}</Card.Text>
                      {this.list(this.props.data.participants1[index])}
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                    </Card>
                    </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={ () => this.setShow(index) } >Close</Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal>
            </div>
          );
          })}
        </div>
      </div>
    );
  }
}

export default EventMaker;
