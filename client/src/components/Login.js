import {React, useState} from 'react';
import '../static/css/login.css'
import { Link } from 'react-router-dom';
import BGVideo from './BGVideo'


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              <h2 className="mb-4">Login</h2>
            </div>
            <div className="Form">
              <form onSubmit={handleSubmit}>
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
                <div className="mb-3 row ">
                  <div className="col-sm-10 buttons">
                    <div className="button">
                    <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className='button'>
                      <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
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

export default LoginForm;
