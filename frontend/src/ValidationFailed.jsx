import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';

const ValidationFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "Your identity could not be verified in the student database.";

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 48px 20px 48px', borderBottom: '1px solid #EFF3F8' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LogoMark size={48} radius={14} />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '-0.3px', color: '#0B2B44', background: '#F8FAFE', padding: '6px 20px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <button className="back-link" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: '500', color: '#2A6F8F', borderBottom: '1px dashed #B9D4E3', paddingBottom: '2px', cursor: 'pointer' }}>← Back to Home</button>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ padding: '60px 80px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Error Badge */}
        <div className="error-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#FFEBEE', padding: '10px 28px', borderRadius: '60px', marginBottom: '32px' }}>
          <span className="error-icon" style={{ fontSize: '24px' }}>⚠️</span>
          <span className="error-text" style={{ fontWeight: '700', fontSize: '18px', color: '#C62828' }}>Verification Error</span>
        </div>

        {/* Main Title */}
        <div className="main-title" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#C62828', marginBottom: '16px' }}>Validation Failed</h1>
          <p style={{ fontSize: '18px', color: 'black', maxWidth: '550px', lineHeight: '1.5', margin: '0 auto' }}>{errorMessage}</p>
        </div>

        {/* Error Card */}
        <div className="error-card" style={{ background: '#FFFFFF', border: '2px solid #FFCDD2', borderRadius: '32px', boxShadow: '0 20px 35px -12px rgba(198, 40, 40, 0.12)', width: '680px', maxWidth: '100%', marginBottom: '40px', overflow: 'hidden' }}>
          {/* Card Header */}
          <div className="card-header" style={{ background: '#C62828', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="access-denied-icon" style={{ fontSize: '28px' }}>🚫</span>
              <span className="access-denied-text" style={{ color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Access Denied</span>
            </div>
            <div className="card-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', color: 'white', textTransform: 'uppercase' }}>Verification Failed</div>
          </div>

          {/* Card Body */}
          <div className="card-body" style={{ padding: '40px 40px 32px' }}>
            {/* Error Message */}
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div className="error-message-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#C62828', marginBottom: '16px' }}>Identity Not Found or Not Eligible</h3>
              <p style={{ fontSize: '18px', color: 'black', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>We could not verify your identity or eligibility in the student database. Please visit the Registrar's Office at your campus to ensure your registration is up to date.</p>
            </div>

            {/* Warning Box */}
            <div className="warning-box" style={{ background: '#FFF8E1', borderLeft: '4px solid #FF9800', padding: '20px 24px', borderRadius: '16px', margin: '28px 0' }}>
              <p style={{ fontSize: '14px', color: '#5D4037', lineHeight: '1.6', marginBottom: '12px' }}><strong>📋 What you need to do:</strong></p>
              <p style={{ fontSize: '14px', color: '#5D4037', lineHeight: '1.6', marginBottom: '12px' }}>• Visit the Registrar's Office with your Student ID<br />• Confirm your registration details are correct<br />• Request database synchronization for online voting</p>
              <div className="small-note" style={{ fontSize: '12px', color: '#8D6E63', fontFamily: 'monospace' }}>Processing time: 1-2 business days after verification</div>
            </div>

            <div className="divider" style={{ height: '1px', background: '#EEF3F8', margin: '28px 0 24px' }}></div>

            {/* Action Buttons */}
            <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '16px' }}>
              <button className="btn-primary" onClick={() => navigate('/register')} style={{ background: '#C62828', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>Try Again</button>
              <button className="btn-secondary" onClick={() => navigate('/')} style={{ background: 'transparent', color: '#1A2C3E', border: '2px solid #DCE3EC', padding: '12px 28px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>Return to Home</button>
            </div>

            {/* Help Link */}
            <div className="help-link" style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href="#" style={{ color: '#2A6F8F', textDecoration: 'none', fontSize: '14px', fontWeight: '500', borderBottom: '1px solid #B9D4E3' }}>Need immediate assistance? Contact Support →</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer-links">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>BUSA</h4>
            <a href="#">About Union</a>
            <a href="#">Election Guidelines</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <h4>Help & Support</h4>
            <a href="#">FAQs</a>
            <a href="#">Live Chat</a>
            <a href="#">Support Ticket</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-col">
            <h4>Quick</h4>
            <a href="#">FAQ</a>
            <a href="#">Voter Guide</a>
            <a href="#">Announcements</a>
          </div>
        </div>
        <div className="copyright">
          © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ValidationFailed;
