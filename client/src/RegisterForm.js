import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class RegisterForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            buttonDisabled: false,
            success: false,
            isLoggedin: false,
            msg: ''
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
          email: '',
          password: '',
          buttonDisabled: false,
          success: false,
          isLoggedin: false,
          msg: ''
      })
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
         }
    }
    catch(e) {
    }
  }

  async doRegister() {

    this.setState({
        buttonDisabled: true
    })

  await fetch('https://localhost:5000/api/user/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Username: this.state.username,
      Email: this.state.email,
      Password: this.state.password
    })}).then(response => response.json()).then(data => this.setState({ username: data.username, message: data.msg, success: data.success}));

    if(this.state.success){
      this.props.history.push('/Login');
    }
    else {
      this.resetForm();
    }
  }
  render() {
      return(
          <div className="registerForm">
            Register
            <InputField
              type = 'text'
              placeholder = 'Username'
              value = {this.state.username ? this.state.username : ''}
              onChange = {(val) => this.setInputValue('username', val)}
            />
            <InputField
              type = 'text'
              placeholder = 'Email'
              value = {this.state.email ? this.state.email : ''}
              onChange = {(val) => this.setInputValue('email', val)}
            />
            <InputField
              type = 'password'
              placeholder = 'Password'
              value = {this.state.password ? this.state.password : ''}
              onChange = {(val) => this.setInputValue('password', val)}
            />
            <SubmitButton
              text = 'Register'
              disabled = {this.state.buttonDisabled}
              onClick = {() => this.doRegister()}
            />
            {this.state.message}
          </div>
      );
  }
}

export default RegisterForm;
