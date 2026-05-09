import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { guidelineAPI, utils } from './api';

const PublicGuidelines = () => {
  const [loading, setLoading] = useState(true);
  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {
    const fetchGuidelines = async () => {
      try {
        setLoading(true);
        const data = await guidelineAPI.getAll(true);
        setGuidelines(data || []);
      } catch (error) {
        utils.showToast(error.message || 'Failed to load published guidelines', true);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidelines();
  }, []);

  const groupedByCategory = useMemo(() => guidelines.reduce((grouped, guideline) => {
    const category = guideline.category || 'General';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(guideline);
    return grouped;
  }, {}), [guidelines]);

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px 0', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'black', marginBottom: '16px' }}>Election Guidelines & Regulations</h1>
          <p style={{ color: 'black', fontSize: '18px' }}>Official guidance published by the BUSA Electoral Board.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading published guidelines...</div>
        ) : guidelines.length === 0 ? (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E9EDF2' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'black' }}>No published guidelines available</h2>
            <p style={{ color: 'black', fontSize: '16px', marginTop: '12px' }}>Guidelines published by the admin will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <section key={category} className="card" style={{ padding: '32px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: 0 }}>{category}</h2>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#002F6C' }}>{items.length} item{items.length > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'grid', gap: '18px' }}>
                  {items.map((item) => (
                    <article key={item.id} style={{ padding: '20px', borderRadius: '12px', background: '#F7FAFF', border: '1px solid #E9EDF2' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'black', margin: '0 0 8px 0' }}>{item.title}</h3>
                      <p style={{ fontSize: '14px', color: '#5C7085', margin: 0 }}>Published on {new Date(item.created_at).toLocaleDateString()}</p>
                      <p style={{ marginTop: '18px', color: 'black', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PublicGuidelines;
