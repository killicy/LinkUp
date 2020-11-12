import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            message: '',
            buttonDisabled: false,
            success: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();

        // Username and Password is 12 characters max
        if (val.length > 12) {
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
            buttonDisabled: false
        })
    }

    doSignUp(){
      UserStore.register = true;
    }

    async doLogin() {

      this.setState({
          buttonDisabled: true
      })

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
        UserStore.login = true;
        UserStore.username = this.state.username
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
              {this.state.token}
            </div>
        );
    }
}

export default LoginForm;
