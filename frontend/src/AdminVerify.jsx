import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { voterAPI, authAPI, utils } from './api';
import AdminTopNavbar from './AdminTopNavbar';
import LogoMark from './LogoMark';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminVerify = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    fetchPendingRegistrations();
  }, [navigate]);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const data = await voterAPI.getPendingRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to fetch pending registrations');
      utils.showToast('Failed to fetch registrations', true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      await voterAPI.approveRegistration(id);
      utils.showToast('Registration approved successfully', false);
      // Redirect to admin dashboard after successful approval
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500); // Wait 1.5 seconds to show success message
    } catch (err) {
      setError('Failed to approve registration');
      utils.showToast('Failed to approve registration', true);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;

    try {
      setProcessing(true);
      await voterAPI.rejectRegistration(id, reason);
      utils.showToast('Registration rejected successfully', false);
      // Redirect to admin dashboard after successful rejection
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500); // Wait 1.5 seconds to show success message
    } catch (err) {
      setError('Failed to reject registration');
      utils.showToast('Failed to reject registration', true);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="portal-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading pending registrations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <AdminTopNavbar />

      {/* Main Content */}
      <div className="main-content" style={{ padding: '20px' }}>
        <div className="validation-card">
          <div className="brand-head">
            <LogoMark size={56} radius={20} />
            <div>
              <div className="reg-title">Voter Registration Verification</div>
              <div className="reg-sub">Review and approve pending voter registrations</div>
            </div>
          </div>

          {error && (
            <div style={{ 
              color: '#B13E3E', 
              backgroundColor: '#FEE', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid #FCC',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {registrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <div>No pending registrations to review</div>
            </div>
          ) : (
            <div className="registrations-list">
              {registrations.map((registration) => (
                <div key={registration.id} className="registration-item" style={{
                  border: '1px solid #E2E9F2',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  backgroundColor: '#FFFFFF'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px' }}>
                    {/* Registration Info */}
                    <div>
                      <h4 style={{ margin: '0 0 10px 0', color: 'black' }}>
                        {registration.name}
                      </h4>
                      <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'black' }}>
                        <div><strong>Registration Number:</strong> {registration.reg_no}</div>
                        <div><strong>Email:</strong> {registration.email}</div>
                        <div><strong>Type:</strong> {registration.type}</div>
                        <div><strong>Expected Graduation:</strong> {registration.expected_grad_year}</div>
                        <div><strong>Applied:</strong> {formatDate(registration.created_at)}</div>
                        {registration.evidence_url && (
                          <div>
                            <strong>Evidence:</strong>
                            <div style={{ marginTop: '8px' }}>
                              {registration.evidence_url.toLowerCase().endsWith('.jpg') || 
                               registration.evidence_url.toLowerCase().endsWith('.jpeg') || 
                               registration.evidence_url.toLowerCase().endsWith('.png') ? (
                                (() => {
                                  const originalUrl = registration.evidence_url;
                                  // Extract filename from the path
                                  const filename = originalUrl.split('/').pop();
                                  const finalUrl = `${API_BASE_URL}/uploads/${filename}`;
                                  console.log('Original URL:', originalUrl);
                                  console.log('Extracted filename:', filename);
                                  console.log('Final URL:', finalUrl);
                                  return (
                                    <img 
                                      src={finalUrl}
                                      alt="Bankslip"
                                      style={{ 
                                        width: '200px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        border: '1px solid #E2E9F2',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => window.open(finalUrl, '_blank')}
                                      onError={(e) => {
                                        console.error('Image failed to load:', finalUrl);
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  );
                                })()
                              ) : (
                                <div style={{
                                  padding: '20px',
                                  border: '1px solid #E2E9F2',
                                  borderRadius: '8px',
                                  backgroundColor: '#F8FAFC',
                                  textAlign: 'center'
                                }}>
                                  <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>
                                    📄 Document Preview
                                  </div>
                                  <a 
                                    href={`${API_BASE_URL}${registration.evidence_url.replace('/api/uploads', '/uploads')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ 
                                      color: '#2A6F8F',
                                      textDecoration: 'none',
                                      fontWeight: '600'
                                    }}
                                  >
                                    Open Document
                                  </a>
                                </div>
                              )}
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
                              Click image to view full size
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleApprove(registration.id)}
                        disabled={processing}
                        style={{
                          backgroundColor: '#1E5A3C',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: processing ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        onClick={() => handleReject(registration.id)}
                        disabled={processing}
                        style={{
                          backgroundColor: '#B13E3E',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: processing ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
            <h4>Admin</h4>
            <a href="#">Dashboard</a>
            <a href="#">Manage Elections</a>
            <a href="#">Security Logs</a>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a href="#">Admin Guide</a>
            <a href="#">Support</a>
            <a href="#">System Status</a>
          </div>
        </div>
        <div className="copyright">
          © 2026 BUSA ONLINE VOTING PORTAL. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminVerify;
