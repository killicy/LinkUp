import React, { Component } from 'react';
import { withRouter } from "react-router";
class PasswordRecovery extends Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          success: false,
          username: '',
          token: props.match.params.user !== undefined ? props.match.params.user : '',
          password: '',
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
  
  async newPassword() {
    try {
      await fetch(process.env.REACT_APP_API_URL + '/api/user/forgotPassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.REACT_APP_CLIENT_URL,
        },
        body: JSON.stringify({
          Token: this.state.token,
          Password: this.state.password
        })}).then(response => response.json()).then(data => {
          this.setState({});
          
          this.props.history.push('/');
          //window.location.href = process.env.REACT_APP_CLIENT_URL;
        });
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
               <label>Password</label>
               <input type="password" className="form-control" placeholder="Enter Password" onChange = {e => this.setInputValue("password", e.target.value)}/>
           </div>
           <button type="button" className="loginBtn btn-primary btn-block" onClick = {() => this.newPassword()}>Set New Password</button>
           {
             this.state.message ? <div className="alert alert-danger text-center">{this.state.message}</div> : ''
           }
       </form>
      </div>
    );
  }
}

export default withRouter(PasswordRecovery);
