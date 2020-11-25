import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import Cookies from 'universal-cookie';
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
            message: ''
        }
    }

  setInputValue(property, val) {
      val = val.trim();
      if (val.length > 25) {
          return;
      }
      this.setState({
          [property]: val
      })
  }

  resetForm() {
      this.setState({

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
        }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
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
      this.props.history.push('/');
    }
    else {
    }
  }
  render() {
    return(
      <div className="loginForm">
        <form className="login">
            {this.state.message}
           <div className="form-group">
               <label>Username</label>
               <input type="text" className="form-control" placeholder="Enter username" onChange = {e => this.setInputValue("username", e.target.value)}/>
           </div>
           <div className="form-group">
               <label>Email</label>
               <input type="email" className="form-control" placeholder="Enter Email" onChange = {e => this.setInputValue("email", e.target.value)}/>
           </div>
           <div className="form-group">
               <label>Password</label>
               <input type="password" className="form-control" placeholder="Enter password" onChange = {e => this.setInputValue("password", e.target.value)}/>
           </div>
           <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.doRegister()}>Sign Up</button>
           <p className="need-an-account text-right">
               Took a wrong turn? <a href="http://localhost:3000">Go Back</a>
           </p>
       </form>
      </div>
    );
  }
}

export default RegisterForm;
