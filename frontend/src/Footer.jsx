import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (to, e) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <footer className="footer-links">
      <style>{`
        .footer-links {
          background: #FCFDFF;
          border-top: 1px solid #ECF3F9;
          padding: 32px 48px 28px;
          width: 100%;
        }
        
        .footer-rows {
          display: flex;
          flex-direction: column;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .footer-row {
          display: flex;
          gap: 48px;
          justify-content: space-between;
        }
        
        .footer-col {
          flex: 1;
          min-width: 0;
        }
        
        .footer-col h4 {
          font-weight: 700;
          font-size: 14px;
          color: black;
          margin-bottom: 14px;
        }
        
        .footer-col a {
          display: block;
          font-size: 12px;
          color: #48708E;
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.3s ease;
        }
        
        .footer-col a:hover {
          color: #002F6C;
        }
        
        .copyright {
          text-align: center;
          font-size: 11px;
          color: #7C95AF;
          margin-top: 28px;
          padding-top: 16px;
          border-top: 1px solid #E9F0F6;
        }
        
        @media (max-width: 768px) {
          .footer-links {
            padding: 24px 20px 20px;
          }
          
          .footer-rows {
            gap: 20px;
          }
          
          .desktop-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 20px;
          }
          
          .desktop-layout .footer-col {
            text-align: left;
          }
          
          .footer-col h4 {
            font-size: 12px;
            margin-bottom: 10px;
          }
          
          .footer-col a {
            font-size: 10px;
            margin-bottom: 6px;
          }
          
          .copyright {
            margin-top: 16px;
            padding-top: 10px;
            font-size: 9px;
          }
        }
      `}</style>
      
      <div className="footer-rows">
        {/* Desktop Layout: 2x2 Grid */}
        <div className="footer-row desktop-layout">
          <div className="footer-col">
            <h4>BUSA</h4>
            <Link to="/overview" onClick={(e) => handleLinkClick('/overview', e)}>About Union</Link>
            <Link to="/guidelines" onClick={(e) => handleLinkClick('/guidelines', e)}>Election Guidelines</Link>
            <Link to="/announcements" onClick={(e) => handleLinkClick('/announcements', e)}>Announcements</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/guidelines" onClick={(e) => handleLinkClick('/guidelines', e)}>FAQs</Link>
            <a href="tel:+256780752003">Help Desk</a>
            <a href="tel:+256780752003">Technical Support</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/guidelines" onClick={(e) => handleLinkClick('/guidelines', e)}>Terms of Service</Link>
            <Link to="/guidelines" onClick={(e) => handleLinkClick('/guidelines', e)}>Voting Rules</Link>
            <Link to="/overview" onClick={(e) => handleLinkClick('/overview', e)}>Election Overview</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/candidates" onClick={(e) => handleLinkClick('/candidates', e)}>All Candidates</Link>
            <Link to="/calendar" onClick={(e) => handleLinkClick('/calendar', e)}>Election Calendar</Link>
            <Link to="/tally" onClick={(e) => handleLinkClick('/tally', e)}>Live Results</Link>
          </div>
        </div>
      </div>
      
      {/* Copyright - Full Width */}
      <div className="copyright">
        © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
