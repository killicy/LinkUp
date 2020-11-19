import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import SubmitButton from './SubmitButton';
import logo from './stores/user.svg';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import MenuItem from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/Dropdown'

import { CloudinaryContext, Image, Transformation } from "cloudinary-react";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    className="figure"
    variant="success"
    id="dropdownNav"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

class NavBar extends React.Component {

  constructor(props){
      super(props);
      this.state = {
          message: '',
          success: false,
          username: '',
      }
  }

  async componentDidMount() {
    try {
      await fetch('https://localhost:5000/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success, message: data.msg}));
    }
    catch(e) {
    }
  }
  async profile(){
    console.log(this.props);
    try {
      await fetch('https://localhost:5000/api/user/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        }}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg, username: data.username}));
         if (this.state.success) {
           this.props.history.replace('/');
           this.prop.history.push('/' + this.state.username);
         }
         else {
           this.props.history.replace('/');
         }
    }
    catch(e) {
      this.props.history.replace('/');
    }
  }

  async doLogout(){
    try {
       await fetch('https://localhost:5000/api/user/logOut', {
         method: 'GET',
         credentials: 'include',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin':'https://localhost:5000',
         }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         this.props.history.push('/');
     }
     catch(e) {
         console.log(e)
     }
  }

  render() {
    return(
      <div className="NavBar">
        <Dropdown className = "profileDropdown">
          <Dropdown.Toggle as={CustomToggle}>
          <Image cloudName= "demo" publicId="lady.jpg" className = "profilePic">
            <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
            <Transformation width="50" crop="scale" />
          </Image>
          </Dropdown.Toggle>
          <Dropdown.Menu className = "navBarDropdown">
            <Dropdown.Item href="#/action-1" onClick={ () => this.doLogout() }>
              Log Out
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={ () => this.profile() }>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={ () => this.profile() }>
              My Account
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </div>
    );
  }
}

export default NavBar;
