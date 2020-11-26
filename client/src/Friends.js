import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import EventMaker from './EventMaker';
import { Card } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { fetchPhotos, openUploadWidget } from "./CloudinaryService";
import { CloudinaryContext, Image, Transformation } from "cloudinary-react";


class Friends extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          username: '',
          search: '',
          userList: null,
          success1: false,
          success: false,
      }
  }
  componentDidUpdate(prevProps, prevState) {

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

  async findFriends(){
    try {
      await fetch('https://localhost:5000/api/user/searchFriend', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          search: this.state.search
        })}).then(response => response.json()).then(data => this.setState({userList: data.user}));
        if(this.state.userList){
          this.setState({success: true})
        }
     }
     catch(e) {
         console.log(e)
     }
  }

  profile(username){
    console.log(username);
    window.location.href = username;
  }

  async findUsers(){
    try {
      await fetch('https://localhost:5000/api/user/searchUsers', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          search: this.state.search
        })}).then(response => response.json()).then(data => this.setState({userList: data.user}));
        if(this.state.userList){
          this.setState({success1: true})
        }
     }
     catch(e) {
         console.log(e)
     }
  }

  render() {
    return (
      <div className="Friends border border-dark">
        <Tabs defaultActiveKey="home" className="friendTabs flex-nowrap" transition={false}>
          <Tab eventKey="home" className="Myfriends" title="Friends">
            {this.state.success ?
              <div className="userGrid">{this.state.userList.map((friend, index) => {
                return (
                    <Card key={index} className="box border border-dark mb-1">
                      <Card.Body>
                        <p>{friend.Username}</p>
                      </Card.Body>
                    </Card>
                );
                })}
              </div>
              :
              <div className="userGrid">{this.props.data.friends.map((friend, index) => {
                return (
                    <Card key={index} className="box border border-dark mb-1">
                      <Card.Body>
                      {console.log(friend)}
                        <div className='friendImages'>
                          <Image cloudName= "dsnnlkpj9" publicId="dmiigmmpxpfb7wqfprfj" className = "profilePic" onClick={ () => this.profile(friend.Username) }>
                            <Transformation width="200" height="200" gravity="face" radius="max" crop="crop" />
                            <Transformation width="50" crop="scale" />
                          </Image><p>{friend.Username}</p>
                        </div>
                      </Card.Body>
                    </Card>
                );
                })}
              </div>
            }
            <form className="friendSearch">
               <div className="form-group">
                   <input type="text" className="form-control" placeholder="Enter a Username or Email" onChange = {e => this.setInputValue("search", e.target.value)}/>
               </div>
               <button type="button" className="searchBtn btn-primary btn-block" onClick = {() => this.findFriends()}>Find a friend</button>
           </form>
          </Tab>
          <Tab eventKey="profile" className="Findfriends"title="Find Friends">
            {this.state.success1 ?
              <div className="userGrid">{this.state.userList.map((friend, index) => {
                return (
                    <Card key={index} className="box border border-dark mb-1">
                      <Card.Body>
                        <div className='friendImages'>
                          <Image cloudName= "dsnnlkpj9" publicId="dmiigmmpxpfb7wqfprfj" className = "profilePic" onClick={ () => this.profile(friend.Username) }>
                            <Transformation width="200" height="200" gravity="face" radius="max" crop="crop" />
                            <Transformation width="50" crop="scale" />
                          </Image><p>{friend.Username}</p>
                        </div>
                      </Card.Body>
                    </Card>
                );
                })}
              </div>
              : null
            }
            <form className="friendSearch">
               <div className="form-group">
                   <input type="text" className="form-control" placeholder="Enter a Username or Email" onChange = {e => this.setInputValue("search", e.target.value)}/>
               </div>
               <button type="button" className="searchBtn btn-primary btn-block" onClick = {() => this.findUsers()}>Find a user</button>
           </form>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Friends;
