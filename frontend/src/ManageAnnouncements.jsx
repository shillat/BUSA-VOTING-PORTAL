import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const ManageAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementAPI.getAll();
      setAnnouncements(data);
    } catch (err) {
      utils.showToast('Failed to fetch announcements', true);
    } finally {
      setLoading(false);
    }
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementAPI.delete(id);
        utils.showToast('🗑️ Announcement removed.', false);
        fetchAnnouncements();
      } catch (err) {
        utils.showToast('Failed to delete announcement', true);
      }
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      utils.showToast('⚠️ Please enter a title', true);
      return;
    }
    if (!content.trim()) {
      utils.showToast('⚠️ Please enter content', true);
      return;
    }

    try {
      setLoading(true);
      await announcementAPI.create({
        title,
        content,
        type: category
      });
      setTitle('');
      setCategory('General');
      setContent('');
      utils.showToast(`✅ Published successfully`, false);
      fetchAnnouncements();
    } catch (err) {
      utils.showToast('Failed to publish', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#FFFFFF', minHeight: '1165px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
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
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Announcements</a>
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
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Administrator access with announcement management privileges</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          {/* Page Header */}
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: 0 }}>Manage Announcements</h1>
            <div className="last-broadcast" style={{ fontSize: '13px', color: 'black', background: '#F0F4F9', padding: '4px 14px', borderRadius: '40px' }}>📡 Last broadcast: 2 hours ago</div>
          </div>

          {/* Two Column Grid */}
          <div className="two-col-grid" style={{ display: 'flex', gap: '28px' }}>
            {/* Left: Active Announcements List */}
            <div className="announcements-list" style={{ flex: '1.2', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', overflow: 'hidden' }}>
              <div className="list-header" style={{ padding: '16px 24px', borderBottom: '1px solid #F0F4F9', background: '#F8FAFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'black', margin: 0 }}>Active Announcements</h3>
                <div className="total-badge" style={{ background: '#E8F0FE', padding: '4px 12px', borderRadius: '40px', fontSize: '12px', fontWeight: '600', color: '#002F6C' }}>{announcements.length} total</div>
              </div>
              <div id="announcementsContainer">
                {loading && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#8AA0B8' }}>Loading announcements...</div>
                )}
                {!loading && announcements.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#8AA0B8' }}>No announcements yet. Create your first announcement above.</div>
                ) : (
                  !loading && announcements.map((a) => (
                    <div key={a.id} className="announcement-item" style={{ padding: '18px 24px', borderBottom: '1px solid #F0F4F9' }}>
                      <div className="announcement-title" style={{ fontWeight: '700', fontSize: '15px', color: '#1A2C3E', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{a.title}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '40px', background: a.type === 'Urgent' ? '#FFEBEE' : '#E8F0FE', color: a.type === 'Urgent' ? '#C62828' : '#002F6C' }}>{a.type}</span>
                          <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: '#C62828', fontSize: '18px', cursor: 'pointer', padding: '0 8px', opacity: '0.6' }}>🗑️</button>
                        </div>
                      </div>
                      <div className="announcement-content" style={{ fontSize: '18px', color: 'black', lineHeight: '1.5', marginBottom: '8px' }}>{a.content}</div>
                      <div className="announcement-date" style={{ fontSize: '11px', color: '#8AA0B8' }}>📅 {new Date(a.created_at).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Issue New Announcement Form */}
            <div className="form-card" style={{ flex: '0.9', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', padding: '24px', height: 'fit-content' }}>
              <div className="form-header" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', margin: 0 }}>📢 Issue New Announcement</h3>
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Announcement Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Polls Close in 2 Hours"
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none' }}
                >
                  <option value="General">General</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Election Update">Election Update</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'black', marginBottom: '6px' }}>Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your announcement here..."
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E2E9F2', borderRadius: '14px', fontSize: '13px', outline: 'none', resize: 'vertical', minHeight: '100px' }}
                ></textarea>
              </div>
              <button onClick={handlePublish} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '40px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', width: '100%' }}>📌 Publish Announcement</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageAnnouncements;
