import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginFc({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(sessionStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  // Assuming this code is part of your login component
const handleSubmit = (event) => {
  event.preventDefault();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (trimmedEmail === 'admin@gmail.com' && trimmedPassword === '207252909') {
    const adminUser = { email: 'admin@gmail.com', password: '207252909' };
    // Set authenticated and admin status in sessionStorage
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('admin', 'true');
    onLogin(adminUser);
    alert('Login successful!');
    navigate('/Admin');
  } else {
    const foundUser = users.find((user) => user.email.trim().toLowerCase() === trimmedEmail.toLowerCase() && user.password === trimmedPassword);

    if (foundUser) {
      onLogin(foundUser);
      alert('Login successful!');
      sessionStorage.setItem('authenticated', 'true');
      navigate('/');
    } else {
      // If credentials do not match, show an error message
      alert('Invalid email or password');
    }
  }
  setEmail('');
  setPassword('');
};

  
  return (
    <div className='fullPageBackground'>
      <div className='BodyLogin' style={{ marginRight: '28em' }}>
        <div className="container">
          <div className="d-flex justify-content-center h-100" style={{ marginTop: '15em' }}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '24px' }}>Sign In</h3>
                <div className="d-flex justify-content-end social_icon">
                  <span><i className="fab fa-facebook-square"></i></span>
                  <span><i className="fab fa-google-plus-square"></i></span>
                  <span><i className="fab fa-twitter-square"></i></span>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="input-group form-group">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: 'calc(100% - 80px)', padding: '10px' }}
                      placeholder="Email"
                      value={email}
                      onChange={handleChangeEmail}
                    />
                  </div>
                  <div className="input-group form-group">
                    <input
                      type="password"
                      className="form-control"
                      style={{ width: 'calc(100% - 80px)', padding: '10px' }}
                      placeholder="Password"
                      value={password}
                      onChange={handleChangePassword}
                    />
                  </div>
                  <div className="form-group form-group2">
                    <input
                      type="submit"
                      value="Login"
                      className="btn float-right login_btn"
                      style={{ fontSize: '22px' }}
                    />
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-center links DontAccout" style={{ fontSize: '20px', color: '' }}>
                Do not have an account? <Link to="/Register" style={{ color: '#5bb9cf' }}>Register</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
