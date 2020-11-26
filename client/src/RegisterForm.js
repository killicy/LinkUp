import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
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
      await fetch(process.env.REACT_APP_API_URL + '/api/user/isLoggedin', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
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
  await fetch(process.env.REACT_APP_API_URL + '/api/user/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
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
      this.resetForm();
    }
  }
  render() {
    return(
      <div className="registerForm">
        <form>
        <div className= "registerTitle"><h4>Sign Up</h4></div>
           <div className="form-group">
               <h6>Username</h6>
               <input type="text" className="form-control" placeholder="Enter a username" onChange = {e => this.setInputValue("username", e.target.value)}/>
           </div>
           <div className="form-group">
               <h6>Email</h6>
               <input type="email" className="form-control" placeholder="Enter an email" onChange = {e => this.setInputValue("email", e.target.value)}/>
           </div>
           <div className="form-group">
               <h6>Password</h6>
               <input type="password" className="form-control" placeholder="Enter a password" onChange = {e => this.setInputValue("password", e.target.value)}/>
           </div>
           {/* <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.doRegister()}>Sign Up</button> */}
           <Button variant="primary" size= "lg" block onClick = {() => this.doRegister()}>Register</Button>{' '}
           <p className="need-an-account text-right">
               Took a wrong turn? <a href={process.env.REACT_APP_CLIENT_URL}>Go Back</a>
           </p>
       </form>
      </div>
    );
  }
}

export default RegisterForm;
