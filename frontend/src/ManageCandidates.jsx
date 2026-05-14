import React, { useState, useEffect } from 'react';
import { candidateAPI, electionAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';
import AdminSidebar from './AdminSidebar';
import './ManageCandidates.css';

const ManageCandidates = () => {
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
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace('candidate', '').toLowerCase();
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedFile(null);
    setImagePreview(null);
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
      setImagePreview(null);
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
      } catch {
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
      
      // Set image preview if candidate has existing photo
      if (candidate.photo_url) {
        setImagePreview(`https://busa-voting-portal.onrender.com${candidate.photo_url}`);
      } else {
        setImagePreview(null);
      }
      
      utils.showToast(`✏️ Editing "${candidate.name}". Update details and save.`, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F9FAFB', minHeight: '1378px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <AdminTopNavbar />

      {/* Dashboard Layout */}
      <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 40px 40px', flex: '1', flexDirection: 'row', flexWrap: 'wrap' }}>
        <AdminSidebar />

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
              
              {/* Image Preview */}
              {imagePreview && (
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                  <img 
                    src={imagePreview} 
                    alt="Candidate preview" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      border: '2px solid #E2E9F2',
                      display: 'block'
                    }}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#FF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              
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

          {/* Candidates Table */}
          <div className="candidates-table-wrapper">
            <div className="candidates-table-header">
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'black', margin: 0 }}>Registered Candidates</h3>
              <div className="candidates-count-badge">{candidates.length} total</div>
            </div>

            {loading && (
              <div className="table-loading">⏳ Loading candidates...</div>
            )}

            {!loading && candidates.length === 0 && (
              <div className="table-empty">No candidates registered yet.</div>
            )}

            {!loading && candidates.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table className="candidates-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Photo</th>
                      <th>Full Name</th>
                      <th>Position</th>
                      <th>Faculty</th>
                      <th>Election</th>
                      <th>Slogan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate, index) => (
                      <tr key={candidate.id}>
                        <td className="td-index">{index + 1}</td>
                        <td className="td-photo">
                          {candidate.photo_url ? (
                            <img
                              src={`https://busa-voting-portal.onrender.com${candidate.photo_url}`}
                              alt={candidate.name}
                              className="table-candidate-photo"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {!candidate.photo_url && (
                            <div className="table-fallback-avatar">👤</div>
                          )}
                          <div className="table-fallback-avatar" style={{ display: 'none' }}>👤</div>
                        </td>
                        <td className="td-name">{candidate.name}</td>
                        <td className="td-position">
                          <span className="position-badge">{candidate.position || '—'}</span>
                        </td>
                        <td className="td-faculty">{candidate.faculty || candidate.school || '—'}</td>
                        <td className="td-election">{elections.find(e => e.id === candidate.election_id)?.title || <span style={{ color: '#aaa' }}>Unknown</span>}</td>
                        <td className="td-slogan">{candidate.slogan ? `"${candidate.slogan}"` : <span style={{ color: '#ccc' }}>—</span>}</td>
                        <td className="td-actions">
                          <button onClick={() => handleEditCandidate(candidate.id)} className="tbl-edit-btn">✏️ Edit</button>
                          <button onClick={() => handleDeleteCandidate(candidate.id)} className="tbl-delete-btn">🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageCandidates;
