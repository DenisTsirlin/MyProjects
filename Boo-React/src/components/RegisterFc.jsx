import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterFc({ onRegister }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    iAgree: false,
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert('The passwords do not match');
      return;
    }

    const existingUsers = JSON.parse(sessionStorage.getItem('users')) || [];
    const emailExists = existingUsers.some(user => user.email === form.email);
    if (emailExists) {
      alert('The email address already exists');
      return;
    }

    const newUser = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    };
    console.log('New user to be added:', newUser);
    const updatedUsers = [...existingUsers, newUser];
    sessionStorage.setItem('users', JSON.stringify(updatedUsers));
    onRegister(newUser);
    alert('The user has successfully registered!');
    
    setForm({
      email: '',
      password: '',
      confirmPassword: '',
      iAgree: false,
    });

    navigate('/Login');
  };

  return (
    <div>
      <section className="p-3 p-md-4 p-xl-5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 bsb-tpl-bg-platinum d-flex align-items-center justify-content-center" style={{ backgroundColor: 'red' }}>
              <div className="d-flex flex-column justify-content-between p-3 p-md-4 p-xl-5" style={{ marginBottom: '28em' }}>
                <h3 id='boo' className="m-0" style={{ fontSize: '44px' }}>BOO</h3>
              </div>
            </div>
            <div className="col-12 col-md-6 bsb-tpl-bg-lotion">
              <div className="p-3 p-md-4 p-xl-5" style={{ backgroundColor: '#aaafb3' }}>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h2 className="h3">Register</h2>
                      <h3 className="fs-6 fw-normal text-secondary m-0">Enter the details</h3>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden" >
                   
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                       Email address<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="name@example.com"
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password<span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          name="iAgree"
                          id="iAgree"
                          required
                          checked={form.iAgree}
                          onChange={() => setForm({ ...form, iAgree: !form.iAgree })}
                        />
                        <label className="form-check-label text-secondary" htmlFor="iAgree">
                       I Agree {' '}
                          <a href="#!" className="link-primary text-decoration-none">
                          to the terms of use
                          </a>
                        </label>
                        
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button style={{ backgroundColor: 'rgba(13, 110, 253, .25)' }} className="btn bsb-btn-xl btn-primary" type="submit">
                          הרשמה
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
