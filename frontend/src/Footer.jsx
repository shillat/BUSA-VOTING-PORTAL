import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .desktop-layout .footer-col {
            margin-bottom: 12px;
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
            <Link to="/overview">About Union</Link>
            <Link to="/guidelines">Election Guidelines</Link>
            <Link to="/announcements">Announcements</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/guidelines">FAQs</Link>
            <a href="tel:+256780752003">Help Desk</a>
            <a href="tel:+256780752003">Technical Support</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/overview">Privacy Policy</Link>
            <Link to="/guidelines">Terms of Service</Link>
            <Link to="/guidelines">Cookie Policy</Link>
            <Link to="/guidelines">Voting Rules</Link>
          </div>
          <div className="footer-col">
            <h4>Terms of Service</h4>
            <Link to="/guidelines">Voter Agreement</Link>
            <Link to="/guidelines">Code of Conduct</Link>
            <Link to="/guidelines">Election Acts</Link>
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
