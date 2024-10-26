import React from 'react';
// import './Home.css';
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="homepage">
      <header className="hero-section">
        <h1>DevOps Automation with AI :).  </h1>
        <p>Streamline your CI/CD pipelines and Could servies with advanced AI-driven automation.</p>
        <button className="cta-button">Get Started</button>
      </header>
      <section className="features-section">
        <h2>Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Intelligent Automation</h3>
            <p>Leverage AI to optimize and automate your DevOps processes.</p>
          </div>
          <div className="feature">
            <h3>Continuous Integration</h3>
            <p>Seamlessly integrate code changes with automated testing and deployment.</p>
          </div>
          <div className="feature">
            <h3>Scalable Infrastructure</h3>
            <p>Scale your infrastructure effortlessly with AI-driven insights and automation.</p>
          </div>
        </div>
      </section>
      <section className="about-section">
        <h2>About Us</h2>
        <p>We are committed to transforming the DevOps landscape with cutting-edge AI technology.</p>
      </section>
      <footer className="footer">
        <p>&copy; 2024 DevOps Automation with AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
