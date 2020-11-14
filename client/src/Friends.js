import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import InputField from './InputField';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import SubmitButton from './SubmitButton';
import EventMaker from './EventMaker';  
import { Card } from "react-bootstrap";

class Friends extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: ''
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

    async addFriend(){
        try {
           await fetch('https://localhost:5000/api/user/addFriend', {
             method: 'POST',
             credentials: 'include',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin':'https://localhost:5000',
             }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         }
         catch(e) {
             console.log(e)
         }
      }

      async findFriend(){
        try {
           await fetch('https://localhost:5000/api/user/addFriend', {
             method: 'POST',
             credentials: 'include',
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Access-Control-Allow-Origin':'https://localhost:5000',
             }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         }
         catch(e) {
             console.log(e)
         }
      }
    render() {
        return (
        
            <div className="Friends">
                <InputField
                    type = 'text'
                    placeholder = 'UserName'
                    value = {this.state.username ? this.state.username : ''}
                    onChange = {(val) => this.setInputValue('username', val)}
                />
                <SubmitButton
                    text = 'Add Friend'
                    onClick = {() => this.addFriend()}
                />
                <SubmitButton
                    text = 'Find Friend'
                    onClick = {() => this.findFriend()}
                />
            </div>
        );

    }
}

export default Friends;