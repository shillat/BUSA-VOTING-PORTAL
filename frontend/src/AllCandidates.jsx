import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AllCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await candidateAPI.getAll();
        setCandidates(data || []);
      } catch (error) {
        utils.showToast(error.message || 'Failed to load candidates', true);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const candidateCategories = useMemo(() => {
    const grouped = candidates.reduce((acc, candidate) => {
      const title = candidate.election_title || 'Unassigned Election';
      if (!acc[title]) acc[title] = [];
      acc[title].push(candidate);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, items]) => ({ title, candidates: items }));
  }, [candidates]);

  return (
    <div className="container">
      <Navbar />

      <div style={{ padding: '20px 24px 16px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', letterSpacing: '-0.5px', margin: 0, lineHeight: '1.2' }}>ALL CANDIDATES</h1>
      </div>

      <div style={{ padding: '16px 24px 48px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'black' }}>Loading candidates...</p>
          </div>
        ) : candidateCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#F8FAFE', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
            <h2 style={{ color: 'black', marginBottom: '12px' }}>No Candidates Registered</h2>
            <p style={{ color: 'black', maxWidth: '520px', margin: '0 auto' }}>Candidates added by the admin will appear here.</p>
            <button onClick={() => navigate('/')} className="btn" style={{ marginTop: '32px' }}>Back to Portal</button>
          </div>
        ) : (
          candidateCategories.map((cat) => (
            <section key={cat.title} style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A2C3E', paddingBottom: '12px', borderBottom: '2px solid #002F6C', marginBottom: '24px', display: 'inline-block', lineHeight: '1.3' }}>{cat.title}</div>
              <div className="candidates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {cat.candidates.map((cand) => (
                  <div key={cand.id} className="candidate-card" style={{ background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)' }}>
                    {cand.photo_url ? (
                      <img
                        src={`${apiOrigin}${cand.photo_url}`}
                        alt={cand.name}
                        style={{ width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center top' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '320px', background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', fontWeight: '800', color: 'white' }}>{getInitials(cand.name)}</div>
                    )}
                    <div style={{ padding: '24px', background: '#FFFFFF' }}>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                        <span style={{ fontWeight: '600' }}>NAME:</span> {cand.name}
                      </p>
                      {cand.faculty && (
                        <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                          <span style={{ fontWeight: '600' }}>FACULTY:</span> {cand.faculty}
                        </p>
                      )}
                      <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                        <span style={{ fontWeight: '600' }}>POST:</span> {cand.position}
                      </p>
                      {cand.slogan && (
                        <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'black', margin: '0 0 18px 0' }}>
                          <span style={{ fontWeight: '600', fontStyle: 'normal' }}>SLOGAN:</span> "{cand.slogan}"
                        </p>
                      )}
                      <button onClick={() => navigate(`/candidates/${cand.id}`)} className="btn" style={{ marginTop: '8px' }}>View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllCandidates;
