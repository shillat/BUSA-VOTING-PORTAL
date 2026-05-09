import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Database, RefreshCw, UserCheck } from 'lucide-react';
import { utils, electionAPI } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const defaultStats = {
  total_votes: 0,
  voters_turned_up: 0,
  registered_voters: 0,
  total_eligible_voters: 0,
  total_voters: 0
};

const LiveTally = () => {
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [stats, setStats] = useState(defaultStats);
  const [activeResults, setActiveResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTally = async () => {
    try {
      setLoading(true);
      const [globalStats, elections] = await Promise.all([
        electionAPI.getGlobalTally(),
        electionAPI.getActive()
      ]);

      const tallies = await Promise.all(
        elections.map((election) => electionAPI.getLiveTally(election.id))
      );

      setStats({
        total_votes: globalStats.total_votes || 0,
        voters_turned_up: globalStats.voters_turned_up || 0,
        registered_voters: globalStats.registered_voters || 0,
        total_eligible_voters: globalStats.total_eligible_voters || globalStats.total_voters || 0,
        total_voters: globalStats.total_voters || globalStats.total_eligible_voters || 0
      });
      setActiveResults(tallies);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      utils.showToast(error.message || 'Failed to load live tally', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTally();
    const interval = setInterval(fetchTally, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAuditLog = () => {
    utils.showToast('Audit log: Live tally figures are pulled from the voting database.', false);
  };

  const eligibleVoters = stats.total_eligible_voters || stats.total_voters || 0;
  const turnoutRate = eligibleVoters > 0
    ? Math.round((stats.voters_turned_up / eligibleVoters) * 100)
    : 0;
  const registrationRate = eligibleVoters > 0
    ? Math.round((stats.registered_voters / eligibleVoters) * 100)
    : 0;

  const summaryCards = [
    {
      label: 'Total Ballots Cast',
      value: stats.total_votes.toLocaleString(),
      sub: `${stats.voters_turned_up.toLocaleString()} unique voters have cast at least one ballot`,
      percent: Math.min(turnoutRate, 100),
      icon: BarChart3
    },
    {
      label: 'Voter Turnout',
      value: `${turnoutRate}%`,
      sub: `${stats.voters_turned_up.toLocaleString()} of ${eligibleVoters.toLocaleString()} eligible students turned up`,
      percent: turnoutRate,
      icon: UserCheck
    },
    {
      label: 'Voter IDs Issued',
      value: stats.registered_voters.toLocaleString(),
      sub: `${registrationRate}% of eligible students completed voter registration`,
      percent: registrationRate,
      icon: CheckCircle2
    },
    {
      label: 'Eligible Voters',
      value: eligibleVoters.toLocaleString(),
      sub: 'Based on the admin student master list',
      percent: 100,
      icon: Database
    }
  ];

  return (
    <div className="container">
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0A2540 0%, #1A3A5C 100%)', margin: '20px 16px 16px 16px', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={24} color="white" />
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', lineHeight: '1.3' }}>Live Database Tally</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '12px', marginTop: '2px', lineHeight: '1.3' }}>
              Turnout is calculated against all eligible students in the admin master list.
            </div>
          </div>
        </div>
        <button onClick={handleAuditLog} style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '8px 16px', borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' }}>
          View Audit Note
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', marginBottom: '16px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', background: '#4CAF50', borderRadius: '50%', animation: 'pulse 1.2s infinite' }}></div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0, lineHeight: '1.2' }}>LIVE ELECTION TALLY</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ fontSize: '13px', color: 'black', background: '#F5F8FC', padding: '6px 14px', borderRadius: '8px' }}>Last Updated: {lastUpdated}</div>
          <button onClick={fetchTally} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #D8E2EC', background: 'white', borderRadius: '8px', padding: '7px 12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '700', color: '#102033' }}>
            <RefreshCw size={14} />
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', padding: '0 24px', marginBottom: '32px' }}>
        {summaryCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ background: '#F8FAFE', borderRadius: '8px', padding: '20px', border: '1px solid #EDF2F7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'black' }}>{stat.label}</div>
                <Icon size={20} color="#002F6C" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#1A2C3E', marginBottom: '6px', lineHeight: '1.2' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'black', minHeight: '36px' }}>{stat.sub}</div>
              <div style={{ background: '#E2E9F2', borderRadius: '20px', height: '8px', marginTop: '16px', overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #002F6C 0%, #1A4A7A 100%)',
                  width: `${Math.min(stat.percent, 100)}%`,
                  height: '100%',
                  borderRadius: '20px',
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {!loading && activeResults.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '40px 20px', background: '#F8FAFE', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
            <h3 style={{ color: 'black', marginBottom: '8px' }}>No Active Election Sessions</h3>
            <p style={{ color: 'black' }}>Results will appear here in real time once polling begins.</p>
          </div>
        ) : (
          activeResults.map((item, idx) => (
            <div key={item.election?.id || idx} style={{ width: '100%', background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' }}>
              <div style={{ background: '#F8FAFE', padding: '18px 24px', borderBottom: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>{(item.election?.title || 'Election').toUpperCase()}</h2>
                <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '4px 10px', borderRadius: '20px', color: '#475569', fontWeight: '600' }}>{item.total_votes || 0} TOTAL VOTES</span>
              </div>
              {(item.results || []).length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'black' }}>No candidates registered for this election yet.</div>
              ) : (
                item.results.map((cand, cIdx) => {
                  const percentage = Number(cand.percentage || 0);
                  return (
                    <div key={cand.id || cand.candidate_id || cIdx} style={{ padding: '20px 24px', borderBottom: cIdx < item.results.length - 1 ? '1px solid #F0F4F9' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '14px' }}>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#1A2C3E' }}>{cand.name}</span>
                        <span style={{ fontWeight: '800', fontSize: '24px', color: '#002F6C' }}>{percentage}%</span>
                      </div>
                      <div style={{ background: '#EFF3F8', borderRadius: '12px', height: '10px', overflow: 'hidden' }}>
                        <div style={{
                          background: cIdx === 0 ? 'linear-gradient(90deg, #002F6C 0%, #1A4A7A 100%)' : 'linear-gradient(90deg, #6F8FAC 0%, #8A9BB0 100%)',
                          width: `${Math.min(percentage, 100)}%`,
                          height: '100%',
                          borderRadius: '12px',
                          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: 'black', gap: '14px' }}>
                        <span>{cand.position}</span>
                        <span>{Number(cand.vote_count || 0).toLocaleString()} votes</span>
                      </div>
                    </div>
                  );
                })
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
