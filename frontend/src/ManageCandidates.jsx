import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI, electionAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const ManageCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidatesData, electionsData] = await Promise.all([
        candidateAPI.getAll(),
        electionAPI.getAll()
      ]);
      setCandidates(candidatesData);
      setElections(electionsData);
    } catch (err) {
      utils.showToast(err.message || 'Failed to fetch data', true);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    position: '',
    election_id: '',
    school: 'Faculty of Business',
    slogan: '',
    manifesto: ''
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace('candidate', '').toLowerCase();
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAddCandidate = async () => {
    const { id, name, position, election_id, school, slogan, manifesto } = formData;

    if (!name.trim()) {
      utils.showToast("⚠️ Please enter the candidate's full name", true);
      return;
    }
    if (!election_id) {
      utils.showToast("⚠️ Please select an election", true);
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', name);
      data.append('position', position || 'Candidate');
      data.append('election_id', election_id);
      data.append('faculty', school);
      data.append('slogan', slogan);
      data.append('manifesto', manifesto);
      if (uploadedFile) {
        data.append('photo', uploadedFile);
      }

      if (id) {
        await candidateAPI.update(id, data);
        utils.showToast(`✅ Candidate "${name}" updated successfully`, false);
      } else {
        await candidateAPI.create(data);
        utils.showToast(`✅ Candidate "${name}" registered successfully`, false);
      }

      setFormData({
        id: null,
        name: '',
        position: '',
        election_id: '',
        school: 'Faculty of Business',
        slogan: '',
        manifesto: ''
      });
      setUploadedFile(null);
      fetchData();
    } catch (err) {
      utils.showToast(err.message || 'Failed to save candidate', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidateAPI.delete(id);
        utils.showToast('🗑️ Candidate has been removed.', false);
        fetchData();
      } catch (err) {
        utils.showToast('Failed to delete candidate', true);
      }
    }
  };

  const handleEditCandidate = (id) => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
      setFormData({
        id: candidate.id,
        name: candidate.name,
        position: candidate.position,
        election_id: candidate.election_id,
        school: candidate.faculty || candidate.school,
        slogan: candidate.slogan,
        manifesto: candidate.manifesto || ''
      });
      utils.showToast(`✏️ Editing "${candidate.name}". Update details and save.`, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F9FAFB', minHeight: '1378px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 40px 40px', flex: '1', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E9EDF2', height: 'fit-content', order: 1 }}>
          <style jsx>{`
            @media (max-width: 768px) {
              .dashboard-layout {
                padding: 20px 16px !important;
                gap: 20px !important;
              }
              .sidebar {
                width: 100% !important;
                order: 2 !important;
                margin-bottom: 20px;
              }
              .main-content {
                order: 1 !important;
              }
              .candidates-grid {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
              }
              .form-row {
                flex-direction: column !important;
                gap: 16px !important;
              }
              .form-group {
                min-width: 100% !important;
              }
              .status-card {
                flex-direction: column !important;
                text-align: center !important;
                gap: 12px !important;
              }
            }
            @media (max-width: 480px) {
              .dashboard-layout {
                padding: 16px 12px !important;
                gap: 16px !important;
              }
              .form-card {
                padding: 20px 16px !important;
              }
              .candidate-header {
                padding: 16px !important;
              }
              .candidate-body {
                padding: 16px !important;
              }
            }
          `}</style>
          <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #F0F4F9' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
          </div>
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Dashboard</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/database'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Voter Database</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Elections</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Manage Candidates</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Guidelines</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Announcements</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Security Log</a>
            <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #F0F4F9' }}>Logout</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '28px', minWidth: '0', order: 2 }}>
          {/* Status Card */}
          <div className="status-card" style={{ background: 'linear-gradient(105deg, #002F6C 0%, #0A4175 100%)', borderRadius: '20px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div className="status-left">
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>Verified Status: Active</h3>
              <p style={{ fontSize: '13px', opacity: '0.85', margin: 0 }}>Administrator access with candidate management privileges</p>
            </div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '40px', fontWeight: '700', fontSize: '13px' }}>✓ ACTIVE</div>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: '0 0 6px 0' }}>Manage Candidates</h1>
            <p style={{ fontSize: '18px', color: 'black', margin: 0 }}>Review and organize the official candidate list for the 2026 Academic Year.</p>
          </div>

          {/* Add New Candidate Form */}
          <div className="form-card" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E9EDF2', padding: '28px 32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', margin: 0 }}>➕ Add New Candidate</h3>
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Candidate Full Name</label>
                <input
                  type="text"
                  id="candidateName"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Target Election</label>
                <select
                  id="candidateElection_id"
                  value={formData.election_id}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">Select Election</option>
                  {elections.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Position / Post</label>
                <select
                  id="candidatePosition"
                  value={formData.position}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">Select Position</option>
                  <option value="Presidential Candidate">Presidential Candidate</option>
                  <option value="Vice Presidential Candidate">MP FACULTY OF SCIENCE AND TECHNOLOGY</option>
                  <option value="Guild Secretary">MP FACULTY OF EDUCATION</option>
                  <option value="Treasurer">MP FACULTY OF RELIGIOUS STUDIES</option>
                  <option value="Sports Captain">MP FACULTY OF BUSINESS</option>
                  <option value="Cultural Minister">MP OF EASTERN REGION</option>
                  <option value="Academic Secretary">MP OF NORTHERN REGION</option>
                  <option value="Welfare Officer">MP OF NORTHERN REGION</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>School / Faculty</label>
                <select
                  id="candidateSchool"
                  value={formData.school}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                >
                  <option value="Faculty of Business">Faculty of Business</option>
                  <option value="Faculty of Engineering">Faculty of Science and Technology</option>
                  <option value="Faculty of Law">Faculty of Religious studies</option>
                  <option value="Faculty of Health Sciences">Faculty of Education</option>
                  </select>
              </div>
              <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Campaign Slogan (Optional)</label>
                <input
                  type="text"
                  id="candidateSlogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  placeholder="e.g., Together We Rise"
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Manifesto Statement</label>
              <textarea
                id="candidateManifesto"
                value={formData.manifesto}
                onChange={handleInputChange}
                placeholder="Briefly describe candidate's vision and core objectives..."
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E9F2', borderRadius: '16px', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '100px' }}
              ></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'black', marginBottom: '8px' }}>Candidate Photograph</label>
              <div onClick={() => document.getElementById('fileInput').click()} style={{ border: '2px dashed #E2E9F2', borderRadius: '20px', padding: '32px', textAlign: 'center', background: '#F8FAFE', cursor: 'pointer', transition: '0.2s' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div>
                <div style={{ fontSize: '14px', color: 'black' }}>Click to upload candidate image</div>
                <div style={{ fontSize: '11px', color: '#8AA0B8', marginTop: '8px' }}>PNG, JPG up to 5MB</div>
                <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
              {uploadedFile && <div style={{ fontSize: '12px', color: '#2E7D32', marginTop: '8px', textAlign: 'center' }}>✓ {uploadedFile.name} selected</div>}
            </div>

            <button onClick={handleAddCandidate} style={{ background: '#002F6C', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '48px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', width: '100%' }}>REGISTER CANDIDATE →</button>
          </div>

          {/* Candidates Grid */}
          <div className="candidates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', position: 'relative', minHeight: '200px' }}>
            {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '600', color: 'black' }}>Loading candidates...</div>}
            {!loading && candidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card" style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E9EDF2', overflow: 'hidden', opacity: loading ? 0.5 : 1 }}>
                <div className="candidate-header" style={{ background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)', padding: '20px', color: 'white', textAlign: 'center', position: 'relative' }}>
                  {candidate.photo_url ? (
                    <img
                      src={`https://busa-voting-portal.onrender.com${candidate.photo_url}`}
                      alt={candidate.name}
                      style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', marginBottom: '10px' }}
                    />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 10px' }}>👤</div>
                  )}
                  <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{candidate.name}</div>
                  <div style={{ fontSize: '13px', opacity: '0.9' }}>{candidate.position}</div>
                </div>
                <div className="candidate-body" style={{ padding: '20px' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '18px', color: 'black', lineHeight: '1.5', marginBottom: '12px', minHeight: '60px' }}>"{candidate.slogan}"</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'black', display: 'flex', alignItems: 'center', gap: '6px' }}>🎓 {candidate.faculty || candidate.school}</div>
                  <div style={{ fontSize: '11px', color: '#8AA0B8', marginTop: '4px' }}>🗳️ {elections.find(e => e.id === candidate.election_id)?.title || 'Unknown Election'}</div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F0F4F9' }}>
                    <button onClick={() => handleEditCandidate(candidate.id)} style={{ flex: '1', background: '#F0F4F9', border: 'none', padding: '6px 0', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteCandidate(candidate.id)} style={{ flex: '1', background: '#FFEBEE', color: '#C62828', border: 'none', padding: '6px 0', borderRadius: '40px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && candidates.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'black' }}>No candidates registered yet.</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageCandidates;
