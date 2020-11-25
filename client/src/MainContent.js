import React from 'react';
import { observer } from 'mobx-react';
//import ReactDOM from 'react-dom'
import './App.css';
import UserStore from './stores/UserStore';
import Cookies from 'universal-cookie';
import SubmitButton from './SubmitButton';
import EventMaker from './EventMaker';
import { Card } from "react-bootstrap";

class MainContent extends React.Component {

    render() {
        return(
          <div className= "mainContent">
              <div className="grid">{this.props.data.friendEvents.map((event, index) => {
                return (
                    <Card style={{ width: "18rem" }} key={index} className="box border border-dark mb-1">
                    <Card.Body>
                        <Card.Title>{event.title}</Card.Title>
                        <Card.Text>-{event.description}</Card.Text>
                    </Card.Body>
                    </Card>
                );
                })}
              </div>
          </div>
        );
      }
}

export default MainContent;