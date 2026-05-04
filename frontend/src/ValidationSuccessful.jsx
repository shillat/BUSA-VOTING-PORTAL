import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';

const ValidationSuccessful = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [voterData, setVoterData] = useState({
    voterId: 'V-XXXX-XXXX',
    name: 'Verified Student',
    regNo: 'N/A',
    campus: 'Main Campus'
  });

  useEffect(() => {
    if (location.state) {
      setVoterData(prev => ({
        ...prev,
        ...location.state,
        voterId: location.state.voterId || 'V-XXXX-XXXX'
      }));
    }
  }, [location]);

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
      <div className="main-content" style={{ padding: '48px 80px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success Badge */}
        <div className="success-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#E8F5E9', padding: '10px 28px', borderRadius: '60px', marginBottom: '32px' }}>
          <span className="success-icon" style={{ fontSize: '24px' }}>✓</span>
          <span className="success-text" style={{ fontWeight: '700', fontSize: '18px', color: '#2E7D32' }}>Validation Successful</span>
        </div>

        {/* Main Title */}
        <div className="main-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'black', marginBottom: '12px' }}>{voterData.name}</h1>
          <p style={{ fontSize: '18px', color: 'black' }}>Your identity has been verified. You are now ready to participate in the upcoming elections.</p>
        </div>

        {/* Credential Card */}
        <div className="credential-card" style={{ background: '#FFFFFF', border: '2px solid #E8EDF4', borderRadius: '32px', boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.08)', width: '780px', maxWidth: '100%', marginBottom: '40px', overflow: 'hidden' }}>
          {/* Card Header */}
          <div className="card-header" style={{ background: 'linear-gradient(135deg, #002F6C 0%, #0A4175 100%)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LogoMark size={48} radius={12} />
              <div className="card-logo-text" style={{ color: 'white', fontWeight: '700', fontSize: '20px', letterSpacing: '1px' }}>BUSA</div>
            </div>
            <div className="card-badge" style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', color: 'white', textTransform: 'uppercase' }}>Official Credential</div>
          </div>

          {/* Card Body */}
          <div className="card-body" style={{ padding: '36px 40px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {/* Left Column - Voter Information */}
            <div className="info-column" style={{ flex: '1.2' }}>
              <div className="credential-title" style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'black', marginBottom: '24px' }}>Authenticated Voter</div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Voter ID</div>
                <div className="info-value token-value" style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: '800', color: '#002F6C', letterSpacing: '1px' }}>{voterData.voterId}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Registration Number</div>
                <div className="info-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{voterData.regNo}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Campus</div>
                <div className="info-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{voterData.campus}</div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Status</div>
                <div className="status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#E8F5E9', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '14px', color: '#2E7D32' }}>
                  <span className="status-dot" style={{ width: '8px', height: '8px', background: '#2E7D32', borderRadius: '50%' }}></span>
                  ACTIVE
                </div>
              </div>

              <div className="info-row" style={{ marginBottom: '28px' }}>
                <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', marginBottom: '6px' }}>Verified Date</div>
                <div className="info-value date-value" style={{ fontSize: '18px', fontWeight: '600', color: '#1A2C3E' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="qrcode-column" style={{ flex: '0.8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F9FBFE', borderRadius: '24px', padding: '24px', border: '1px solid #EDF2F7' }}>
              <div className="qrcode-box" style={{ width: '160px', height: '160px', background: '#FFFFFF', border: '2px solid #E0E8F0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
                <div className="qr-pattern" style={{ width: '130px', height: '130px', background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 6px), repeating-linear-gradient(0deg, #000 0px, #000 2px, #fff 2px, #fff 6px)', backgroundBlendMode: 'multiply', position: 'relative' }}></div>
              </div>
              <div className="qr-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'black', textAlign: 'center' }}>Secure Verification QR</div>
            </div>
          </div>

          <div className="divider" style={{ height: '1px', background: '#EEF3F8', margin: '0 40px 24px 40px' }}></div>

          {/* Card Footer */}
          <div className="card-footer" style={{ padding: '0 40px 36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="security-note" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#D32F2F', background: '#FFEBEE', padding: '10px 18px', borderRadius: '40px' }}>
              <span className="security-icon">🔒</span>
              <span>Keep your Voter ID secure and do not share it.</span>
            </div>
            <div className="action-buttons" style={{ display: 'flex', gap: '20px' }}>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>Proceed to Login</button>
              <button className="btn-secondary" onClick={() => window.print()} style={{ background: 'transparent', color: '#1A2C3E', border: '2px solid #DCE3EC', padding: '12px 28px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>PRINT Voter ID</button>
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

export default ValidationSuccessful;
