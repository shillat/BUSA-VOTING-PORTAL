import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-links">
      <div className="footer-grid">
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
      <div className="copyright">
        © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
