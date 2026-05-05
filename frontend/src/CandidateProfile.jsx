import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';

const CandidateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                setLoading(true);
                const data = await candidateAPI.getById(id);
                setCandidate(data);
            } catch (err) {
                console.error('Failed to fetch candidate:', err);
                setError(err.message || 'Failed to load candidate profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCandidate();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <Navbar />
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <h2>Loading Candidate Profile...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !candidate) {
        return (
            <div className="container">
                <Navbar />
                <div style={{ textAlign: 'center', padding: '100px 20px', background: '#F8FAFE', borderRadius: '32px', border: '1px dashed #CBD5E1', margin: '40px 0' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
                    <h2 style={{ color: 'black', marginBottom: '12px' }}>Candidate Not Found</h2>
                    <p style={{ color: 'black', maxWidth: '500px', margin: '0 auto 32px' }}>
                        {error || 'The candidate profile you are looking for does not exist or has been removed.'}
                    </p>
                    <button onClick={() => navigate('/candidates')} className="btn">Back to All Candidates</button>
                </div>
                <Footer />
            </div>
        );
    }

    const initials = candidate.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="container">
            <Navbar />

            {/* Back Button */}
            <div style={{ padding: '20px 48px 0 48px' }}>
                <button
                    onClick={() => navigate('/candidates')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#002F6C',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ← Back to All Candidates
                </button>
            </div>

            {/* Profile Header */}
            <div style={{ padding: '20px 48px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '400px 1fr',
                    gap: '48px',
                    alignItems: 'start',
                    background: '#FFFFFF',
                    borderRadius: '32px',
                    padding: '48px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #EDF2F7'
                }}>

                    {/* Photo Section */}
                    <div style={{ textAlign: 'center' }}>
                        {candidate.photo_url ? (
                            <img
                                src={`https://busa-voting-portal.onrender.com${candidate.photo_url}`}
                                alt={candidate.name}
                                style={{
                                    width: '320px',
                                    height: '400px',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    borderRadius: '24px',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div style={{
                                width: '320px',
                                height: '400px',
                                background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '96px',
                                fontWeight: '800',
                                color: 'white',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                            }}>
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: '800',
                                color: 'black',
                                margin: '0 0 8px 0',
                                letterSpacing: '-1px'
                            }}>
                                {candidate.name}
                            </h1>
                            <p style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#002F6C',
                                margin: '0 0 16px 0'
                            }}>
                                {candidate.position || 'Candidate'}
                            </p>
                            <p style={{
                                fontSize: '18px',
                                color: '#64748B',
                                margin: '0'
                            }}>
                                Running in: {candidate.election_title}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '24px',
                            marginBottom: '32px'
                        }}>
                            {candidate.faculty && (
                                <div style={{
                                    background: '#F8FAFC',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0'
                                }}>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        margin: '0 0 8px 0'
                                    }}>
                                        Faculty
                                    </h3>
                                    <p style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: 'black',
                                        margin: '0'
                                    }}>
                                        {candidate.faculty}
                                    </p>
                                </div>
                            )}

                            {candidate.slogan && (
                                <div style={{
                                    background: '#F8FAFC',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0'
                                }}>
                                    <h3 style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: '#64748B',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        margin: '0 0 8px 0'
                                    }}>
                                        Campaign Slogan
                                    </h3>
                                    <p style={{
                                        fontSize: '18px',
                                        fontStyle: 'italic',
                                        color: '#002F6C',
                                        margin: '0',
                                        fontWeight: '600'
                                    }}>
                                        "{candidate.slogan}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Manifesto */}
                        {candidate.manifesto && (
                            <div>
                                <h2 style={{
                                    fontSize: '28px',
                                    fontWeight: '800',
                                    color: 'black',
                                    margin: '0 0 20px 0'
                                }}>
                                    Manifesto
                                </h2>
                                <div style={{
                                    background: '#F8FAFC',
                                    padding: '32px',
                                    borderRadius: '16px',
                                    border: '1px solid #E2E8F0',
                                    lineHeight: '1.7'
                                }}>
                                    <p style={{
                                        fontSize: '18px',
                                        color: 'black',
                                        margin: '0',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {candidate.manifesto}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CandidateProfile;