import React from 'react'
//import ReactDOM from 'react-dom'
import './App.css';
import Login from './login.js';
//import logo from './routes/api/logo.svg'

class App extends React.Component{
  constructor() {
    super();
    this.state = {
      date: 'hello world'
    };
  }
  componentDidMount() {
    let res = fetch('https://localhost/routes/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: 'jjj@gmail.com',
        Password: ''
      })
    }).then(response => response.json()).then(data => this.setState({ date: data.msg }));
  }

  render() {
    return (
      <div className="App">
        <Login />
        {this.state.date}
      </div>
    );
  }
}

export default App;
