import React, { Component } from 'react';
class PasswordRecovery extends Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          success: false,
          username: '',
          username2: '',
          isLoggedin: false
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

  async newPassword(){
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/passwordEmail', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email
        })}).then(response => response.json()).then(data => this.setState({}));
    }
    catch(e) {
    }
  }


  render() {
    return(
      <div className="loginForm">
        <form className="login">
           <h3 className="header">Set New Password</h3>
           <div className="form-group">
               <label>New Password</label>
               <input type="email" className="form-control" placeholder="Enter Email" onChange = {e => this.setInputValue("email", e.target.value)}/>
           </div>
           <div className="form-group">
               <label>Confirm Password</label>
               <input type="password" className="form-control" placeholder="Enter Username" onChange = {e => this.setInputValue("username", e.target.value)}/>
           </div>
           <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.newPassword()}>Set New Password</button>
       </form>
      </div>
    );
  }
}

export default PasswordRecovery;
