import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import logo from './stores/drawing.svg';

import {
  BrowserRouter as Router,
  Switch,
  Link,
  Redirect
} from "react-router-dom";

class LoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      msg: '',
      buttonDisabled: false,
      isLoggedin: false,
    }
  }
  async componentDidMount() {
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success, message: data.msg}));
         if (this.state.isLoggedin) {
          this.props.history.push('/Profile/' + this.state.message);
         }
         else {
         }
    }
    catch(e) {
    }
  }
  setInputValue(property, val) {
    console.log(val);
    if (val.length > 50) {
      return;
    }
    this.setState({
      [property]: val
    })
  }
  resetForm() {
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false,
      isLoggedin: false,
      email: ''
    })
  }


  doSignUp(){
    this.props.history.push('/Register');
  }
  async doLogin(){
    console.log(this.state.password)
    await fetch(process.env.REACT_APP_API_URL + '/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Username: this.state.username,
          Password: this.state.password
        })}).then(response => response.json()).then(data => this.setState({username: data.Username, message: data.msg, success: data.success, email: data.Email}));

      if(this.state.success){
        this.props.history.push('/Profile/' + this.state.username);
      }
      else {
        this.resetForm();
      }
  }

  render() {
    return(
      <div className="loginStyling">
        <div className="loginForm">
          <form className="login">
             <h3 className="header">Sign In</h3>
             <div className="form-group">
                 <label>Username</label>
                 <input type="text" className="form-control" placeholder="Enter username" onChange = {e => this.setInputValue("username", e.target.value)}/>
             </div>
             <div className="form-group">
                 <label>Password</label>
                 <input type="password" className="form-control" placeholder="Enter password" onChange = {e => this.setInputValue("password", e.target.value)}/>
             </div>
             <div className="form-group">
                 <div className="custom-control custom-checkbox">
                     <input type="checkbox" className="custom-control-input" id="customCheck1" />
                 </div>
             </div>
             <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.doLogin()}>Sign In</button>
             <p className="need-an-account text-right">
                 Need an account? <a href={process.env.REACT_APP_CLIENT_URL + "/Register"}>Register</a>
             </p>
             <p className="forgot-password text-right">
                 Forgot <a href={process.env.REACT_APP_CLIENT_URL + "/PasswordRecovery"}>Password?</a>
             </p>
         </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
