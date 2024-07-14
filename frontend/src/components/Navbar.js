import React from 'react';
import './Navbar.css';

const Navbar = () => {
  const handleLogin = () => {
      window.location.href = 'http://localhost:8000/login';
    };


  return (
    <div className="navbar">
      <div className="logo">
        {/* <img src="path/to/logo.png" alt="Logo" /> */}
      </div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="cicd">CI/CD Automation</a>
        <a href="ai">CI/CD through AI</a>
        <a href="#docker-automation">Docker Automation</a>
        <a href="#devops-options">Other DevOps Options</a>
        <a className='Float:right' href="/login" >login</a>
        {/* <a className='Float:right' href="#devops-options" onClick={handleLogin}>login</a> */}
      </nav>
    </div>
  );
};

export default Navbar;
