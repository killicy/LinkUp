import React from 'react';
class Login extends React.Component {

  render() {
    return (
      <div className = "login">
        asdasd
      </div>
    );
  }
}
export default Login;


fetch('/router/api/login', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    Username: 'yourValue',
    Password: 'yourOtherValue',
  })
})
