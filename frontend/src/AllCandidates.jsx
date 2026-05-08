import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const AllCandidates = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Placeholder candidates data
  const candidateCategories = [
    {
      title: "BUSA Student Leadership Elections 2026",
      candidates: [
        {
          id: 1,
          initials: "AO",
          name: "ABRAHAM OKOCH",
          faculty: "General",
          post: "President",
          slogan: "Leadership That Delivers",
          photo_url: "/uploads/ABRAHAM OKOCH.png"
        },
        {
          id: 2,
          initials: "FJ",
          name: "FUBI JOVIA",
          faculty: "General",
          post: "President",
          slogan: "Together We Rise",
          photo_url: "/uploads/FUBI JOVIA.png"
        }
      ]
    },
    {
      title: "Faculty of Science and Technology",
      candidates: [
        {
          id: 3,
          initials: "LL",
          name: "LUZZE LINUS",
          faculty: "Science and Technology",
          post: "MP - Faculty of Science and Technology",
          slogan: "Innovation Through Science",
          photo_url: "/uploads/LUZZE LINUS.jpg"
        },
        {
          id: 4,
          initials: "NB",
          name: "NAKAMYA BELINDA",
          faculty: "Science and Technology",
          post: "MP - Faculty of Science and Technology",
          slogan: "Science For Progress",
          photo_url: "/uploads/NAKAMYA BELINDA.png"
        }
      ]
    },
    {
      title: "Eastern Region",
      candidates: [
        {
          id: 5,
          initials: "OP",
          name: "OKELLO PETER",
          faculty: "Regional Representation",
          post: "MP - Eastern Region",
          slogan: "Eastern Unity, Eastern Pride",
          photo_url: "/uploads/OKELLO PETER.png"
        },
        {
          id: 6,
          initials: "SN",
          name: "SHILLAH NAIGAGA",
          faculty: "Regional Representation",
          post: "MP - Eastern Region",
          slogan: "Service With Excellence",
          photo_url: "/uploads/SHILLAH NAIGAGA.jpg"
        }
      ]
    }
  ];

  const handleViewProfile = (candidate) => {
    navigate(`/candidates/${candidate.id}`);
  };

  return (
    <div className="container">
      <Navbar />

      {/* Page Title */}
      <div style={{ padding: '20px 24px 16px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', letterSpacing: '-0.5px', margin: 0, lineHeight: '1.2' }}>ALL CANDIDATES</h1>
      </div>

      {/* Candidates Sections */}
      <div style={{ padding: '16px 24px 48px 24px' }}>
        {!loading && candidateCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#F8FAFE', borderRadius: '32px', border: '1px dashed #CBD5E1' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>👥</div>
            <h2 style={{ color: 'black', marginBottom: '12px' }}>No Candidates Registered</h2>
            <p style={{ color: 'black', maxWidth: '500px', margin: '0 auto' }}>There are currently no candidates registered in the system. Check back once the nomination period is open.</p>
            <button onClick={() => navigate('/')} className="btn" style={{ marginTop: '32px' }}>Back to Portal</button>
          </div>
        ) : (
          candidateCategories.map((cat, idx) => (
            <div key={idx} style={{ marginBottom: '64px' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A2C3E', paddingBottom: '12px', borderBottom: '2px solid #002F6C', marginBottom: '24px', display: 'inline-block', lineHeight: '1.3' }}>{cat.title}</div>
              <div className="candidates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {cat.candidates.map((cand, cIdx) => (
                  <div key={cIdx} className="candidate-card" style={{ background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)', transition: 'all 0.25s ease' }}>
                    {cand.photo_url ? (
                      <img
                        src={`https://busa-voting-portal.onrender.com${cand.photo_url}`}
                        alt={cand.name}
                        style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'center top' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '350px', background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', fontWeight: '800', color: 'white' }}>{cand.initials}</div>
                    )}
                    <div style={{ padding: '24px', background: '#FFFFFF', textAlign: 'center' }}>
                      {/* Candidate Info - Simple Format */}
                      <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                          <span style={{ fontWeight: '600' }}>NAME:</span> {cand.name}
                        </p>
                        {cand.faculty && (
                          <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                            <span style={{ fontWeight: '600' }}>FACULTY:</span> {cand.faculty}
                          </p>
                        )}
                        <p style={{ fontSize: '16px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>
                          <span style={{ fontWeight: '600' }}>POST:</span> {cand.post}
                        </p>
                        {cand.slogan && (
                          <p style={{ fontSize: '15px', fontStyle: 'italic', color: 'black', margin: '0' }}>
                            <span style={{ fontWeight: '600', fontStyle: 'normal' }}>SLOGAN:</span> "{cand.slogan}"
                          </p>
                        )}
                      </div>

                      <button onClick={() => navigate('/login')} className="login-btn" style={{ marginTop: '8px' }}>VOTE</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )))}
      </div>

      <Footer />
    </div>
  );
};

export default AllCandidates;
