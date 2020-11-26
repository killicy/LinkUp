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

  render() {
    return(
      <div className="loginForm">
        <form className="login">
           <h3 className="header">Set New Password</h3>
           <div className="form-group">
               <label>New Password</label>
               <input type="password" className="form-control" placeholder="Enter Password" onChange = {e => this.setInputValue("username", e.target.value)}/>
           </div>
           <div className="form-group">
               <label>Confirm Password</label>
               <input type="password" className="form-control" placeholder="Enter Password" onChange = {e => this.setInputValue("password", e.target.value)}/>
           </div>
           <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.newPassword()}>Set New Password</button>
       </form>
      </div>
    );
  }
}

export default PasswordRecovery;
