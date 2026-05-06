import React from 'react';
import { useNavigate } from 'react-router-dom';
import { utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const ElectionOverview = () => {
  const navigate = useNavigate();

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleViewCandidates = (role) => {
    utils.showToast(`📋 Viewing candidates for ${role} (demo - candidate list would appear)`, false);
    // In a real app, we might navigate to /candidates?role=...
    navigate('/candidates');
  };

  const roles = [
    { title: "Guild President", subtitle: "The highest executive authority", description: "The highest executive authority of the Student Union. Responsible for representing all students to the university administration, leading the Guild Cabinet, and overseeing the strategic direction of student welfare." },
     { title: "MP Schools", subtitle: "Legislative representatives", description: "Legislative representatives for individual academic faculties. Members of Parliament for Schools advocate for specific academic concerns, departmental funding, and facilities." },
  { title: "Regional Member of Parliament", subtitle: "Constituency-based legislative representative", description: "Elected representatives for each of the four administrative regions. Regional MPs act as the primary legislative link between students and the university council, advocating for regional resource allocation, faculty-specific infrastructure development, and student welfare initiatives."}
    ];

  const integrityItems = [
    { icon: "🔐", title: "Every vote is cryptographically secured", desc: "Our portal ensures one-person-one-vote through multi-factor biometric authentication." },
    { icon: "📊", title: "Real-time Auditing", desc: "The tallying process is transparent and can be audited by registered observers in real-time without compromising privacy." },
    { icon: "♿", title: "Inclusive Access", desc: "Designed for accessibility. Our interface supports screen readers and alternative input methods for all students." }
  ];

  return (
    <div className="container">
      <Navbar />

      <div style={{ padding: '20px 24px 16px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0, lineHeight: '1.2' }}>ELECTION OVERVIEW</h1>
      </div>

      <div className="roles-grid" style={{ padding: '16px 24px 32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {roles.map((role, idx) => (
          <div key={idx} className="role-card" style={{ background: '#FFFFFF', border: '1px solid #EDF2F7', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.05)'; }}>
            <div style={{ background: '#F8FAFE', padding: '24px 28px 16px 28px', borderBottom: '1px solid #EDF2F7' }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#1A2C3E', marginBottom: '8px' }}>{role.title}</div>
              <div style={{ fontSize: '14px', color: 'black', letterSpacing: '0.3px' }}>{role.subtitle}</div>
            </div>
            <div style={{ padding: '24px 28px', fontSize: '15px', lineHeight: '1.55', color: 'black', borderBottom: '1px solid #F0F4F9', minHeight: '110px' }}>
              {role.description}
            </div>
            <div style={{ padding: '20px 28px' }}>
              <button onClick={() => handleViewCandidates(role.title)} style={{ display: 'inline-block', background: '#002F6C', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '40px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#0A4175'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#002F6C'; e.currentTarget.style.transform = 'scale(1)'; }}>VIEW CANDIDATES</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '32px 24px 40px 24px', background: '#F8FAFE', margin: '16px 24px 32px 24px', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'black', marginBottom: '12px', lineHeight: '1.3' }}>Voting Integrity</h2>
          <p style={{ fontSize: '16px', color: 'black', lineHeight: '1.4' }}>Ensuring trust, transparency, and accessibility in every vote</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {integrityItems.map((item, idx) => (
            <div key={idx} style={{ width: '100%', maxWidth: '320px', background: '#FFFFFF', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #E8EDF4', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)'; }}>
              <div style={{ fontSize: '42px', marginBottom: '20px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black', marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '18px', lineHeight: '1.5', color: 'black' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElectionOverview;
