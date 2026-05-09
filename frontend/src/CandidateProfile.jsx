import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';
import './CandidateProfile.css';

const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const data = await candidateAPI.getById(id);
        setCandidate(data);
      } catch (err) {
        setError(err.message || 'Candidate not found');
        utils.showToast(err.message || 'Failed to load candidate profile', true);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="loading-container">
          <h2>Loading Candidate Profile...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container">
        <Navbar />
        <div className="error-container">
          <h2>Candidate Not Found</h2>
          <p>{error || 'The candidate profile you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/candidates')} className="btn">Back to All Candidates</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />

      <div className="profile-container">
        <button onClick={() => navigate('/candidates')} className="btn back-button">Back to Candidates</button>

        <div className="profile-grid">
          <div>
            {candidate.photo_url ? (
              <img
                src={`${apiOrigin}${candidate.photo_url}`}
                alt={candidate.name}
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                {getInitials(candidate.name)}
              </div>
            )}
          </div>

          <div className="profile-content" style={{ padding: '24px', background: '#FFFFFF' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
              <span style={{ fontWeight: '600' }}>NAME:</span> {candidate.name}
            </p>
            {candidate.faculty && (
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                <span style={{ fontWeight: '600' }}>FACULTY:</span> {candidate.faculty}
              </p>
            )}
            <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
              <span style={{ fontWeight: '600' }}>POST:</span> {candidate.position}
            </p>
            {candidate.slogan && (
              <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'black', margin: '0 0 18px 0' }}>
                <span style={{ fontWeight: '600', fontStyle: 'normal' }}>SLOGAN:</span> "{candidate.slogan}"
              </p>
            )}

            <div className="manifesto-section">
              <h2>Manifesto</h2>
              <p>
                {candidate.manifesto || 'No manifesto has been submitted for this candidate yet.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CandidateProfile;
