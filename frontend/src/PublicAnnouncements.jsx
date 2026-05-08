import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicAnnouncements = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Placeholder announcements data
  const announcements = [
    {
      id: 1,
      title: "🗳️ 2026 BUSA Elections Officially Launched",
      content: "The 2026 BUSA Student Leadership Elections have officially begun! Voting is now open for all eligible students. Cast your vote for President, Faculty Representatives, and Regional MPs. Make your voice heard and shape the future of our student community. Voting closes on December 31, 2026 at 11:59 PM.",
      type: "Election Notice",
      target_audience: "all",
      created_at: "2026-05-07T10:00:00Z"
    },
    {
      id: 2,
      title: "📋 Voter Registration Deadline Extended",
      content: "Good news! The voter registration deadline has been extended by one week due to popular demand. Students who haven't registered yet have until November 30, 2026 to complete their registration. Don't miss this opportunity to participate in the democratic process. Visit the registration portal now!",
      type: "Important Notice",
      target_audience: "all",
      created_at: "2026-05-07T14:30:00Z"
    },
    {
      id: 3,
      title: "🎯 Meet the Candidates: Presidential Debate Tonight",
      content: "Join us tonight at 7:00 PM in the Main Auditorium for the Presidential Candidates Debate. Abraham Okoch and Fubi Jovia will present their visions and answer questions from the student body. This is your chance to make an informed decision. Refreshments will be served. All students are welcome!",
      type: "Event",
      target_audience: "all",
      created_at: "2026-05-07T16:00:00Z"
    },
    {
      id: 4,
      title: "🏆 New Student Support Programs Announced",
      content: "The current BUSA administration is pleased to announce new support programs including: 1) Emergency Student Fund for those facing financial difficulties, 2) Academic Excellence Scholarships for top-performing students, 3) Mental Health and Counseling Services expansion, and 4) Career Development Workshops. Applications open next week. Stay tuned for more details!",
      type: "General Information",
      target_audience: "all",
      created_at: "2026-05-07T09:00:00Z"
    }
  ];

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ padding: '40px 0' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'black', marginBottom: '12px' }}>Public Announcements</h1>
          <p style={{ color: 'black', fontSize: '18px' }}>Stay updated with the latest news, guidelines, and notices from the BUSA Electoral Board.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'black' }}>Fetching latest updates...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '24px', border: '1px solid #E9EDF2' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📢</div>
            <h3>No Announcements Yet</h3>
            <p style={{ color: 'black' }}>Check back later for official updates regarding the 2027 elections.</p>
            <button onClick={() => navigate('/')} className="btn" style={{ marginTop: '24px' }}>Back to Home</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {announcements.map((item) => (
              <div key={item.id} className="card" style={{ padding: '32px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '4px 12px', 
                      borderRadius: '40px', 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      background: item.type === 'Urgent' ? '#FEE2E2' : '#E8F0FE', 
                      color: item.type === 'Urgent' ? '#B91C1C' : '#002F6C',
                      marginBottom: '12px'
                    }}>
                      {item.type.toUpperCase()}
                    </span>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'black', margin: '0 0 8px 0' }}>{item.title}</h2>
                    <div style={{ fontSize: '13px', color: '#8AA0B8' }}>
                      📅 {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '18px', lineHeight: '1.6', color: 'black', whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PublicAnnouncements;
