import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const baseLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  color: 'black'
};

const activeLinkStyle = {
  ...baseLinkStyle,
  color: '#002F6C',
  background: '#E8F0FE',
  borderLeft: '3px solid #002F6C'
};

const links = [
  ['Dashboard', '/admin/dashboard'],
  ['Manage Voters', '/admin/students'],
  ['Manage Elections', '/admin/elections'],
  ['Manage Candidates', '/admin/candidates'],
  ['Manage Guidelines', '/admin/guidelines'],
  ['Manage Announcements', '/admin/announcements'],
  ['Reviews', '/admin/reviews'],
  ['Security Log', '/admin/security']
];

const AdminSidebar = ({ title = 'Dashboard' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  return (
    <aside className="sidebar" style={{ width: '260px', flexShrink: 0, background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E2EAF2', height: 'fit-content' }}>
      <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #EEF3F8' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>{title}</h2>
        <div className="sidebar-welcome" style={{ fontSize: '13px', color: 'black', marginTop: '6px' }}>Welcome Admin</div>
      </div>

      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
        {links.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            style={({ isActive }) => (isActive ? activeLinkStyle : baseLinkStyle)}
          >
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-link logout-link"
          style={{ ...baseLinkStyle, width: '100%', border: 0, background: 'transparent', cursor: 'pointer', color: '#C62828', marginTop: '28px', borderTop: '1px solid #EEF3F8', paddingTop: '16px', fontFamily: 'inherit' }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
