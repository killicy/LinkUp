import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import SubmitButton from './SubmitButton';
import profile from './stores/user.svg';
import logo from './stores/Logo2.svg';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import MenuItem from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import { Card } from "react-bootstrap";



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
          show: false
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
           this.props.history.replace('/Profile');
           this.props.history.push("/Profile/" + this.state.username);
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


  setShow(){
    console.log("help");
    if(this.state.show == false){
      this.setState({
        show: true
      });
    }
    else{
      console.log("help");
      this.setState({
        show: false
      });
    }
  }


  render() {
    return(
      <div className="NavBar">
        <div>
          <Modal show={this.state.show} onHide={ () => this.setShow() }>
            <Modal.Dialog>
              <Modal.Header closeButton>
                <Modal.Title>Edit Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="Profile border border-dark">
                  <div className="space"></div>
                  <Card className="profileStuff mb-4 border-0">
                    <Image cloudName= "demo" publicId="lady.jpg" className = "profilePic">
                      <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
                      <Transformation width="200" crop="scale" />
                    </Image>
                    <Card.Body className="bodyCard">
                      <Card.Title><div className="name">Jen Eric Ladee</div></Card.Title>
                      <Card.Text className="profileBody"><textarea className="editProfileText">About Me: I spend my free time posing for stock images. I enjoy events where I can eat food such as salads and yogurt while laughing with my head thrown back.</textarea></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={ () => this.setShow() } >Close</Button>
                <Button variant="primary">Save changes</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal>
        </div>
        <div>
          <img src={logo} alt="Logo" />
        </div>
        <Dropdown className = "profileDropdown">
          <Dropdown.Toggle as={CustomToggle}>
          <Image cloudName= "demo" publicId="lady.jpg" className = "profilePic">
            <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
            <Transformation width="50" crop="scale" />
          </Image>
          </Dropdown.Toggle>
          <Dropdown.Menu className = "navBarDropdown">
            <Dropdown.Item onClick={ () => this.doLogout() }>
              Log Out
            </Dropdown.Item>
            <Dropdown.Item onClick={ () => this.profile() }>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={ () => this.setShow() }>
              My Account
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </div>
    );
  }
}

export default NavBar;
