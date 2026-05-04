import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, guidelineAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const ManageGuidelines = () => {
  const navigate = useNavigate();
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Voter Conduct',
    content: '',
    is_published: true,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      const data = await guidelineAPI.getAll();
      setGuidelines(data);
    } catch (err) {
      utils.showToast('Failed to fetch guidelines', true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    authAPI.logout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('guideline', '').toLowerCase();
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    const { title, category, content, is_published } = formData;
    if (!title.trim()) {
      utils.showToast('⚠️ Please enter a guideline title', true);
      return;
    }
    if (!content.trim()) {
      utils.showToast('⚠️ Please provide guideline content', true);
      return;
    }

    try {
      if (editingId) {
        await guidelineAPI.update(editingId, { title, content, category, is_published });
        utils.showToast(`✅ Guideline "${title}" updated successfully`, false);
      } else {
        await guidelineAPI.create({ title, content, category, is_published });
        utils.showToast(`✅ Guideline "${title}" published successfully`, false);
      }

      setFormData({ title: '', category: 'Voter Conduct', content: '', is_published: true });
      setEditingId(null);
      fetchGuidelines();
    } catch (err) {
      utils.showToast('Failed to save guideline', true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guideline?')) {
      try {
        await guidelineAPI.delete(id);
        utils.showToast('🗑️ Guideline has been removed.', false);
        fetchGuidelines();
      } catch (err) {
        utils.showToast('Failed to delete guideline', true);
      }
    }
  };

  const handleEdit = (id) => {
    const guideline = guidelines.find(g => g.id === id);
    if (guideline) {
      setFormData({
        title: guideline.title,
        category: guideline.category || 'Voter Conduct',
        content: guideline.content,
        is_published: guideline.is_published === 1
      });
      setEditingId(id);
      utils.showToast(`✏️ Editing "${guideline.title}". Update details and click Save Guideline to apply changes.`, false);
    }
  };

  const start = currentPage * rowsPerPage;
  const paginated = guidelines.slice(start, start + rowsPerPage);
  const total = guidelines.length;
  const startNum = total === 0 ? 0 : start + 1;
  const endNum = Math.min(start + rowsPerPage, total);

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F9FAFB', minHeight: '1085px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
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
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Guidelines</a>
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
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Administrator access with guideline management privileges</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          <div className="page-header">
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: 0 }}>Manage Election Guidelines</h1>
          </div>

          {/* Issue New Guideline Form */}
          <div className="form-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', padding: '24px 28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', margin: 0 }}>📋 Issue New Guideline</h3>
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Title</label>
                <input
                  type="text"
                  id="guidelineTitle"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Code of Ethics for Candidates"
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '180px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Category</label>
                <select
                  id="guidelineCategory"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                >
                  <option value="Voter Conduct">Voter Conduct</option>
                  <option value="Candidate Rules">Candidate Rules</option>
                  <option value="System Procedures">System Procedures</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Content</label>
              <textarea
                id="guidelineContent"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Provide detailed guideline instructions..."
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none', resize: 'vertical', minHeight: '80px' }}
              ></textarea>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <input
                type="checkbox"
                id="publishGuideline"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="publishGuideline" style={{ fontSize: '14px', fontWeight: '600', color: 'black', cursor: 'pointer' }}>
                Publish this guideline immediately
              </label>
            </div>
            <button onClick={handleSave} className="publish-btn" style={{ background: '#002F6C', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '40px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              {editingId ? '💾 Save Guideline' : '📌 Publish Guideline'}
            </button>
          </div>

          {/* Active Guidelines Table */}
          <div className="table-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', overflow: 'hidden' }}>
            <div className="table-header" style={{ padding: '16px 24px', borderBottom: '1px solid #F0F4F9', background: '#F8FAFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>Active Guidelines</h3>
            </div>
            <table className="guidelines-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Date Issued</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '12px', fontWeight: '700', color: 'black', background: '#FAFCFE', borderBottom: '1px solid #F0F4F9' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#8AA0B8' }}>Loading guidelines...</td>
                  </tr>
                )}
                {!loading && guidelines.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#8AA0B8' }}>No guidelines found.</td>
                  </tr>
                )}
                {!loading && paginated.map((guideline) => (
                  <tr key={guideline.id}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}><strong>{guideline.title}</strong></td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>{new Date(guideline.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>
                      <span style={{ background: '#E8F0FE', color: '#002F6C', padding: '4px 10px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', display: 'inline-block' }}>{guideline.target_audience || 'Voter Conduct'}</span>
                    </td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4F9', fontSize: '13px', color: '#1A2C3E' }}>
                      <button onClick={() => handleEdit(guideline.id)} style={{ background: '#F0F4F9', border: 'none', padding: '5px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => handleDelete(guideline.id)} style={{ background: '#FFEBEE', color: '#C62828', border: 'none', padding: '5px 14px', borderRadius: '40px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #F0F4F9' }}>
              <div className="pagination-info" style={{ fontSize: '12px', color: 'black' }}>Showing {startNum}-{endNum} of {total} guidelines</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  style={{ background: 'white', border: '1px solid #E2E9F2', padding: '6px 18px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === 0 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * rowsPerPage >= guidelines.length}
                  style={{ background: 'white', border: '1px solid #E2E9F2', padding: '6px 18px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: (currentPage + 1) * rowsPerPage >= guidelines.length ? 'not-allowed' : 'pointer', opacity: (currentPage + 1) * rowsPerPage >= guidelines.length ? 0.5 : 1 }}
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

export default ManageGuidelines;
