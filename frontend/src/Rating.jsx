import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, utils } from './api';
import LogoMark from './LogoMark';
import Footer from './Footer';

const Rating = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(authAPI.getCurrentUser());
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
  };

  const handleDownloadReceipt = () => {
    utils.showToast('📄 Your voting receipt is being downloaded (demo: receipt would contain transaction ID and timestamp)', false);
  };

  const handleSubmitFeedback = () => {
    if (selectedRating === 0 && !feedback.trim()) {
      utils.showToast('⚠️ Please provide a rating or feedback before submitting.', true);
      return;
    }
    setSubmitted(true);
    utils.showToast('✅ Thank you for your feedback! Your comments have been recorded.', false);
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F3FAFF', minHeight: '100vh', margin: '0 auto', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px 20px', borderBottom: '1px solid #DCE5F0', background: '#FFFFFF' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LogoMark size={40} />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '-0.2px', color: '#0B2B44', background: '#F0F7FF', padding: '4px 14px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1F2A44', background: '#FFFFFF', padding: '4px 14px', borderRadius: '40px', border: '1px solid #DCE5F0' }}>{voter?.name || 'Student'}</div>
      </div>

      <div className="dashboard-layout" style={{ display: 'flex', gap: '20px', padding: '20px', flex: '1', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '200px', flexShrink: '0', background: '#FFFFFF', borderRadius: '20px', padding: '16px 0', border: '1px solid #E2EBF3', height: 'fit-content', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
          <div className="sidebar-header" style={{ padding: '0 16px 12px 16px', borderBottom: '1px solid #EFF3F8', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/ballot'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Cast Vote</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/review-selection'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Review</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/rating'); }} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE' }}>Rating</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px 10px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#C62828', marginTop: '20px', borderTop: '1px solid #EFF3F8' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '18px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '12px', opacity: '0.85', margin: 0 }}>Your vote has been recorded</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '12px' }}>✓ VERIFIED</div>
          </div>

          <div className="thankyou-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EBF3', padding: '24px 20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗳️✓</div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', marginBottom: '10px' }}>Thank You for Voting!</h1>
            <p style={{ fontSize: '14px', color: 'black', marginBottom: '20px', lineHeight: '1.5' }}>Your vote has been securely cast and recorded. You can now download your digital voting receipt below.</p>
            <button onClick={handleDownloadReceipt} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '48px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>📄 Download Voting Receipt</button>
          </div>

          <div className="rating-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EBF3', padding: '20px 24px' }}>
            <div className="rating-header">
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: '0 0 6px 0' }}>Rate Your Experience</h3>
              <p style={{ fontSize: '14px', color: 'black', marginBottom: '20px' }}>How would you rate the online voting process?</p>
            </div>
            <div className="stars-container" style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span 
                  key={s} 
                  onClick={() => !submitted && setSelectedRating(s)}
                  style={{ fontSize: '28px', cursor: submitted ? 'default' : 'pointer', color: s <= selectedRating ? '#FFB800' : '#D1D9E6', transition: 'color 0.2s', opacity: submitted ? 0.6 : 1 }}
                >
                  ★
                </span>
              ))}
            </div>
            <label style={{ fontWeight: '600', fontSize: '12px', color: '#1A2C3E', marginBottom: '10px', display: 'block' }}>Additional Feedback</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={submitted}
              rows="3"
              placeholder="Let us know how we can improve..."
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2EBF3', borderRadius: '16px', fontSize: '13px', resize: 'vertical', marginBottom: '16px', outline: 'none' }}
            ></textarea>
            <button 
              onClick={handleSubmitFeedback} 
              disabled={submitted}
              style={{ background: submitted ? '#2E7D32' : '#002F6C', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '48px', fontWeight: '700', fontSize: '12px', cursor: submitted ? 'default' : 'pointer' }}
            >
              {submitted ? 'Feedback Submitted ✓' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Footer */}
      {false && <div className="footer" style={{ background: '#FFFFFF', borderTop: '1px solid #DCE5F0', padding: '28px 48px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'black', marginBottom: '12px' }}>BUSA</h4>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>About Union</a>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>Election Guidelines</a>
          </div>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'black', marginBottom: '12px' }}>Legal</h4>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>PRIVACY POLICY</a>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>TERMS OF SERVICE</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#7C95AF', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E9F0F6' }}>
          © 2026 BUSA ONLINE VOTING PORTAL. ALL RIGHTS RESERVED
        </div>
      </div>}
    </div>
  );
};

export default Rating;
