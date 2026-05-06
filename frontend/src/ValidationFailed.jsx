import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';

const ValidationFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "Your identity could not be verified in the student database.";

  return (
    <>
      <style>{`
        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .main-content {
            padding: 50px 60px 70px !important;
          }
          
          .error-card {
            width: 90% !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Header */
          .top-header {
            padding: 20px 24px !important;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .logo-area {
            justify-content: center;
          }
          
          .portal-title {
            font-size: 16px !important;
            padding: 6px 16px !important;
          }
          
          .back-link {
            align-self: center;
            font-size: 14px !important;
          }
          
          /* Main Content */
          .main-content {
            padding: 40px 24px 50px !important;
            min-height: auto;
          }
          
          /* Error Badge */
          .error-badge {
            padding: 10px 24px !important;
            margin-bottom: 28px !important;
            border-radius: 50px !important;
          }
          
          .error-icon {
            font-size: 20px !important;
          }
          
          .error-text {
            font-size: 16px !important;
          }
          
          /* Title */
          h1 {
            font-size: 36px !important;
            margin-bottom: 16px !important;
            line-height: 1.2 !important;
          }
          
          .main-title p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            padding: 0 20px;
            margin-bottom: 40px !important;
          }
          
          /* Error Card */
          .error-card {
            width: 100% !important;
            max-width: 500px !important;
            border-radius: 24px !important;
            margin: 0 auto 40px !important;
            box-shadow: 0 10px 25px -8px rgba(198, 40, 40, 0.15) !important;
          }
          
          .card-header {
            padding: 20px 24px !important;
            flex-direction: column;
            gap: 16px;
            text-align: center;
            border-radius: 24px 24px 0 0 !important;
          }
          
          .card-header-left {
            justify-content: center;
          }
          
          .access-denied-icon {
            font-size: 24px !important;
          }
          
          .access-denied-text {
            font-size: 18px !important;
          }
          
          .card-badge {
            font-size: 11px !important;
            padding: 6px 16px !important;
            align-self: center;
          }
          
          /* Card Body */
          .card-body {
            padding: 32px 24px 28px !important;
          }
          
          .error-message {
            margin-bottom: 32px !important;
            text-align: center;
          }
          
          .error-message-icon {
            font-size: 56px !important;
            margin-bottom: 20px !important;
          }
          
          .error-message h3 {
            font-size: 20px !important;
            margin-bottom: 16px !important;
            padding: 0 16px;
          }
          
          .error-message p {
            font-size: 16px !important;
            line-height: 1.6 !important;
            padding: 0 20px;
            margin: 0 auto !important;
          }
          
          /* Warning Box */
          .warning-box {
            padding: 20px 24px !important;
            margin: 24px 0 !important;
            border-radius: 16px !important;
          }
          
          .warning-box p {
            font-size: 13px !important;
            line-height: 1.6 !important;
            margin-bottom: 12px !important;
          }
          
          .small-note {
            font-size: 11px !important;
            margin-top: 12px !important;
          }
          
          /* Divider */
          .divider {
            margin: 24px 0 20px !important;
          }
          
          /* Action Buttons */
          .action-buttons {
            flex-direction: column !important;
            gap: 16px !important;
            width: 100%;
            margin-top: 20px !important;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
            padding: 14px 28px !important;
            font-size: 15px !important;
            text-align: center;
            border-radius: 50px !important;
          }
          
          /* Help Link */
          .help-link {
            margin-top: 24px !important;
            text-align: center;
          }
          
          .help-link a {
            font-size: 13px !important;
            padding: 8px 16px;
          }
          
          /* Footer */
          .footer-links {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          /* Header */
          .top-header {
            padding: 16px 20px !important;
            gap: 12px;
          }
          
          .portal-title {
            font-size: 14px !important;
            padding: 4px 12px !important;
          }
          
          .back-link {
            font-size: 13px !important;
          }
          
          /* Main Content */
          .main-content {
            padding: 32px 20px 40px !important;
          }
          
          /* Error Badge */
          .error-badge {
            padding: 8px 20px !important;
            margin-bottom: 20px !important;
          }
          
          .error-icon {
            font-size: 18px !important;
          }
          
          .error-text {
            font-size: 14px !important;
          }
          
          /* Title */
          h1 {
            font-size: 30px !important;
            margin-bottom: 12px !important;
          }
          
          .main-title p {
            font-size: 14px !important;
            padding: 0 12px;
            margin-bottom: 32px !important;
          }
          
          /* Error Card */
          .error-card {
            border-radius: 20px !important;
            margin-bottom: 32px !important;
          }
          
          .card-header {
            padding: 16px 20px !important;
            gap: 12px;
            border-radius: 20px 20px 0 0 !important;
          }
          
          .access-denied-icon {
            font-size: 20px !important;
          }
          
          .access-denied-text {
            font-size: 16px !important;
          }
          
          .card-badge {
            font-size: 10px !important;
            padding: 4px 12px !important;
          }
          
          /* Card Body */
          .card-body {
            padding: 28px 20px 24px !important;
          }
          
          .error-message {
            margin-bottom: 24px !important;
          }
          
          .error-message-icon {
            font-size: 48px !important;
            margin-bottom: 16px !important;
          }
          
          .error-message h3 {
            font-size: 18px !important;
            margin-bottom: 12px !important;
            padding: 0 12px;
          }
          
          .error-message p {
            font-size: 14px !important;
            padding: 0 16px;
          }
          
          /* Warning Box */
          .warning-box {
            padding: 16px 20px !important;
            margin: 20px 0 !important;
            border-radius: 12px !important;
          }
          
          .warning-box p {
            font-size: 12px !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
          }
          
          .small-note {
            font-size: 10px !important;
            margin-top: 10px !important;
          }
          
          /* Divider */
          .divider {
            margin: 20px 0 16px !important;
          }
          
          /* Action Buttons */
          .action-buttons {
            gap: 12px !important;
            margin-top: 16px !important;
          }
          
          .btn-primary,
          .btn-secondary {
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
          
          /* Help Link */
          .help-link {
            margin-top: 20px !important;
          }
          
          .help-link a {
            font-size: 12px !important;
            padding: 6px 12px;
          }
        }
        
        @media (max-width: 360px) {
          .top-header {
            padding: 12px 16px !important;
          }
          
          .portal-title {
            font-size: 12px !important;
            padding: 3px 10px !important;
          }
          
          .main-content {
            padding: 24px 16px 32px !important;
          }
          
          h1 {
            font-size: 26px !important;
          }
          
          .card-body {
            padding: 24px 16px 20px !important;
          }
          
          .error-message-icon {
            font-size: 40px !important;
          }
          
          .error-message h3 {
            font-size: 16px !important;
          }
          
          .warning-box {
            padding: 14px 16px !important;
          }
          
          .btn-primary,
          .btn-secondary {
            padding: 10px 20px !important;
            font-size: 13px !important;
          }
          
          .help-link a {
            font-size: 11px !important;
          }
        }
      `}</style>
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
    </>
  );
};

export default ValidationFailed;
