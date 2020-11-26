import React, { Component } from 'react';
class Void extends Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          success: false,
          username: '',
          isLoggedin: false
      }
  }

  render() {
    return(
      <div>
        This Page Doesn't Exist
      </div>
    );
  }
}

export default Void;
