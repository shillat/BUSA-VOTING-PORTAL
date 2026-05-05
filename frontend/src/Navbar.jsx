import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoMark from './LogoMark';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="home-header">
      <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LogoMark size={120} radius={20} />
        <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: '#1A2C3E' }}>BUSA ONLINE VOTING PORTAL</span>
      </div>
      
      {/* Mobile Hamburger Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMenu}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#1A2C3E'
        }}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Navigation Links */}
      <nav className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
        <NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/overview" onClick={() => setIsMenuOpen(false)}>Overview</NavLink>
        <NavLink to="/candidates" onClick={() => setIsMenuOpen(false)}>Candidates</NavLink>
        <NavLink to="/guidelines" onClick={() => setIsMenuOpen(false)}>Guidelines</NavLink>
        <NavLink to="/announcements" onClick={() => setIsMenuOpen(false)}>Announcements</NavLink>
        <NavLink to="/tally" onClick={() => setIsMenuOpen(false)}>Live Tally</NavLink>
        <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>Voter Panel</NavLink>
        <NavLink to="/admin/login" onClick={() => setIsMenuOpen(false)}>Admin Panel</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
