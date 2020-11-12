import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  useLocation,
  Redirect
} from "react-router-dom";
const cookies = new Cookies();

class LoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      msg: '',
      buttonDisabled: false,
      isLoggedin: false,
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
         if (this.state.isLoggedin) {
           this.props.history.push('/LinkUp');
         }
         else {
           this.props.history.push('/');
         }
    }
    catch(e) {
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
  resetForm() {
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false,
      isLoggedin: false,
    })
  }


  doSignUp(){
    this.props.history.push('/Register');
  }
  async doLogin(){
    await fetch('https://localhost:5000/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'https://localhost:5000',
        },
        body: JSON.stringify({
          Email: this.state.username,
          Password: this.state.password
        })}).then(response => response.json()).then(data => this.setState({username: data.Username, message: data.msg, success: data.success}));

      if(this.state.success){
        this.props.history.push('/LinkUp');
      }
      else {
        this.resetForm();
      }
  }

    render() {
        return(
            <div className="loginForm">
              Log in
              <InputField
                type = 'text'
                placeholder = 'Email'
                value = {this.state.username ? this.state.username : ''}
                onChange = {(val) => this.setInputValue('username', val)}
              />
              <InputField
                type = 'password'
                placeholder = 'Password'
                value = {this.state.password ? this.state.password : ''}
                onChange = {(val) => this.setInputValue('password', val)}
              />
              <SubmitButton
                text = 'Login'
                disabled = {this.state.buttonDisabled}
                onClick = {() => this.doLogin()}
              />
              <SubmitButton
                text = 'Register'
                disabled = {this.state.buttonDisabled}
                onClick = {() => this.doSignUp()}
              />
            </div>
        );
    }
}

export default LoginForm;
