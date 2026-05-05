import React from 'react';
import busaLogo from './assets/busaLogo.jpg';

const LogoMark = ({ size = 80, radius = 12, background = '#FFFFFF' }) => {
  return (
    <img
      src={busaLogo}
      alt="BUSA logo"
      className="logo-icon"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        objectFit: 'contain',
        background,
        borderRadius: `${radius}px`,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
      }}
    />
  );
};

export default LogoMark;
