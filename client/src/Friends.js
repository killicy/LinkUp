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
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'



class Friends extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          username: ''
      }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      filtered: nextProps.items
    });
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
         await fetch(process.env.REACT_APP_API_URL + '/api/user/addFriend', {
           method: 'POST',
           credentials: 'include',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
           }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
       }
       catch(e) {
           console.log(e)
       }
    }

  async findFriend(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/searchFriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          searchField: this.state.searchField
        })}).then(response => response.json()).then(data => this.setState({message: data.msg}));
     }
     catch(e) {
         console.log(e)
     }
  }
  render() {
    return (
      <div className="Friends flex-nowrap border border-dark">
        <Tabs defaultActiveKey="home" className="friendTabs flex-nowrap" transition={false} id="noanim-tab-example">
          <Tab eventKey="home" className="Myfriends" title="Friends">
            <div className="grid">{this.props.data.friends.map((friend, index) => {
              return (
                  <Card style={{ width: "18rem" }} key={index} className="box border border-dark mb-1">
                  <Card.Body>
                      <Card.Title>{friend.Username}</Card.Title>
                  </Card.Body>
                  </Card>
              );
              })}
            </div>
          </Tab>
          <Tab eventKey="profile" className="Findfriends"title="Find Friends">
            <form className="friendSearch">
               <div className="form-group">
                   <input type="text" className="form-control" placeholder="Enter username" onChange = {e => this.setInputValue("username", e.target.value)}/>
               </div>
               <button type="button" className="searchBtn btn-primary btn-block" onClick = {() => this.findFriend()}>Find a friend</button>
           </form>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Friends;
