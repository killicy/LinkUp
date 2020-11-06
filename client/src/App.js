import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
<<<<<<< Updated upstream
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
=======
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import SubmitButton from './SubmitButton';

class App extends React.Component {
  
  async componentDidMount() {
    try {

         let res = await fetch('/isLoggedIn', {
             method: 'post',
             headers: {
                 'Accept': 'application/json',
                 'Content-  Type': 'application/json'
             }
         });

         let result = await res.json();

         if (result && result.success) {
             UserStore.loading = false;
             UserStore.loggedIn = true;
             UserStore.username = result.username;
         }

         else {
             UserStore.loading = false;
             UserStore.isLoggedIn = false;
         }

    }

    catch(e) {
         UserStore.loading = false;
         UserStore.isLoggedIn = false;
    }
}

async doLogout() {
     try {

         let res = await fetch('/logout', {
             method: 'post',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }
         });

         let result = await res.json();

         if (result && result.success) {
             UserStore.loggedIn = false;
             UserStore.username = '';
         }

     }

     catch(e) {
         console.log(e)
     }
 }
>>>>>>> Stashed changes

  render() {
      if(UserStore.loading) {
        return (
          <div className="app">
              <div className="container">
                  Loading...
              </div>
          </div>
        );
      }

      else {
        
        if (UserStore.isLoggedIn) {
          return (
            <div className="app">
                <div className='container'>
                    Welcome {UserStore.username}

                    <SubmitButton
                        text={'Log Out'}
                        disabled={false}
                        onClick={ () => this.doLogout() }

                    />
                </div>
            </div>
          );
        }

        return (
          <div className="app">
              <div className='container'>
                  <LoginForm />
              </div>
          </div>
        );

      }
  }
}

export default observer(App);
