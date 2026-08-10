import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 9v11M9 20h6" strokeLinecap="round" />
              <path d="M10 9a2 2 0 0 1 4 0v11H10z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 2c-.5 1-1.5 1.5-1.5 2.5s.67 1.5 1.5 1.5 1.5-.5 1.5-1.5S12.5 3 12 2z" fill="orange" stroke="none" />
            </svg>
            <span className="logo-text">The Candle Tales</span>
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link active">System Status</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="nav-link">Documentation</a>
          </nav>
        </div>
      </header>
      
      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} The Candle Tales. Project Scaffolding & Architecture (Phase 1).</p>
          <p className="footer-sub">Built with React, Vite, Spring Boot, and MySQL</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
