import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import SubmitButton from './SubmitButton';
import EventMaker from './EventMaker';  
import { Card } from "react-bootstrap";

class UserEvents extends React.Component {

    render() {
        return (
            <div className="UserEvents">
                blah blah
            </div>
        );
    }

}

export default UserEvents;