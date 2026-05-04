import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoMark from './LogoMark';

const Navbar = () => {
  return (
    <header className="home-header">
      <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LogoMark size={120} radius={20} />
        <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: '#1A2C3E' }}>BUSA ONLINE VOTING PORTAL</span>
      </div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/overview">Overview</NavLink>
        <NavLink to="/candidates">Candidates</NavLink>
        <NavLink to="/guidelines">Guidelines</NavLink>
        <NavLink to="/announcements">Announcements</NavLink>
        <NavLink to="/tally">Live Tally</NavLink>
        <NavLink to="/login">Voter Panel</NavLink>
        <NavLink to="/admin/login">Admin Panel</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
