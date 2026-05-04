import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { guidelineAPI, utils } from './api';

const PublicGuidelines = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        setLoading(true);
        const data = await guidelineAPI.getAll(true);
        setGuidelines(data);
      } catch (err) {
        utils.showToast('Unable to load guidelines at the moment', true);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidelines();
  }, []);

  const groupedByCategory = guidelines.reduce((grouped, guideline) => {
    const category = guideline.category || 'General';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(guideline);
    return grouped;
  }, {});

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '40px 0', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'black', marginBottom: '16px' }}>Election Guidelines & Regulations</h1>
          <p style={{ color: 'black', fontSize: '18px' }}>Official guidance for voters, candidates, and the electoral process at Bugema University.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'black' }}>Loading published guidelines...</p>
          </div>
        ) : guidelines.length === 0 ? (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #E9EDF2' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'black' }}>No published guidelines available</h2>
            <p style={{ color: 'black', fontSize: '16px', marginTop: '12px' }}>Please check back later for the latest election rules and instructions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category} className="card" style={{ padding: '32px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0 }}>{category}</h2>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#002F6C' }}>{items.length} item{items.length > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'grid', gap: '18px' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ padding: '20px', borderRadius: '20px', background: '#F7FAFF', border: '1px solid #E9EDF2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>{item.title}</h3>
                          <p style={{ fontSize: '14px', color: '#5C7085', margin: 0 }}>Published on {new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: '999px', background: '#E9F7EF', color: '#166534', fontSize: '12px', fontWeight: '700' }}>
                          Published
                        </span>
                      </div>
                      <p style={{ marginTop: '18px', color: 'black', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '44px', background: '#F8FAFE', borderRadius: '24px', padding: '34px', textAlign: 'center', border: '1px solid #E9EDF2' }}>
          <h3 style={{ marginBottom: '18px', fontSize: '24px', fontWeight: '800', color: 'black' }}>Need further help?</h3>
          <p style={{ color: 'black', fontSize: '16px', marginBottom: '24px' }}>If you have questions about the election process, reach out to the BUSA Electoral Board.</p>
          <a href="tel:+256780752003" className="btn" style={{ textDecoration: 'none' }}>Contact Electoral Board</a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicGuidelines;
