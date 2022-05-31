import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom';
import { useCookies } from 'react-cookie';
import '../assets/css/login.css';
import database from '../database/database';

interface errorMessage {
  name: string;
  message: string;
}

function App() {
  const [errorMessages, setErrorMessages] = useState<errorMessage>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cookies, setCookie] = useCookies(['username', 'password']);

  function setcookie(username: string, password: string) {
    var date = new Date();
    date.setTime(date.getTime() + 1000 * 1000);

    setCookie('username', username, { path: '/', expires: date });
    setCookie('password', password, { path: '/', expires: date });
  }

  const errors = {
    uname: 'invalid username',
    pass: 'invalid password',
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: 'pass', message: errors.pass });
      } else {
        setcookie(userData.username, userData.password);
        window.location.href = '/home';
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: 'uname', message: errors.uname });
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name: string) =>
    name === errorMessages?.name && <div className="error">{errorMessages?.message}</div>;

  // JSX code for login form
  const renderForm = (
    <div className="login-form">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label className="input-upper-text">Username </label>
            <input type="text" name="uname" className="input-bar" required />
            {renderErrorMessage('uname')}
          </div>
          <div className="input-container">
            <label className="input-upper-text">Password </label>
            <input type="password" name="pass" className="input-bar" required />
            {renderErrorMessage('pass')}
          </div>
          <div className="button-container">
            <input type="submit" value="LOGIN" />
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app">
      {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
    </div>
  );
}

export default App;
