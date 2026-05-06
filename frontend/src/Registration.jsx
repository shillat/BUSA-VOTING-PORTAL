import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voterAPI, utils } from './api';
import LogoMark from './LogoMark';

const Registration = () => {
  const [formData, setFormData] = useState({
    campus: '',
    studentCategory: '',
    fullName: '',
    department: '',
    regNumber: '',
    password: '',
    onCampus: 'true',
    evidenceFile: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean the reg number (removes accidental spaces)
      const cleanedRegNo = formData.regNumber.trim();

      // Validate registration number format
      if (!utils.validateRegNumber(cleanedRegNo)) {
        setError('Invalid registration number format. Use pattern like 24/CS/BU/R/1234');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('reg_no', cleanedRegNo);
      submitData.append('on_campus', formData.onCampus);

      if (formData.evidenceFile) {
        submitData.append('evidence_file', formData.evidenceFile);
      }

      const response = await voterAPI.register(submitData);

      if (response && response.voter_id) {
        // Validation Successful (got a Voter ID immediately)
        utils.showToast('Validation Successful!', false);
        navigate('/validation-successful', { state: { voterId: response.voter_id, regNo: formData.regNumber } });
      } else {
        // Registration Pending (e.g., Remote In-Service)
        utils.showToast('Registration submitted for review.', false);
        navigate('/login');
      }

    } catch (err) {
      const isAlreadyRegistered = err.message && err.message.toLowerCase().includes('already exists');
      const finalError = isAlreadyRegistered
        ? "You are already registered! Please use the 'Check Status' button on the Home page to retrieve your Voter ID."
        : (err.message || 'Validation failed. Please check your credentials.');

      setError(finalError);
      utils.showToast(finalError, true);
      navigate('/validation-failed', { state: { error: finalError } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container">
      {/* Header */}
      <div className="top-header">
        <div className="logo-area">
          <LogoMark size={48} radius={14} />
          <div className="portal-title">BUSA ONLINE VOTING PORTAL</div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="validation-card">
        <div className="brand-head" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LogoMark size={56} radius={20} />
          <div style={{ marginTop: '16px' }}>
            <div className="reg-title">Voter Registration & Validation</div>
            <div className="reg-sub">Verify your identity to be eligible for upcoming elections</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Campus Selection */}
          <div className="input-group">
            <label>🏛️ Select CAMPUS <span className="label-hint">(required)</span></label>
            <select
              name="campus"
              value={formData.campus}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your campus</option>
              <option value="main">Main Campus</option>
              <option value="kampala">Kampala Campus</option>
              <option value="arua">Arua Campus</option>
              <option value="mbale">Mbale Campus</option>
            </select>
          </div>

          {/* Student Category */}
          <div className="input-group">
            <label>📋 CHECK Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px', alignItems: 'flex-start' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', justifyContent: 'flex-start' }}>
                <input
                  type="radio"
                  name="studentCategory"
                  value="Regular Student"
                  checked={formData.studentCategory === 'Regular Student'}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                /> Regular Student
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', justifyContent: 'flex-start' }}>
                <input
                  type="radio"
                  name="studentCategory"
                  value="In-service Student"
                  checked={formData.studentCategory === 'In-service Student'}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px' }}
                /> In-service Student
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="input-group">
            <label>📝 Full Name <span className="label-hint">(As seen on your Student ID)</span></label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Aisha N. Mwangi"
              required
            />
          </div>

          {/* Department */}
          <div className="input-group">
            <label>🏢 Select DEPARTMENT</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your Department</option>
              <option value="CI">Computing And Informatics</option>
              <option value="Business">Business Administration</option>
              <option value="RS">Religious Studies</option>
              <option value="EDS">Education In Sciences</option>
              <option value="EDA">Education In Arts</option>
              <option value="Health">Health Sciences</option>
              <option value="NaturalSciences">Natural Sciences</option>
            </select>
          </div>

          {/* Registration Number */}
          <div className="input-group">
            <label>🔢 Registration Number</label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber}
              onChange={handleChange}
              placeholder="24/XXX/BU/X/XXXX"
              required
            />
            <div className="small-note">
              <span className="reg-format">FORMAT: YEAR/COURSE/UNIVERSITY/CATEGORY/NUMBER</span> &nbsp; Example: 20/BCC/BU/R/0001
            </div>
          </div>



          {/* Campus Status for In-Service Students */}
          {formData.studentCategory === 'In-service Student' && (
            <div className="input-group">
              <label>📍 Campus Status</label>
              <select
                name="onCampus"
                value={formData.onCampus}
                onChange={handleChange}
              >
                <option value="true">On Campus</option>
                <option value="false">Remote/Off Campus</option>
              </select>
              {formData.onCampus === 'false' && (
                <div className="small-note" style={{ marginTop: '10px' }}>
                  ⚠️ Registration card for previous session is required for remote students
                </div>
              )}
            </div>
          )}

          {/* File Upload for Remote In-Service Students */}
          {formData.studentCategory === 'In-service Student' && formData.onCampus === 'false' && (
            <div className="input-group">
              <label>📄 Previous Session Registration Card <span className="label-hint">(Required for remote students)</span></label>
              <input
                type="file"
                name="evidenceFile"
                onChange={handleChange}
                accept="image/*,.pdf"
                required
              />
              <div className="small-note">
                Upload your previous session registration card (PDF or image, max 2MB)
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message" style={{
              color: '#B13E3E',
              backgroundColor: '#FEE',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #FCC'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="validate-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Registering...' : 'VALIDATE ✓'}
          </button>
        </form>

        {/* Legal Disclaimer */}
        <div className="legal-disclaimer">
          ⚖️ By proceeding, you verify that information provided is accurate and belongs to you.
        </div>
        
        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#002F6C',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '24px',
            marginBottom: '16px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#0A4175';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#002F6C';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Footer */}
      <div className="footer-links">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>BUSA</h4>
            <a href="#">About Union</a>
            <a href="#">Election Guidelines</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-col">
            <h4>Help & Support</h4>
            <a href="#">FAQs</a>
            <a href="#">Live Chat</a>
            <a href="#">Support Ticket</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-col">
            <h4>Quick</h4>
            <a href="#">FAQ</a>
            <a href="#">Voter Guide</a>
            <a href="#">Announcements</a>
          </div>
        </div>
        <div className="copyright">
          © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Registration;
