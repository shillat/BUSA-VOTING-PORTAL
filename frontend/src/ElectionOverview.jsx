import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI, electionAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const ElectionOverview = () => {
  const navigate = useNavigate();
  const [activeElections, setActiveElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const [electionsData, candidatesData] = await Promise.all([
          electionAPI.getActive(),
          candidateAPI.getAll()
        ]);
        setActiveElections(electionsData || []);
        setCandidates(candidatesData || []);
      } catch (error) {
        utils.showToast(error.message || 'Failed to load election overview', true);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const candidatesByElection = useMemo(() => candidates.reduce((grouped, candidate) => {
    const electionId = candidate.election_id;
    if (!grouped[electionId]) grouped[electionId] = [];
    grouped[electionId].push(candidate);
    return grouped;
  }, {}), [candidates]);

  return (
    <div className="container">
      <Navbar />

      <div style={{ padding: '20px 24px 16px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0, lineHeight: '1.2' }}>ELECTION OVERVIEW</h1>
      </div>

      {loading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>Loading election overview...</div>
      ) : activeElections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', background: '#F8FAFE', margin: '24px', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
          <h2 style={{ color: 'black' }}>No Active Election</h2>
          <p style={{ color: 'black' }}>When the admin starts an election, its details and candidates will appear here.</p>
          <button onClick={() => navigate('/')} className="btn" style={{ marginTop: '24px' }}>Back to Portal</button>
        </div>
      ) : (
        <div style={{ padding: '0 24px 40px' }}>
          {activeElections.map((election) => (
            <section key={election.id} style={{ marginBottom: '32px' }}>
              <div style={{ background: 'linear-gradient(135deg, #002F6C, #1E5A3C)', padding: '32px 24px', borderRadius: '16px', color: 'white', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '30px', fontWeight: '800', margin: '0 0 14px 0', color: 'white', textTransform: 'uppercase' }}>{election.title}</h2>
                <p style={{ fontSize: '17px', margin: '0 0 20px 0', color: 'white', opacity: 0.92, lineHeight: 1.5 }}>{election.description || 'No description provided.'}</p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div><strong>Start:</strong> {new Date(election.start_date).toLocaleString()}</div>
                  <div><strong>End:</strong> {new Date(election.end_date).toLocaleString()}</div>
                  <div><strong>Status:</strong> {election.status}</div>
                </div>
              </div>

              <h3 style={{ color: 'black', fontSize: '22px', fontWeight: '800' }}>Candidates</h3>
              {(candidatesByElection[election.id] || []).length === 0 ? (
                <div style={{ padding: '24px', background: '#F8FAFE', borderRadius: '12px', color: 'black' }}>No candidates have been added to this election yet.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  {candidatesByElection[election.id].map((candidate) => (
                    <div key={candidate.id} className="card" style={{ padding: '22px', textAlign: 'left' }}>
                      <h4 style={{ color: 'black', fontSize: '18px', margin: '0 0 8px' }}>{candidate.name}</h4>
                      <p style={{ color: 'black', margin: '0 0 8px' }}>{candidate.position}</p>
                      {candidate.slogan && <p style={{ color: '#002F6C', fontStyle: 'italic' }}>"{candidate.slogan}"</p>}
                      <button onClick={() => navigate(`/candidates/${candidate.id}`)} className="btn">View Profile</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ElectionOverview;
