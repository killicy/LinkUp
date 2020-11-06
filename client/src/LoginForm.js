import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';

class LoginForm extends React.Component {

    componentDidMount() {
        let res = fetch('https://localhost:5000/api/user/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: 'jjj@gmail.com',
            Password: ''
          })
        }).then(response => response.json()).then(data => this.setState({ username: data.Username, message: data.msg}));
      }
  
      
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            message: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();

        // Username and Password is 12 characters max
        if (val.length > 12) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {
        
        // No username exists
        if(!this.state.username) {
            return;
        }
        if(!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })
        
    }
    render() {
        return(
            <div className="loginForm">
               Login Form {this.state.message}
            </div>   
        );
    }
}

export default LoginForm;