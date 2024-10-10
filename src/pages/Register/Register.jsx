import React, { useState } from 'react';
import axios from 'axios'; 
import { toastSuccessNotify, toastErrorNotify } from '../../helper/ToastNotify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; 
import './Register.css'; 

const Register = () => {
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toastErrorNotify('All fields are required'); 
    } else if (password !== confirmPassword) {
      toastErrorNotify('Passwords do not match.'); 
    } else {
      toastSuccessNotify('You have successfully registered!'); 

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container-register py-5 px-7 mt-28">
        <h2 className="uppercase" style={{ letterSpacing: "1px" }}>Register</h2>
        <form onSubmit={handleRegister}>
          {/* First Name Field */}
          <div className="form-section">
            <input
              className="outline-none"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          {/* Last Name Field */}
          <div className="form-section">
            <input
              className="outline-none"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <input
              className="outline-none"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <input
              className="outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <input
              className="outline-none"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="register-btn" type="submit">Register</button>
        </form>
        <p className="login-btn2 text-center text-[10px] text-gray-400 ">
          Already have an account? <a href="login" className="ms-1 text-[13px]" style={{ letterSpacing: "1px" }} >Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
