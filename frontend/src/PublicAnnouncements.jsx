import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { announcementAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await announcementAPI.getAll();
        setAnnouncements(data);
      } catch (err) {
        utils.showToast('Failed to load announcements', true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

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
