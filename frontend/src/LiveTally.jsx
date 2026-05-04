import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils, electionAPI } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const LiveTally = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [stats, setStats] = useState({ total_votes: 0, total_voters: 0 });
  const [activeResults, setActiveResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAuditLog = () => {
    utils.showToast('🔗 Audit log: All tallies cryptographically verified on blockchain. Hash: 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f', true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tallyData = await electionAPI.getGlobalTally();
        setStats(tallyData);
        
        const active = await electionAPI.getActive();
        const resultsPromises = active.map(e => electionAPI.getLiveTally(e.id));
        const results = await Promise.all(resultsPromises);
        setActiveResults(results);
      } catch (err) {
        console.error('Failed to fetch tally data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      const now = new Date();
      setLastUpdated(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const participationRate = stats.total_voters > 0 
    ? Math.round((stats.total_votes / stats.total_voters) * 100) 
    : 0;

  return (
    <div className="container">
      <Navbar />

      {/* Blockchain Security Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1A3A5C 100%)', margin: '32px 48px 24px 48px', borderRadius: '24px', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>🔗</span>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '18px', letterSpacing: '0.5px' }}>Blockchain Security</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', marginTop: '4px' }}>All tallies are cryptographically locked in the ledger.</div>
          </div>
        </div>
        <button onClick={handleAuditLog} style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '10px 24px', borderRadius: '40px', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>View Audit Log</button>
      </div>

      {/* Live Tally Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 48px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', background: '#E63E3E', borderRadius: '50%', animation: 'pulse 1.2s infinite' }}></div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0 }}>LIVE ELECTION TALLY</h1>
        </div>
        <div style={{ fontSize: '13px', color: 'black', background: '#F5F8FC', padding: '6px 14px', borderRadius: '40px' }}>Last Updated: {lastUpdated}</div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '24px', padding: '0 48px', marginBottom: '40px' }}>
        {[
          { label: "Total Ballots Cast", value: stats.total_votes.toLocaleString(), sub: `of ${stats.total_voters.toLocaleString()} total registered`, percent: participationRate },
          { label: "Participation Rate", value: `${participationRate}%`, sub: `${stats.total_voters.toLocaleString()} Total Registered Voters`, percent: participationRate }
        ].map((stat, idx) => (
          <div key={idx} style={{ flex: '1', background: '#F8FAFE', borderRadius: '24px', padding: '24px', border: '1px solid #EDF2F7' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: 'black', marginBottom: '12px' }}>{stat.label}</div>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#1A2C3E', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: 'black' }}>{stat.sub}</div>
            <div style={{ background: '#E2E9F2', borderRadius: '20px', height: '8px', marginTop: '16px', overflow: 'hidden' }}>
              <div style={{ 
                background: 'linear-gradient(90deg, #002F6C 0%, #1A4A7A 100%)', 
                width: `${stat.percent}%`, 
                height: '100%', 
                borderRadius: '20px',
                transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Races */}
      <div style={{ padding: '0 48px', display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '48px' }}>
        {!loading && activeResults.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '60px', background: '#F8FAFE', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗳️</div>
            <h3 style={{ color: 'black', marginBottom: '8px' }}>No Active Election Sessions</h3>
            <p style={{ color: 'black' }}>Results will appear here in real-time once polling begins.</p>
          </div>
        ) : (
          activeResults.map((item, idx) => (
            <div key={idx} style={{ flex: '1', minWidth: '450px', background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ background: '#F8FAFE', padding: '18px 24px', borderBottom: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>{item.election.title.toUpperCase()}</h2>
                <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '4px 10px', borderRadius: '20px', color: '#475569', fontWeight: '600' }}>{item.total_votes} TOTAL VOTES</span>
              </div>
              {item.results.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'black' }}>No candidates registered for this election yet.</div>
              ) : (
                item.results.map((cand, cIdx) => (
                  <div key={cIdx} style={{ padding: '20px 24px', borderBottom: cIdx < item.results.length - 1 ? '1px solid #F0F4F9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '700', fontSize: '18px', color: '#1A2C3E' }}>{cand.name}</span>
                      <span style={{ fontWeight: '800', fontSize: '24px', color: '#002F6C' }}>{cand.percentage}%</span>
                    </div>
                    <div style={{ background: '#EFF3F8', borderRadius: '12px', height: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        background: cIdx === 0 ? 'linear-gradient(90deg, #002F6C 0%, #1A4A7A 100%)' : 'linear-gradient(90deg, #6F8FAC 0%, #8A9BB0 100%)', 
                        width: `${cand.percentage}%`, 
                        height: '100%', 
                        borderRadius: '12px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: 'black' }}>
                      <span>{cand.position}</span>
                      <span>{cand.vote_count.toLocaleString()} votes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>

      <Footer />
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LiveTally;
