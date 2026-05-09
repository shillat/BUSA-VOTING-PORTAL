import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

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
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
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
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#F8FAFE', borderRadius: '16px', border: '1px dashed #CBD5E1', margin: '40px 0' }}>
          <h2 style={{ color: 'black', marginBottom: '12px' }}>Candidate Not Found</h2>
          <p style={{ color: 'black', maxWidth: '500px', margin: '0 auto 32px' }}>{error || 'The candidate profile you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/candidates')} className="btn">Back to All Candidates</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />

      <div style={{ padding: '32px 24px' }}>
        <button onClick={() => navigate('/candidates')} className="btn" style={{ marginBottom: '24px' }}>Back to Candidates</button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 360px) 1fr', gap: '32px', background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '16px', padding: '28px' }}>
          <div>
            {candidate.photo_url ? (
              <img
                src={`${apiOrigin}${candidate.photo_url}`}
                alt={candidate.name}
                style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'center top', borderRadius: '12px' }}
              />
            ) : (
              <div style={{ width: '100%', height: '420px', borderRadius: '12px', background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', fontWeight: '800', color: 'white' }}>
                {getInitials(candidate.name)}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#002F6C', textTransform: 'uppercase', marginBottom: '10px' }}>{candidate.election_title}</div>
            <h1 style={{ fontSize: '36px', fontWeight: '850', color: '#102033', margin: '0 0 10px' }}>{candidate.name}</h1>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'black', marginBottom: '18px' }}>{candidate.position}</div>

            {candidate.faculty && (
              <p style={{ fontSize: '16px', color: 'black', marginBottom: '10px' }}><strong>Faculty:</strong> {candidate.faculty}</p>
            )}
            {candidate.slogan && (
              <p style={{ fontSize: '18px', color: '#002F6C', fontStyle: 'italic', marginBottom: '22px' }}>"{candidate.slogan}"</p>
            )}

            <div style={{ background: '#F8FAFE', border: '1px solid #EDF2F7', borderRadius: '12px', padding: '22px' }}>
              <h2 style={{ fontSize: '20px', color: 'black', marginTop: 0 }}>Manifesto</h2>
              <p style={{ color: 'black', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
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
