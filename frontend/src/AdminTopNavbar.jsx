import React from 'react';
import LogoMark from './LogoMark';

const AdminTopNavbar = ({ badgeText = 'Administrator' }) => {
  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: '#FFFFFF', borderBottom: '1px solid #E9EDF2' }}>
      <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LogoMark />
        <div className="portal-title" style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.2px', color: '#0B2B44', background: '#F0F7FF', padding: '5px 18px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
      </div>
      <div className="admin-badge" style={{ fontSize: '14px', fontWeight: '600', color: '#1F2A44', background: '#F0F7FF', padding: '6px 18px', borderRadius: '40px', border: '1px solid #DCE5F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span aria-hidden="true">{'\uD83D\uDC64'}</span>
        <span>{badgeText}</span>
      </div>
    </div>
  );
};

export default AdminTopNavbar;
