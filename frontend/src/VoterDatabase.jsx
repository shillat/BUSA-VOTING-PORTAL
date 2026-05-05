import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const VoterDatabase = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voterStats, setVoterStats] = useState({ total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [votersData, statsData] = await Promise.all([
          adminAPI.getVoters(),
          adminAPI.getVoterStats()
        ]);
        setVoters(votersData);
        setVoterStats(statsData);
      } catch (err) {
        utils.showToast('Failed to fetch voter data', true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.voter_id && v.voter_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pageVoters = filteredVoters.slice(currentPage * 5, (currentPage + 1) * 5);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleExport = () => {
    utils.showToast('📎 Exporting voter database as CSV (demo: file would download)', false);
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F9FAFB', minHeight: '1184px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E9EDF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #F0F4F9', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Dashboard</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE' }}>Voter Database</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Elections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/candidates'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Candidates</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/guidelines'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Guidelines</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Announcements</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Security Log</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Database synchronized with registration portal</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          {/* Database Header */}
          <div className="db-header">
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: '0 0 6px 0' }}>Voter Database</h1>
            <p style={{ fontSize: '18px', color: 'black', margin: 0 }}>List of all verified voters automatically synced from the registration portal.</p>
          </div>

          {/* Stats Row */}
          <div className="stats-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E9EDF2', flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Total Verified</h4>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: '800', color: '#1A2C3E' }}>{voterStats.total || 0}</div>
              </div>
              <div className="sync-badge" style={{ background: '#E8F5E9', color: '#2E7D32', padding: '6px 14px', borderRadius: '40px', fontSize: '12px', fontWeight: '700' }}>✓ VERIFIED</div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E9EDF2', flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="stat-info">
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'black', margin: '0 0 6px 0' }}>Sync Status</h4>
                <div className="stat-number" style={{ fontSize: '28px', fontWeight: '800', color: '#1A2C3E' }}>{loading ? '...' : 'LIVE'}</div>
              </div>
              <div className="sync-badge" style={{ background: '#E8F5E9', color: '#2E7D32', padding: '6px 14px', borderRadius: '40px', fontSize: '12px', fontWeight: '700' }}>🟢 LIVE SYNC ACTIVE</div>
            </div>
            <div className="stat-card" style={{ background: '#FFFFFF', borderRadius: '20px', padding: '18px 24px', border: '1px solid #E9EDF2', flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={handleExport} className="export-btn" style={{ background: '#F0F4F9', border: '1px solid #E2E9F2', padding: '10px 20px', borderRadius: '40px', fontWeight: '600', fontSize: '13px', color: '#1A2C3E', cursor: 'pointer', width: '100%' }}>📎 Export Database (CSV)</button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <input 
              type="text" 
              placeholder="FIND BY NAME OR ID..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              style={{ flex: '1', maxWidth: '320px', padding: '12px 18px', border: '1.5px solid #E2E9F2', borderRadius: '40px', fontSize: '13px', background: '#FFFFFF', outline: 'none' }}
            />
          </div>

          {/* Voter Table */}
          <div className="voter-table-container" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', overflowX: 'auto', minHeight: '200px', position: 'relative' }}>
            {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'black' }}>Loading voters...</div>}
            <table className="voter-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', opacity: loading ? 0.5 : 1 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Photo</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Full Name</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Reg. Number</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Voter ID</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '16px 20px', background: '#F8FAFE', fontWeight: '700', color: 'black', borderBottom: '1px solid #E9EDF2' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageVoters.map((v, i) => (
                  <tr key={v.id || i}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}><span style={{ fontSize: '20px' }}>👤</span></td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}><strong>{v.name}</strong></td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}>{v.reg_no}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}>{v.voter_id || 'N/A'}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}>
                      <span className="status-verified" style={{ 
                        background: v.status === 'Approved' ? '#E8F5E9' : '#FFF3E0', 
                        color: v.status === 'Approved' ? '#2E7D32' : '#EF6C00', 
                        padding: '4px 12px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', display: 'inline-block' 
                      }}>
                        ✓ {v.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', color: '#1A2C3E' }}>
                      <button onClick={() => utils.showToast(`📋 Details: ${v.name}`, false)} style={{ background: '#F0F4F9', border: 'none', padding: '6px 16px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', color: '#1A2C3E', cursor: 'pointer' }}>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '8px 0' }}>
            <div className="pagination-info" style={{ fontSize: '13px', color: 'black' }}>
              Showing {filteredVoters.length > 0 ? currentPage * 5 + 1 : 0}-{Math.min((currentPage + 1) * 5, filteredVoters.length)} of {voters.length} Voters
            </div>
            <div className="pagination-buttons" style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setCurrentPage(c => c - 1)} disabled={currentPage === 0} style={{ background: 'white', border: '1px solid #E2E9F2', padding: '8px 20px', borderRadius: '40px', fontWeight: '600', fontSize: '13px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === 0 ? 0.5 : 1 }}>Prev</button>
              <button onClick={() => setCurrentPage(c => c + 1)} disabled={(currentPage + 1) * 5 >= filteredVoters.length} style={{ background: 'white', border: '1px solid #E2E9F2', padding: '8px 20px', borderRadius: '40px', fontWeight: '600', fontSize: '13px', cursor: (currentPage + 1) * 5 >= filteredVoters.length ? 'not-allowed' : 'pointer', opacity: (currentPage + 1) * 5 >= filteredVoters.length ? 0.5 : 1 }}>Next</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoterDatabase;
