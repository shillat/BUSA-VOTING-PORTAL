import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, electionAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  color: 'black'
};

const activeNavLinkStyle = {
  ...navLinkStyle,
  color: '#002F6C',
  background: '#E8F0FE',
  borderLeft: '3px solid #002F6C'
};

const cardStyle = {
  background: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E2EAF2',
  overflow: 'hidden'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [activeElections, setActiveElections] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [ratingsStats, setRatingsStats] = useState({ total_ratings: 0, average_rating: 0 });
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, electionsData, logsData, ratingsData, reviewsData] = await Promise.all([
          adminAPI.getVoterStats(),
          electionAPI.getActive(),
          adminAPI.getSecurityLogs({ limit: 5 }),
          adminAPI.getRatingsStats(),
          adminAPI.getRecentReviews()
        ]);

        setStats(statsData);
        setActiveElections(electionsData);
        setRecentLogs(logsData);
        setRatingsStats(ratingsData);
        setRecentReviews(reviewsData);
      } catch {
        utils.showToast('Failed to fetch dashboard stats', true);
      }
    };

    fetchData();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F3FAFF', minHeight: '100vh', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
        <aside className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E2EAF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #EEF3F8' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
            <div className="sidebar-welcome" style={{ fontSize: '13px', color: 'black', marginTop: '6px' }}>Welcome Admin</div>
          </div>

          <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link active" style={activeNavLinkStyle}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/students'); }} className="sidebar-link" style={navLinkStyle}>Manage Voters</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={navLinkStyle}>Manage Elections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/candidates'); }} className="sidebar-link" style={navLinkStyle}>Manage Candidates</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/guidelines'); }} className="sidebar-link" style={navLinkStyle}>Manage Guidelines</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={navLinkStyle}>Manage Announcements</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/reviews'); }} className="sidebar-link" style={navLinkStyle}>Reviews</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="sidebar-link" style={navLinkStyle}>Security Log</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ ...navLinkStyle, color: '#C62828', marginTop: '28px', borderTop: '1px solid #EEF3F8', paddingTop: '16px' }}>Logout</a>
          </nav>
        </aside>

        <main className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}>
          <section className="welcome-status" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'white' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0, color: 'white' }}>Administrator access with full privileges</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px', color: 'white' }}>ACTIVE</div>
          </section>

          <section className="stats-row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              ['Total Registered Voters', stats.total || 0, '#1A2C3E'],
              ['Pending Approvals', stats.pending || 0, '#E67E22'],
              ['Active Elections', activeElections.length, '#002F6C'],
              ['Total Ratings', ratingsStats.total_ratings || 0, '#FF6B35'],
              ['Avg Rating', (ratingsStats.average_rating || 0).toFixed(1), '#4CAF50']
            ].map(([label, value, color]) => (
              <div key={label} className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>{label}</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color }}>{value}</div>
              </div>
            ))}
          </section>

          <section className="two-col-grid" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ ...cardStyle, flex: '1', minWidth: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)', color: 'white' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Active Elections</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} style={{ fontSize: '12px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>View All</a>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '11px', fontWeight: '600', color: 'black', background: '#FAFCFE', textTransform: 'uppercase' }}>Title</th>
                      <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '11px', fontWeight: '600', color: 'black', background: '#FAFCFE', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '11px', fontWeight: '600', color: 'black', background: '#FAFCFE', textTransform: 'uppercase' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeElections.map((election) => (
                      <tr key={election.id}>
                        <td style={{ padding: '14px 24px', borderTop: '1px solid #EEF3F8', fontSize: '13px', color: '#1A2C3E', fontWeight: '600' }}>{election.title}</td>
                        <td style={{ padding: '14px 24px', borderTop: '1px solid #EEF3F8', fontSize: '13px' }}>
                          <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '40px', fontSize: '10px', fontWeight: '700' }}>{election.status}</span>
                        </td>
                        <td style={{ padding: '14px 24px', borderTop: '1px solid #EEF3F8' }}>
                          <button onClick={() => navigate('/admin/elections')} style={{ background: '#F0F4F9', border: 'none', padding: '6px 12px', borderRadius: '40px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: '#002F6C' }}>Manage</button>
                        </td>
                      </tr>
                    ))}
                    {activeElections.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'black' }}>No active elections found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ ...cardStyle, flex: '1', minWidth: '350px' }}>
              <div style={{ padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Security Status</h3>
              </div>
              {[
                ['Database Encryption', 'AES-256 ACTIVE', '#2E7D32'],
                ['Login Security', 'JWT VERIFIED', '#002F6C'],
                ['Voter Audit Log', 'SYNCING', '#E67E22'],
                ['Admin Privileges', 'AUTHORIZED', '#2E7D32']
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #EEF3F8' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: 'black' }}>{label}</span>
                  <span style={{ fontWeight: '700', fontSize: '12px', color }}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Recent Reviews & Ratings</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/reviews'); }} style={{ fontSize: '12px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>View Reviews</a>
            </div>
            {recentReviews.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'black' }}>No recent reviews or ratings.</div>
            ) : (
              recentReviews.map((review, index) => (
                <div key={`${review.type}-${review.id}-${index}`} style={{ padding: '14px 24px', borderBottom: index < recentReviews.length - 1 ? '1px solid #EEF3F8' : 'none' }}>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A2C3E' }}>{review.student_name || 'Anonymous'}</div>
                  {review.feedback && <div style={{ fontSize: '12px', color: 'black', marginTop: '4px' }}>"{review.feedback}"</div>}
                </div>
              ))
            )}
          </section>

          <section style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Recent Activity</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} style={{ fontSize: '12px', color: 'white', textDecoration: 'none', fontWeight: '500' }}>View Log</a>
            </div>
            {recentLogs.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'black' }}>No recent activity recorded.</div>
            ) : (
              recentLogs.map((log, index) => (
                <div key={`${log.action}-${index}`} style={{ padding: '14px 24px', borderBottom: index < recentLogs.length - 1 ? '1px solid #EEF3F8' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A2C3E' }}>{log.action}</div>
                    <div style={{ fontSize: '11px', color: '#8AA0B8' }}>User ID: {log.user_id || 'System'} | IP: {log.ip_address || '---'}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'black', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
