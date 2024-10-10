import React, { useState } from 'react';
import { toastSuccessNotify, toastErrorNotify } from '../../helper/ToastNotify'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAuthContext } from "../../context/AuthProvider";
import 'react-toastify/dist/ReactToastify.css'; 
import './Login.css'; 

const Login = () => {
  const { setUsername } = useUser(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { googleProvider,facebookProvider } = useAuthContext();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toastErrorNotify('Email and password cannot be empty.');
      return;
    }

    const username = email.split('@')[0]; 
    toastSuccessNotify('Login successful!'); 
    localStorage.setItem('username', username); 
    setUsername(username); 
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };


  const handleGoogleLogin = async () => {
    const username = await googleProvider();
    setUsername(username);
  };
  
  const handleFacebookLogin = async () => {
    const username = await facebookProvider();
    setUsername(username);
  };
  


  return (
    <div className="login-container h-[100vh]" >
      <div className="form-container mt-20">
        <h2 className="uppercase" style={{letterSpacing:"1px"}}>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button className="login-btn" type="submit">Login</button>
        </form>
        <p style={{letterSpacing:"1px"}} className="text-center text-[10px] py-2">Or login with:</p>
        <div className="social-login">
        <button className="social-button facebook flex justify-center items-center p-3 text-[0.9rem] hover:opacity-[0.8]" onClick={handleFacebookLogin}>
  <i className="fab fa-facebook-f"></i> Facebook
</button>
<button className="social-button google flex justify-center items-center p-3 text-[0.9rem] hover:opacity-[0.8]" onClick={handleGoogleLogin}>
  <i className="fab fa-google"></i> Google
</button>

        </div>
        <a href="/register" className="register-btn text-center text-[10px] text-gray-400">
          Don't have an account? <span className="ms-1 text-[13px]" style={{letterSpacing:"1px"}} >Register</span>
        </a>
        <p className="forgot-btn text-center text-[10px] text-gray-400">
          Forgot your password?  <span className="ms-1 text-[13px]" style={{letterSpacing:"1px"}}>Reset Password</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
