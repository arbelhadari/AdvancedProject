import {React, useState} from 'react';
import '../static/css/login.css'
import { Link } from 'react-router-dom';
import BGVideo from './BGVideo'
import '../static/css/login.css'


const SignUpForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="video-container">
      <BGVideo/>
      <div className='login-container'>
          <container className="container login-form">
            <div className="Header">
              <h2 className="mb-4">Sign Up</h2>
            </div>
            <div className="Form">
              <form onSubmit={handleSubmit}>
              <div className="mb-3 row">
                  <label htmlFor="userName" className="col-sm-2 col-form-label">user Name</label>
                  <div className="col-sm-10">
                    <input
                      type="userName"
                      className="form-control"
                      id="userName"
                      placeholder="Enter your user Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="email" className="col-sm-2 col-form-label">Email address</label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="passwordValidate" className="col-sm-2 col-form-label">Password Validate</label>
                  <div className="col-sm-10">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="confirm your password"
                      value={passwordValidate}
                      onChange={(e) => setPasswordValidate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row buttons">
                  <div className="col-sm-10 ">
                    <div className="button">
                    <button type="submit" className="btn btn-primary">SignUp</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </container>
        </div>
      </div>
  );
};

export default SignUpForm;