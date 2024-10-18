import React from 'react'
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Header from '../components/Header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home'; 
import Admin from '../pages/Admin/Admin'; 
import User from '../pages/User/User';
import AuthProvider from '../context/AuthProvider';
import AirQualityDashboard from '../components/dashboard-component';
import Footer from '../components/Footer/Footer';


const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
      <div>
      <Header/> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/user" element={<AirQualityDashboard/>} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>

      {/* <Footer/>   */}
      </div>
      </AuthProvider>
    </Router>
  )
}

export default AppRouter
