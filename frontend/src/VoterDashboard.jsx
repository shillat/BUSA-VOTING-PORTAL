import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, electionAPI, voterAPI, utils } from './api';
import Footer from './Footer';
import LogoMark from './LogoMark';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(authAPI.getCurrentUser());
  const [activeElections, setActiveElections] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [elections, logs] = await Promise.all([
          electionAPI.getActive(),
          voterAPI.getSecurityLogs()
        ]);
        setActiveElections(elections);
        setSecurityLogs(logs);
      } catch (err) {
        utils.showToast('Failed to fetch dashboard data', true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
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

      {/* Dashboard area: SIDEBAR + MAIN */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '20px', padding: '20px', flex: '1', maxWidth: '100%', overflow: 'hidden' }}>
        {/* LEFT SIDEBAR */}
        <div className="sidebar" style={{ width: '200px', flexShrink: '0', background: '#FFFFFF', borderRadius: '20px', padding: '16px 0', border: '1px solid #E9EDF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 16px 12px 16px', borderBottom: '1px solid #F0F4F9', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/dashboard'); }} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#002F6C', background: '#F0F7FF' }}>Profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/ballot'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Cast Vote</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/review-selection'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Review</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/rating'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: 'black' }}>Rating</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px 10px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#C62828', marginTop: '20px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Welcome Card */}
          <div className="welcome-card" style={{ background: 'linear-gradient(105deg, #0B2F5C 0%, #16456E 100%)', borderRadius: '18px', padding: '20px 24px', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '500', letterSpacing: '0.5px', opacity: '0.8', margin: '0 0 6px 0', color: '#FFFFFF' }}>Welcome back,</h3>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0', color: '#FFFFFF' }}>{voter?.name || 'Student'}</h1>
            <div className="status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.12)', padding: '4px 12px', borderRadius: '40px', fontSize: '11px', fontWeight: '500', color: '#FFFFFF' }}>
              <span className="dot" style={{ width: '6px', height: '6px', background: '#2DCC70', borderRadius: '50%' }}></span>
              <span>Active Elections</span>
            </div>
          </div>

          {/* STATUS + CAMPUS + CATEGORY row */}
          <div className="info-strip" style={{ display: 'flex', gap: '20px', background: 'white', borderRadius: '16px', padding: '16px 20px', border: '1px solid #E9EDF2', flexWrap: 'wrap' }}>
            <div className="info-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7A8B9F' }}>STATUS</div>
              <div className="info-value"><span className="verify-badge" style={{ background: '#E9F7EF', color: '#1E7B48', padding: '4px 12px', borderRadius: '40px', fontSize: '12px', fontWeight: '600' }}>✓ Verified</span></div>
            </div>
            <div className="info-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7A8B9F' }}>CAMPUS</div>
              <div className="info-value" style={{ fontSize: '16px', fontWeight: '700', color: '#1F2A44', textTransform: 'capitalize' }}>{voter?.campus || 'Main Campus'}</div>
            </div>
            <div className="info-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="info-label" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7A8B9F' }}>CATEGORY</div>
              <div className="info-value" style={{ fontSize: '16px', fontWeight: '700', color: '#1F2A44' }}>{voter?.student_type === 'Regular' ? 'Regular Student' : 'In-Service Student'}</div>
            </div>
          </div>

          {/* Active Elections + Security Log */}
          <div className="two-col-grid" style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
            {/* Active Elections Card */}
            <div className="card" style={{ background: 'white', borderRadius: '18px', border: '1px solid #E9EDF2', flex: '1', overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'linear-gradient(90deg, #0B2F5C 0%, #16456E 100%)', color: '#FFFFFF' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Active Elections</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/voter/ballot'); }} className="view-link" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: '500' }}>Vote Now →</a>
              </div>
              <div className="card-content" style={{ padding: '6px 0', minHeight: '100px', position: 'relative' }}>
                {loading && <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'black' }}>Loading active sessions...</div>}
                {!loading && activeElections.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'black' }}>No active elections at the moment.</div>
                ) : (
                  !loading && activeElections.map((election) => (
                    <div key={election.id} className="election-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #F0F4FA' }}>
                      <div>
                        <div className="election-title" style={{ fontWeight: '700', fontSize: '13px', color: '#1F2A44', marginBottom: '3px' }}>{election.title}</div>
                        <div className="election-deadline" style={{ fontSize: '11px', color: '#2DCC70', fontWeight: '500' }}>Active Now</div>
                      </div>
                      <div className="time-badge" style={{ background: '#E8F5E9', padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: '600', color: '#2E7D32' }}>VOTE</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Security Log Card */}
            <div className="card" style={{ background: 'white', borderRadius: '18px', border: '1px solid #E9EDF2', flex: '1', overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'linear-gradient(90deg, #0B2F5C 0%, #16456E 100%)', color: '#FFFFFF' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Security Log</h3>
              </div>
              <div className="card-content" style={{ padding: '6px 0', maxHeight: '250px', overflowY: 'auto' }}>
                {!loading && securityLogs.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'black' }}>No recent activity logged.</div>
                ) : (
                  securityLogs.map((log, idx) => (
                    <div key={idx} className="log-row" style={{ padding: '12px 20px', borderBottom: idx < securityLogs.length - 1 ? '1px solid #F0F4FA' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="log-title" style={{ fontWeight: '600', fontSize: '12px', color: '#1F2A44', marginBottom: '3px' }}>{log.action}</div>
                        <div className="log-meta" style={{ fontSize: '10px', color: '#7E8C9E' }}>IP: {log.ip_address || '---'}</div>
                      </div>
                      <div className="log-time" style={{ fontSize: '9px', color: '#7E8C9E' }}>{new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VoterDashboard;
