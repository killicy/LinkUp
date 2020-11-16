import React from 'react';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  useParams,
  withRouter
} from "react-router-dom";


class Confirmation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        message: ''
      }
  }


  async componentDidMount() {
    let token = this.props.match.params.token;
    await fetch('https://localhost:5000/api/user/confirmation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      })}).then(response => response.json()).then(data => this.setState({message: data.msg}));

  }

  render() {
    return(
        <div className="Confirmation">
          {this.state.message}
        </div>
    );
  }
}

export default withRouter(Confirmation);
