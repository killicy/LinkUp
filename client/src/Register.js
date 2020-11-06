import './Register.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
  
    function Register () {
      return (
        <div className= "register">
          <div className= "block">
        <h1>Login</h1>
        <form>
        <div className= "innerContents">
        <label>
          Username:<br />
          <input type="text" name="name" />
        </label><br />
        <label>
          Password:<br />
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Confirm Password:<br />
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Email Address:<br />
          <input type="text" name="name" />
        </label>
        <br />
        </div>
      </form>
      <div className="buttons">
        <Button variant="primary">Create Account</Button>{' '}
        <Button variant="secondary">Login</Button>{' '}
        </div>
      </div>
      </div>
      )
    }

  export default Register;