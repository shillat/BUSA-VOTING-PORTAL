import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, electionAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [activeElections, setActiveElections] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [ratingsStats, setRatingsStats] = useState({ total_ratings: 0, average_rating: 0, positive_ratings: 0, negative_ratings: 0 });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      } catch (err) {
        utils.showToast('Failed to fetch dashboard stats', true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDownloadVotersPDF = async () => {
    try {
      const blob = await adminAPI.downloadVotersPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voters-list-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      utils.showToast('📄 Voters list PDF downloaded successfully', false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      utils.showToast(error.message || 'Failed to download PDF. Please try again.', true);
    }
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F3FAFF', minHeight: '1154px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E2EAF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #EEF3F8' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
            <div className="sidebar-welcome" style={{ fontSize: '13px', color: 'black', marginTop: '6px' }}>Welcome Admin</div>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/database'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Voter Database</a>
            <a href="#" onClick={handleDownloadVotersPDF} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#FF6B35' }}>📄 Download Voters PDF</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Elections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/candidates'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Candidates</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/verify'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>✅ Verify Voters</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/guidelines'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Guidelines</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Announcements</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Security Log</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #EEF3F8' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}>
          {/* Welcome Status Card */}
          <div className="welcome-status" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="welcome-text">
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'white' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0, color: 'white' }}>Administrator access with full privileges</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px', color: 'white' }}>✓ ACTIVE</div>
          </div>

          {/* Stats Row */}
          <div className="stats-row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Total Registered Voters</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#1A2C3E' }}>{stats.total || 0}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Pending Approvals</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#E67E22' }}>{stats.pending || 0}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Active Elections</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#002F6C' }}>{activeElections.length}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Total Ratings</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#FF6B35' }}>{ratingsStats.total_ratings || 0}</div>
              </div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E2EAF2', flex: '1', minWidth: '200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Avg Rating</h4>
                <div className="stat-number" style={{ fontSize: '32px', fontWeight: '800', color: '#4CAF50' }}>{(ratingsStats.average_rating || 0).toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Active Elections + Security Status */}
          <div className="two-col-grid" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Active Elections Table */}
            <div className="col-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EAF2', flex: '1', minWidth: '350px', overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)', color: 'white' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Active Elections</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="view-link" style={{ fontSize: '12px', color: 'white', opacity: 0.9, textDecoration: 'none', fontWeight: '500' }}>View All →</a>
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
                        <td style={{ padding: '14px 24px', borderTop: '1px solid #EEF3F8', fontSize: '13px' }}><span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '40px', fontSize: '10px', fontWeight: '700' }}>{election.status}</span></td>
                        <td style={{ padding: '14px 24px', borderTop: '1px solid #EEF3F8' }}><button onClick={() => navigate('/admin/elections')} style={{ background: '#F0F4F9', border: 'none', padding: '6px 12px', borderRadius: '40px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: '#002F6C' }}>Manage</button></td>
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

            {/* Security Status Card */}
            <div className="col-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EAF2', flex: '1', minWidth: '350px', overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)', color: 'white' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Security Status</h3>
              </div>
              <div className="security-list" style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #EEF3F8' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: 'black' }}>Database Encryption</span>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#2E7D32' }}>🔒 AES-256 ACTIVE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #EEF3F8' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: 'black' }}>Login Security</span>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#002F6C' }}>✓ JWT VERIFIED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #EEF3F8' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: 'black' }}>Voter Audit Log</span>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#E67E22' }}>🟡 SYNCING...</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: 'black' }}>Admin Privileges</span>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#2E7D32' }}>🟢 AUTHORIZED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews Card */}
          <div className="col-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EAF2', flex: '1', overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 100%)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Recent Reviews & Ratings</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/ratings'); }} className="view-link" style={{ fontSize: '12px', color: 'white', opacity: 0.9, textDecoration: 'none', fontWeight: '500' }}>View All →</a>
            </div>
            <div className="reviews-list" style={{ padding: '8px 0' }}>
              {recentReviews.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'black' }}>No recent reviews or ratings.</div>
              ) : (
                recentReviews.map((review, idx) => (
                  <div key={idx} style={{ padding: '14px 24px', borderBottom: idx < recentReviews.length - 1 ? '1px solid #EEF3F8' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A2C3E', marginBottom: '2px' }}>
                          {review.student_name || 'Anonymous'}
                          {review.rating && (
                            <span style={{ marginLeft: '8px', color: '#FFB800', fontSize: '12px' }}>
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                          )}
                        </div>
                        {review.candidate_name && (
                          <div style={{ fontSize: '11px', color: '#8AA0B8', marginBottom: '2px' }}>About: {review.candidate_name}</div>
                        )}
                        {review.review_text && (
                          <div style={{ fontSize: '12px', color: 'black', fontStyle: 'italic' }}>"{review.review_text}"</div>
                        )}
                        {review.feedback && (
                          <div style={{ fontSize: '12px', color: 'black', fontStyle: 'italic' }}>"{review.feedback}"</div>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'black', fontWeight: '600', whiteSpace: 'nowrap' }}>
                        {new Date(review.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="col-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2EAF2', flex: '1', overflow: 'hidden' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'linear-gradient(90deg, #002F6C 0%, #0A4175 100%)', color: 'white' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>Recent Activity</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="view-link" style={{ fontSize: '12px', color: 'white', opacity: 0.9, textDecoration: 'none', fontWeight: '500' }}>View Log →</a>
            </div>
            <div className="activity-list" style={{ padding: '8px 0' }}>
              {recentLogs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'black' }}>No recent activity recorded.</div>
              ) : (
                recentLogs.map((log, idx) => (
                  <div key={idx} style={{ padding: '14px 24px', borderBottom: idx < recentLogs.length - 1 ? '1px solid #EEF3F8' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A2C3E', marginBottom: '2px' }}>{log.action}</div>
                      <div style={{ fontSize: '11px', color: '#8AA0B8' }}>User ID: {log.user_id || 'System'} | IP: {log.ip_address || '---'}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'black', fontWeight: '600' }}>
                      {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
