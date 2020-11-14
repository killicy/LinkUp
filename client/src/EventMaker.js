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

            <div className= "postEvent">
                <InputField
                    type = 'text'
                    placeholder = 'Title'
                    value = {this.state.title ? this.state.title : ''}
                    onChange = {(val) => this.setInputValue('title', val)}
                />
                <InputField
                    type = 'text'
                    placeholder = 'Description'
                    value = {this.state.description ? this.state.description : ''}
                    onChange = {(val) => this.setInputValue('description', val)}
                />
                <InputField
                    type = 'text'
                    placeholder = 'Start Date'
                    value = {this.state.startDate ? this.state.startDate : ''}
                    onChange = {(val) => this.setInputValue('startDate', val)}
                />
                <InputField
                    type = 'text'
                    placeholder = 'End Date'
                    value = {this.state.endDate ? this.state.endDate : ''}
                    onChange = {(val) => this.setInputValue('endDate', val)}
                />
                <SubmitButton
                    text = 'Create Event'
                    disabled = {this.state.buttonDisabled}
                    onClick = {() => this.doEvent()}
                />
                
            </div>
        );

    }

}

export default EventMaker;