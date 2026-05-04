import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const SecurityLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const rowsPerPage = 5;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getSecurityLogs();
      setLogs(data);
    } catch (err) {
      utils.showToast('Failed to fetch security logs', true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (actionFilter !== 'all') filters.action = actionFilter;
      // Note: Backend might need search query support, currently using client-side or wait for API update
      const data = await adminAPI.getSecurityLogs(filters);
      
      let filtered = data;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = data.filter(l => 
          (l.user_id && l.user_id.toLowerCase().includes(q)) || 
          (l.ip_address && l.ip_address.toLowerCase().includes(q)) || 
          (l.action && l.action.toLowerCase().includes(q))
        );
      }
      
      setLogs(filtered);
      setCurrentPage(0);
      utils.showToast(`🔍 Found ${filtered.length} matching log entries.`, false);
    } catch (err) {
      utils.showToast('Failed to filter logs', true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
  };

  const paginatedLogs = logs.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);
  const totalPages = Math.ceil(logs.length / rowsPerPage);

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#FFFFFF', minHeight: '1285px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E9EDF2', height: 'fit-content' }}>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #F0F4F9' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/database'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Voter Database</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Elections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/candidates'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Candidates</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/guidelines'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Guidelines</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Announcements</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Security Log</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Administrator access with full audit log visibility</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: '0 0 4px 0' }}>SECURITY & AUDIT LOG</h1>
            <p style={{ fontSize: '18px', color: 'black', margin: 0 }}>Monitor all system activities, user actions, and access attempts</p>
          </div>

          {/* Filter Section */}
          <div className="filter-card" style={{ background: '#F8FAFE', borderRadius: '20px', padding: '20px 24px', border: '1px solid #E9EDF2' }}>
            <div className="filter-row" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="filter-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Date Range</label>
                <input type="date" placeholder="Start Date" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', background: 'white', outline: 'none' }} />
              </div>
              <div className="filter-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>&nbsp;</label>
                <input type="date" placeholder="End Date" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', background: 'white', outline: 'none' }} />
              </div>
              <div className="filter-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Action Type</label>
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', background: 'white', outline: 'none' }}>
                  <option value="all">All Actions</option>
                  <option value="System Login">System Login</option>
                  <option value="Verified Voter">Verified Voter</option>
                  <option value="Failed Login Attempt">Failed Login Attempt</option>
                  <option value="Created Election">Created Election</option>
                  <option value="Modified Candidate">Modified Candidate</option>
                </select>
              </div>
              <div className="filter-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Search Identifier</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Admin ID, Voter ID, or IP..." 
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', background: 'white', outline: 'none' }} 
                />
              </div>
              <div className="filter-group" style={{ flex: '1', minWidth: '180px', display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={handleFilter} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '40px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', width: '100%' }}>APPLY FILTERS</button>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="table-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', overflow: 'hidden' }}>
            <div className="table-header" style={{ padding: '16px 24px', borderBottom: '1px solid #F0F4F9', background: '#F8FAFE' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>📋 System Audit Trail</h3>
            </div>
            <table className="audit-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Timestamp</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Admin/User</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Action Performed</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>IP Address</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'black' }}>Loading system audit trail...</td>
                  </tr>
                )}
                {!loading && paginatedLogs.map((log, i) => (
                  <tr key={log.id || i}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}><strong>{log.user_id}</strong> <span style={{ fontSize: '10px', color: '#8AA0B8' }}>({log.user_type})</span></td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>{log.action}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>{log.ip_address}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>
                      <span style={{ 
                        background: log.action.includes('FAILED') || log.action.includes('REJECTED') ? '#FFEBEE' : '#E8F5E9', 
                        color: log.action.includes('FAILED') || log.action.includes('REJECTED') ? '#C62828' : '#2E7D32', 
                        padding: '4px 12px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', display: 'inline-block' 
                      }}>
                        {log.action.includes('FAILED') ? 'FAILED' : 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && logs.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'black' }}>No security logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #F0F4F9' }}>
              <div className="pagination-info" style={{ fontSize: '12px', color: 'black' }}>Showing {logs.length > 0 ? currentPage * rowsPerPage + 1 : 0}-{Math.min((currentPage + 1) * rowsPerPage, logs.length)} of {logs.length} entries</div>
              <div className="pagination-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  onClick={() => setCurrentPage(c => c - 1)} 
                  disabled={currentPage === 0}
                  style={{ background: 'white', border: '1px solid #E2E9F2', padding: '6px 14px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === 0 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i)}
                    style={{ background: currentPage === i ? '#002F6C' : 'white', color: currentPage === i ? 'white' : 'inherit', border: '1px solid', borderColor: currentPage === i ? '#002F6C' : '#E2E9F2', padding: '6px 14px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(c => c + 1)} 
                  disabled={currentPage >= totalPages - 1}
                  style={{ background: 'white', border: '1px solid #E2E9F2', padding: '6px 14px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityLog;
