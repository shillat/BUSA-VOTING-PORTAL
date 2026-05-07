import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, electionAPI, candidateAPI, utils } from './api';
import Footer from './Footer';
import LogoMark from './LogoMark';

const DigitalBallot = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(authAPI.getCurrentUser());
  const [ballotData, setBallotData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track selections per election ID: electionId -> candidate object
  const [selections, setSelections] = useState({});

  useEffect(() => {
    fetchBallotData();
  }, []);

  const fetchBallotData = async () => {
    try {
      setLoading(true);
      const elections = await electionAPI.getActive();
      
      // For each active election, fetch its candidates
      const ballotPromises = elections.map(async (election) => {
        const candidates = await candidateAPI.getByElection(election.id);
        return { ...election, candidates };
      });
      
      const data = await Promise.all(ballotPromises);
      setBallotData(data);
    } catch (err) {
      utils.showToast('Failed to fetch ballot data', true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
  };

  const handleSelect = (electionId, candidate) => {
    setSelections({ ...selections, [electionId]: candidate });
    utils.showToast(`✓ Selected: ${candidate.name}`, false);
  };

  const handleProceed = () => {
    const missing = ballotData.filter(e => !selections[e.id]);

    if (missing.length > 0) {
      utils.showToast(`⚠️ Please select candidates for: ${missing.map(e => e.title).join(', ')} before proceeding.`, true);
      return;
    }

    utils.showToast('📋 Your selections have been locked. Redirecting to final confirmation page...', false);
    setTimeout(() => {
      navigate('/review-selection', { state: { selections, ballotData } });
    }, 1000);
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', display: 'flex', flexDirection: 'column', margin: '0 auto', background: '#F9FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 12px 20px', borderBottom: '1px solid #E9EDF2', background: '#FFFFFF' }}>
        <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LogoMark size={40} />
          <div className="portal-title" style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '-0.2px', color: '#0B2B44', background: '#F8FAFE', padding: '4px 14px', borderRadius: '40px' }}>BUSA ONLINE VOTING PORTAL</div>
        </div>
        <div className="user-greeting" style={{ fontSize: '13px', fontWeight: '600', color: '#1F2A44', background: '#FFFFFF', padding: '4px 14px', borderRadius: '40px', border: '1px solid #E9EDF2' }}>{voter?.name || 'Student'}</div>
      </div>

      {/* Dashboard Layout: Sidebar + Main Ballot */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '20px', padding: '20px', flex: '1', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <div className="sidebar" style={{ width: '200px', flexShrink: '0', background: '#FFFFFF', borderRadius: '20px', padding: '16px 0', border: '1px solid #E9EDF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 16px 12px 16px', borderBottom: '1px solid #F0F4F9', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Profile</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#002F6C', background: '#F0F7FF', borderLeft: '3px solid #002F6C' }}>Cast Vote</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/review-selection'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Review</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/rating'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Rating</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px 10px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#C62828', marginTop: '20px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* Main Ballot Content */}
        <div className="main-ballot" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Verified Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '18px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '12px', opacity: '0.85', margin: 0 }}>Your account is ready for voting</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '12px' }}>✓ VERIFIED</div>
          </div>

          {/* Digital Ballot Header */}
          <div className="ballot-header">
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'black', margin: '0 0 6px 0' }}>DIGITAL BALLOT</h1>
            <p style={{ fontSize: '14px', color: 'black', lineHeight: '1.5', margin: 0 }}>Please select your preferred candidates for the following positions.</p>
          </div>

          {/* Candidates Selection Area */}
          <div className="candidates-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading && <div style={{ padding: '32px', textAlign: 'center', color: 'black' }}>Loading your ballot...</div>}
            
            {!loading && ballotData.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: 'black', background: '#F8FAFE', borderRadius: '18px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗳️</div>
                <h3 style={{ margin: '0 0 6px 0', color: 'black' }}>No Active Elections</h3>
                <p style={{ margin: 0, fontSize: '12px' }}>There are currently no elections open for voting. Please check back later.</p>
              </div>
            )}

            {!loading && ballotData.map((election) => (
              <div key={election.id} className="position-block" style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #EDF2F7', overflow: 'hidden' }}>
                <div className="position-title" style={{ background: '#F8FAFE', padding: '14px 20px', borderBottom: '1px solid #EDF2F7', fontSize: '16px', fontWeight: '800', color: '#1A2C3E' }}>{election.title.toUpperCase()}</div>
                <div className="candidates-row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {election.candidates.length === 0 && (
                    <div style={{ padding: '24px', color: 'black', width: '100%', textAlign: 'center' }}>No candidates registered for this position.</div>
                  )}
                  {election.candidates.map((candidate) => (
                    <div key={candidate.id} className="candidate-card" style={{ flex: '1', minWidth: '250px', padding: '20px 16px', borderRight: '1px solid #F0F4F9', borderBottom: '1px solid #F0F4F9', textAlign: 'center' }}>
                      {candidate.photo_url ? (
                        <img 
                          src={`https://busa-voting-portal.onrender.com${candidate.photo_url}`} 
                          alt={candidate.name} 
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F0F4F9', marginBottom: '12px' }} 
                        />
                      ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0F4F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 12px' }}>👤</div>
                      )}
                      <div className="candidate-name" style={{ fontSize: '16px', fontWeight: '800', color: '#1A2C3E', marginBottom: '4px' }}>{candidate.name}</div>
                      <div className="candidate-slogan" style={{ fontSize: '11px', color: 'black', fontStyle: 'italic', marginBottom: '20px', minHeight: '32px' }}>{candidate.slogan || 'No slogan provided'}</div>
                      <button 
                        onClick={() => handleSelect(election.id, candidate)}
                        style={{ 
                          background: selections[election.id]?.id === candidate.id ? '#002F6C' : '#F0F4F9', 
                          color: selections[election.id]?.id === candidate.id ? 'white' : '#1A2C3E', 
                          border: '1.5px solid', 
                          borderColor: selections[election.id]?.id === candidate.id ? '#002F6C' : '#E2E9F2', 
                          padding: '8px 16px', 
                          borderRadius: '40px', 
                          fontWeight: '700', 
                          fontSize: '11px', 
                          cursor: 'pointer', 
                          width: '100%', 
                          maxWidth: '140px', 
                          margin: '0 auto',
                          transition: '0.2s'
                        }}
                      >
                        {selections[election.id]?.id === candidate.id ? 'Selected ✓' : 'Select Candidate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Proceed to Review Section */}
          <div className="proceed-section" style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #EDF2F7', padding: '20px 24px', textAlign: 'center' }}>
            <div className="proceed-note" style={{ fontSize: '14px', color: 'black', marginBottom: '16px', lineHeight: '1.5' }}>
              By clicking "Proceed to Review", your selections will be locked for final confirmation.
            </div>
            <button onClick={handleProceed} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '48px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Proceed to Review →</button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Footer */}
      {false && <div className="footer" style={{ background: '#FFFFFF', borderTop: '1px solid #ECF3F9', padding: '28px 0 24px', width: '100%' }}>
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

export default DigitalBallot;
