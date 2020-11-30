
import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import SubmitButton from './SubmitButton';
import profile from './stores/user.svg';
import logo from './stores/LinkUp.png';
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import MenuItem from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/Dropdown'
import Modal from 'react-bootstrap/Modal'
import { Card } from "react-bootstrap";
import { fetchPhotos, openUploadWidget } from "./CloudinaryService";



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
          show: false,
          id: '',
          user: {Profile_pic: 'lady.jpg'}
      }
  }


  beginUpload(tag) {
  // <button onClick={(e) => this.beginUpload()}>Upload Image</button>
  const uploadOptions = {
    cloudName: "dsnnlkpj9",
    tags: [tag, 'anImage'],
    uploadPreset: "cqswrbcf"
  };
  openUploadWidget(uploadOptions, (error, photos) => {
    if (!error) {
      if(photos.event === 'success'){
        this.state.id = photos.info.public_id;
      }
    } else {
      console.log(error);
    }
  })
}


  async componentDidMount() {
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedIn', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success, message: data.msg}));
    }
    catch(e) {
    }
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/getUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({user: data.user, success: data.success}));
        if (this.state.success) {
          console.log(this.state.user.Profile_pic);
          this.setState({
            user: this.state.user});
        }
        else {
        }
    }
    catch(e) {
    }
  }
  async profile(){
    console.log(this.props);
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/getUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({success: data.success, message: data.msg, username: data.username}));
         if (this.state.success) {
           this.props.history.replace('/Profile');
           this.props.history.push("/Profile/" + this.state.user.Username);
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
       await fetch(process.env.REACT_APP_API_URL + '/api/user/logOut', {
         method: 'GET',
         credentials: 'include',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
         }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
         this.props.history.push('/');
     }
     catch(e) {
         console.log(e)
     }
  }


  setShow(){
    console.log("help");
    if(this.state.show === false){
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

  async setChanges(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/changeProfilePic', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Url: this.state.id
        })}).then(response => response.json()).then(data => this.setState({success: data.success}));
        if(this.state.success === true){
          this.state.success = false;
          this.setShow();
          window.location.reload();
        }
        else{
        }
    }
    catch(e) {
    }
  }


  render() {
    return(
      <div className="NavBar">
        <div>
          <Modal show={this.state.show} onHide={ () => this.setShow() }>
            <Modal.Dialog>
              <Modal.Header closeButton>
                <div/>
                <Modal.Title>Edit Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className="space"></div>
                    <form>
                      <div className="formEdit">
                         <Image cloudName= "dsnnlkpj9" publicId={this.state.user.Profile_pic} className = "profilePic" onClick={(e) => this.beginUpload()}>
                           <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
                           <Transformation width="200" crop="scale" />
                         </Image>
                        </div>
                       <div className="form-group">
                           <label>First Name:</label>
                           <input type="text" className="form-control" placeholder="First Name" onChange = {e => this.setInputValue("title", e.target.value)}/>
                       </div>
                       <div className="form-group">
                           <label>Last Name:</label>
                           <input type="text" className="form-control" placeholder="Last Name" onChange = {e => this.setInputValue("title", e.target.value)}/>
                       </div>
                       <div className="form-group">
                           <label>Description:</label>
                           <textarea className="form-control" placeholder="Tell us about yourself" onChange = {e => this.setInputValue("description", e.target.value)}/>
                       </div>
                   </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={ () => this.setShow() } >Close</Button>
                <Button variant="primary" onClick={ () => this.setChanges() }>Save changes</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal>
        </div>
        <div>
          <a href={process.env.REACT_APP_CLIENT_URL}><img src={logo} alt="Logo" /></a>
        </div>
        <Dropdown className = "profileDropdown">
          <Dropdown.Toggle as={CustomToggle}>
          <Image cloudName= "dsnnlkpj9" publicId={this.state.user.Profile_pic} className = "profilePic">
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
