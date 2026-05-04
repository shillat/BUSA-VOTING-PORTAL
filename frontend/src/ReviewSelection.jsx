import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI, votingAPI, utils } from './api';
import Footer from './Footer';
import LogoMark from './LogoMark';

const ReviewSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [voter, setVoter] = useState(authAPI.getCurrentUser());

  // Get selections and ballotData from navigation state
  const selections = location.state?.selections || {};
  const ballotData = location.state?.ballotData || [];

  const [confirmations, setConfirmations] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
  };

  const handleConfirm = (id, title) => {
    setConfirmations(prev => ({ ...prev, [id]: true }));
    utils.showToast(`✓ Selection for ${title} confirmed.`, false);
  };

  const handleBack = (id, title) => {
    setConfirmations(prev => ({ ...prev, [id]: false }));
    utils.showToast(`← Selection for ${title} unlocked.`, false);
  };

  const handleSubmit = async () => {
    // Check if any selections have been made
    if (Object.keys(selections).length === 0 || Object.values(selections).length === 0) {
      utils.showToast('⚠️ You must vote for at least one position before submitting.', true);
      return;
    }

    const allConfirmed = ballotData.every(e => confirmations[e.id]);

    if (!allConfirmed) {
      const missing = ballotData.filter(e => !confirmations[e.id]).map(e => e.title);
      utils.showToast(`⚠️ Please confirm your selections for: ${missing.join(', ')} before submitting.`, true);
      return;
    }

    try {
      setLoading(true);

      // Submit each vote
      const votePromises = Object.keys(selections).map(electionId => {
        return votingAPI.castVote(electionId, selections[electionId].id);
      });

      await Promise.all(votePromises);

      utils.showToast('🗳️ Your ballot has been officially cast! Thank you.', false);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/rating');
      }, 1500);
    } catch (err) {
      utils.showToast(err.message || 'Failed to cast vote. You may have already voted.', true);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (election) => {
    const candidate = selections[election.id] || { id: 'placeholder', name: 'No Candidate Selected' };
    const isConfirmed = confirmations[election.id];

    return (
      <div key={election.id} className="selection-card" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E9EDF2', overflow: 'hidden' }}>
        <div className="selection-header" style={{ background: '#F8FAFE', padding: '18px 24px', borderBottom: '1px solid #E9EDF2' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', margin: 0 }}>{election.title}</h3>
        </div>
        <div className="selection-body" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div className="candidate-info" style={{ flex: '2' }}>
            <div className="candidate-name" style={{ fontSize: '20px', fontWeight: '800', color: '#1A2C3E', marginBottom: '6px' }}>{candidate.name}</div>
            <div className="candidate-school" style={{ fontSize: '13px', color: 'black', display: 'flex', alignItems: 'center', gap: '8px' }}>🏛️ {candidate.faculty || candidate.school || 'Academic Excellence'}</div>
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => {
                if (submitted || loading) return;
                if (!confirmations[election.id]) navigate('/voter/ballot');
                else handleBack(election.id, election.title);
              }}
              disabled={submitted || loading}
              style={{ background: '#F0F4F9', border: '1px solid #E2E9F2', padding: '10px 24px', borderRadius: '40px', fontWeight: '600', fontSize: '13px', color: 'black', cursor: (submitted || loading) ? 'not-allowed' : 'pointer' }}
            >
              {isConfirmed ? 'Edit' : 'Back'}
            </button>
            <button
              onClick={() => handleConfirm(election.id, election.title)}
              disabled={submitted || isConfirmed || candidate.id === 'placeholder' || loading}
              style={{ background: isConfirmed ? '#2E7D32' : '#002F6C', border: 'none', padding: '10px 28px', borderRadius: '40px', fontWeight: '700', fontSize: '13px', color: 'white', cursor: (submitted || isConfirmed || candidate.id === 'placeholder' || loading) ? 'not-allowed' : 'pointer' }}
            >
              {isConfirmed ? 'Confirmed ✓' : 'Confirm Selection'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', display: 'flex', flexDirection: 'column', margin: '0 auto', background: '#F9FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px 20px 48px', borderBottom: '1px solid #E9EDF2', background: '#FFFFFF' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LogoMark />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.2px', color: '#0B2B44', background: '#F8FAFE', padding: '5px 18px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <div className="user-greeting" style={{ fontSize: '15px', fontWeight: '600', color: '#1F2A44', background: '#FFFFFF', padding: '6px 18px', borderRadius: '40px', border: '1px solid #E9EDF2' }}>{voter?.name || 'Student'}</div>
      </div>

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '48px', padding: '32px 48px 40px 48px', flex: '1' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '28px', padding: '24px 0', border: '1px solid #E9EDF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #F0F4F9', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/ballot'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Cast Vote</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#F0F7FF', borderLeft: '3px solid #002F6C' }}>Review and Confirm</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/rating'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Rating</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '24px', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 6px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '14px', opacity: '0.85', margin: 0 }}>Your account is ready for voting</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '8px 20px', borderRadius: '40px', fontWeight: '700', fontSize: '14px' }}>✓ VERIFIED</div>
          </div>

          {/* Review Header */}
          <div className="review-header">
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: '0 0 8px 0' }}>Review Your Selections</h1>
            <p style={{ fontSize: '18px', color: 'black', lineHeight: '1.5', margin: 0 }}>Please carefully review your chosen candidates for each position. Your vote is final once confirmed. You may edit any selection before the final submission.</p>
          </div>

          {/* Selections List */}
          <div className="selections-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {ballotData.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'black' }}>No selections to review.</div>
            ) : (
              ballotData.map((election) => renderCard(election))
            )}
          </div>

          {/* Submit Section */}
          <div className="submit-section" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E9EDF2', padding: '28px 32px', textAlign: 'center', marginTop: '8px' }}>
            <div className="submit-note" style={{ fontSize: '18px', color: 'black', marginBottom: '20px', lineHeight: '1.5' }}>
              Your voting process is almost complete. Press the button to officially cast your ballot.
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitted || loading}
              style={{ background: submitted ? '#2E7D32' : '#002F6C', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: (submitted || loading) ? 'not-allowed' : 'pointer' }}
            >
              {submitted ? 'Vote Cast ✓' : loading ? 'Submitting...' : 'Submit →'}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Footer */}
      {false && <div className="footer" style={{ background: '#FFFFFF', borderTop: '1px solid #E9EDF2', padding: '28px 48px 24px', width: '100%' }}>
        <div className="footer-grid" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'black', marginBottom: '12px' }}>BUSA</h4>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>About Union</a>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>Election Guidelines</a>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>Contact Us</a>
          </div>
          <div className="footer-col">
            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'black', marginBottom: '12px' }}>HELP & CENTER</h4>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>FAQ</a>
            <a href="#" style={{ display: 'block', fontSize: '11px', color: '#48708E', textDecoration: 'none', marginBottom: '8px' }}>Live Chat</a>
          </div>
        </div>
        <div className="copyright" style={{ textAlign: 'center', fontSize: '10px', color: '#7C95AF', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E9F0F6' }}>
          © 2026 BUSA ONLINE VOTING PORTAL. ALL RIGHTS RESERVED
        </div>
      </div>}
    </div>
  );
};

export default ReviewSelection;
