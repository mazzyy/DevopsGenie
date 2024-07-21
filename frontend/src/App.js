// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConfigForm from './components/ConfigForm';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AIPage from './pages/AIPage';
import GitHubCallback from './components/GitHubCallback';
import GitRepo from './components/GitRepo';

function App() {
    return (
      <Router>
            <Navbar />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cicd" element={<ConfigForm />} />
                    <Route path="/ai" element={<AIPage />} />
                    <Route path="/github/callback" element={<GitHubCallback />} />
                    <Route path="/gitrepo" element={<GitRepo />} />
                    {/* <Route path="/github/callback" component={GitHubCallback} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
