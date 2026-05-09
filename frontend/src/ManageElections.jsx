import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { electionAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';
import AdminSidebar from './AdminSidebar';

const ManageElections = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const data = await electionAPI.getAll();
      setElections(data);
    } catch {
      utils.showToast('Failed to fetch elections', true);
    } finally {
      setLoading(false);
    }
  };

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateElection = async () => {
    if (!newTitle.trim()) {
      utils.showToast('⚠️ Please enter an election title', true);
      return;
    }
    if (!newDate) {
      utils.showToast('⚠️ Please select an election date', true);
      return;
    }
    
    try {
      setLoading(true);
      // Backend expects start_date and end_date. For simplicity using the same for both or adding 24h
      const startDate = new Date(newDate).toISOString();
      const endDate = new Date(new Date(newDate).getTime() + 24 * 60 * 60 * 1000).toISOString();
      
      await electionAPI.create({
        title: newTitle,
        description: newDesc,
        start_date: startDate,
        end_date: endDate
      });
      
      setNewTitle('');
      setNewDate('');
      setNewDesc('');
      utils.showToast(`✅ New election "${newTitle}" created successfully`, false);
      fetchElections();
    } catch (err) {
      utils.showToast(err.message || 'Failed to create election', true);
    } finally {
      setLoading(false);
    }
  };

  const handleElectionAction = async (id, action) => {
    try {
      if (action === 'start') {
        await electionAPI.updateStatus(id, 'active');
        utils.showToast('Election started successfully', false);
        fetchElections();
      } else if (action === 'end') {
        await electionAPI.updateStatus(id, 'completed');
        utils.showToast('Election ended successfully', false);
        fetchElections();
      } else if (action === 'view') {
        utils.showToast('Viewing results (demo)', false);
      } else if (action === 'manage') {
        utils.showToast('Managing candidates (demo)', false);
      }
    } catch {
      utils.showToast('Failed to perform action', true);
    }
  };

  const handleDeleteElection = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove all its candidates and votes.`)) return;
    try {
      await electionAPI.delete(id);
      utils.showToast(`🗑️ Election "${title}" deleted.`, false);
      fetchElections();
    } catch (err) {
      utils.showToast(err.message || 'Failed to delete election', true);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#FFFFFF', minHeight: '1365px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
        <AdminSidebar />

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Administrator access with full election management privileges</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          {/* Create New Election Form */}
          <div className="form-card" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E9EDF2', padding: '24px 28px' }}>
            <div className="form-header" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Create New Election</h2>
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Election Post/Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Presidential Election 2027" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Election Date (April 2027)</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Election Description</label>
              <textarea 
                placeholder="Provide detailed information about this election post..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px' }}
              ></textarea>
            </div>
            <button onClick={handleCreateElection} className="create-btn" style={{ background: '#002F6C', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '40px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>+ Create Election</button>
          </div>

          {/* Election Control Center */}
          <div className="elections-card" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E9EDF2', overflow: 'hidden' }}>
            <div className="card-header" style={{ padding: '18px 24px', borderBottom: '1px solid #F0F4F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFE' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', margin: 0 }}>Election Control Center</h3>
              <div className="total-badge" style={{ background: '#E8F0FE', padding: '4px 12px', borderRadius: '40px', fontSize: '13px', fontWeight: '600', color: '#002F6C' }}>{elections.length} Total Elections</div>
            </div>
            <table className="elections-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Election Title</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Control</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'black' }}>Loading elections...</td>
                  </tr>
                )}
                {!loading && elections.map((election) => (
                  <tr key={election.id}>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', verticalAlign: 'top' }}>
                      <div className="election-title" style={{ fontWeight: '700', color: '#1A2C3E' }}>{election.title}</div>
                      <div className="election-desc" style={{ fontSize: '11px', color: '#8AA0B8', marginTop: '4px', lineHeight: '1.4' }}>{election.description}</div>
                    </td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', verticalAlign: 'top' }}>{formatDate(election.start_date)}</td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', verticalAlign: 'top' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '40px', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        display: 'inline-block',
                        background: election.status === 'active' ? '#E8F5E9' : election.status === 'upcoming' || election.status === 'pending' ? '#FFF3E0' : '#EEF2F6',
                        color: election.status === 'active' ? '#2E7D32' : election.status === 'upcoming' || election.status === 'pending' ? '#E67E22' : '#6F8FAC'
                      }}>
                        {election.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', verticalAlign: 'top' }}>
                      {election.status === 'active' ? (
                        <button onClick={() => handleElectionAction(election.id, 'end')} style={{ background: '#FFEBEE', color: '#C62828', border: 'none', padding: '6px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>End Election</button>
                      ) : (election.status === 'upcoming' || election.status === 'pending') ? (
                        <button onClick={() => handleElectionAction(election.id, 'start')} style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', padding: '6px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Start Election</button>
                      ) : (
                        <button onClick={() => handleElectionAction(election.id, 'view')} style={{ background: '#F0F4F9', border: 'none', padding: '6px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>View Archive</button>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/admin/candidates')} style={{ background: '#F0F4F9', border: 'none', padding: '6px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Manage</button>
                        <button onClick={() => handleDeleteElection(election.id, election.title)} style={{ background: '#FFEBEE', color: '#C62828', border: 'none', padding: '6px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && elections.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'black' }}>No elections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageElections;
