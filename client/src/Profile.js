import React from 'react';
//import ReactDOM from 'react-dom'
import './App.css';
import { Card } from "react-bootstrap";
import { Image, Transformation } from "cloudinary-react";


class Profile extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          message: '',
          isLoggedin: false,
          event: [{title: 'Movie Night', description: 'Friday the 13th part 13: The Final Friday'}, {title: 'BBQ', description: 'Ribs, Burgers, Obesity'}],
          id: 'a',
      }
  }
  render() {
    return (
      <div className="Profile border ">
        <div className="space"></div>
        <Card className="profileStuff mb-4 border-0">
          <Image cloudName= "dsnnlkpj9" publicId={this.props.data.Profile_pic} className = "profilePic">
            <Transformation width="400" height="400" gravity="face" radius="max" crop="crop" />
            <Transformation width="200" crop="scale" />
          </Image>
          <Card.Body>
            <Card.Title><div className="name">{this.props.data.user.Username}</div></Card.Title>
            <Card.Text className="profileBody"><p className="profiler">About Me: I spend my free time posing for stock images. I enjoy events where I can eat food such as salads and yogurt while laughing with my head thrown back. I am spiritually a robot.</p></Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Profile;
