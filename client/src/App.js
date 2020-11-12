import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SubmitButton from './SubmitButton';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          loggedIn: 'No',
          message: '',
          isLoggedin: false
      }
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
             UserStore.loading = false;
             UserStore.login = true;
             UserStore.username = this.state.message;
         }

         else {
             UserStore.loading = false;
             UserStore.login = false;
         }

    }

    catch(e) {
         UserStore.loading = false;
         UserStore.login = false;
    }
}

async doLogout() {
     try {
       await fetch('https://localhost:5000/api/user/logOut', {
         method: 'GET',
         credentials: 'include',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin':'https://localhost:5000',
         }}).then(response => response.json()).then(data => this.setState({isLoggedin: data.success}));
       UserStore.login = false;
       UserStore.username = '';
     }

     catch(e) {
         console.log(e)
     }
 }

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
      else if(UserStore.register) {
        return (
          <div className="app">
            <div className='container'>
                <RegisterForm />
            </div>
          </div>
        )
      }
      else {
        if (UserStore.login) {
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
