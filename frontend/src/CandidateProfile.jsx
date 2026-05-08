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
        // Use placeholder data directly instead of API calls
        const placeholderCandidates = [
            {
                id: 1,
                name: "ABRAHAM OKOCH",
                position: "President",
                faculty: "General",
                slogan: "Leadership That Delivers",
                photo_url: "/uploads/ABRAHAM OKOCH.png",
                manifesto: "As your President, I will focus on three key areas: Academic Excellence, Student Welfare, and Infrastructure Development. My vision is to create a supportive environment where every student can thrive academically and personally. I will work closely with university administration to ensure student concerns are addressed promptly and effectively.",
                achievements: "Led multiple student initiatives, organized community service programs, maintained excellent academic standing throughout university career.",
                email: "abraham.okoch@busa.edu",
                phone: "+256 785 123 456"
            },
            {
                id: 2,
                name: "FUBI JOVIA",
                position: "President",
                faculty: "General",
                slogan: "Together We Rise",
                photo_url: "/uploads/FUBI JOVIA.png",
                manifesto: "My presidency will be built on the foundation of unity, progress, and innovation. I believe in empowering every student voice and creating opportunities for growth. Together, we can transform BUSA into a model student union that serves the diverse needs of our student body.",
                achievements: "Student Representative for 2 years, organized leadership workshops, recipient of Student Service Award.",
                email: "fubi.jovia@busa.edu",
                phone: "+256 785 123 457"
            },
            {
                id: 3,
                name: "LUZZE LINUS",
                position: "MP - Faculty of Science and Technology",
                faculty: "Science and Technology",
                slogan: "Innovation Through Science",
                photo_url: "/uploads/LUZZE LINUS.jpg",
                manifesto: "As your Faculty MP, I will champion science education, research opportunities, and technological advancement. I will work to secure better lab facilities, research funding, and industry partnerships that benefit all Science and Technology students.",
                achievements: "Research Assistant in Computer Science Department, winner of Innovation Challenge 2025, peer tutor for 3 years.",
                email: "luzze.linus@busa.edu",
                phone: "+256 785 123 458"
            },
            {
                id: 4,
                name: "NAKAMYA BELINDA",
                position: "MP - Faculty of Science and Technology",
                faculty: "Science and Technology",
                slogan: "Science For Progress",
                photo_url: "/uploads/NAKAMYA BELINDA.png",
                manifesto: "I am committed to advancing scientific excellence and ensuring that Science and Technology students have access to cutting-edge resources and opportunities. My focus will be on curriculum improvement, research support, and career development programs.",
                achievements: "Dean's List for 4 semesters, President of Science Club, organized annual Science Fair.",
                email: "nakamya.belinda@busa.edu",
                phone: "+256 785 123 459"
            },
            {
                id: 5,
                name: "OKELLO PETER",
                position: "MP - Eastern Region",
                faculty: "Regional Representation",
                slogan: "Eastern Unity, Eastern Pride",
                photo_url: "/uploads/OKELLO PETER.png",
                manifesto: "As your Eastern Region MP, I will ensure that our regional students receive fair representation and access to resources. I will advocate for regional development initiatives, cultural events, and support systems that celebrate our diversity.",
                achievements: "Regional Student Coordinator, organized cultural exchange programs, community development volunteer.",
                email: "okello.peter@busa.edu",
                phone: "+256 785 123 460"
            },
            {
                id: 6,
                name: "SHILLAH NAIGAGA",
                position: "MP - Eastern Region",
                faculty: "Regional Representation",
                slogan: "Service With Excellence",
                photo_url: "/uploads/SHILLAH NAIGAGA.jpg",
                manifesto: "I am dedicated to serving the Eastern Region with excellence and integrity. My focus will be on improving communication between regional students and the union, addressing regional-specific concerns, and creating programs that support our regional student community.",
                achievements: "Student Ambassador, peer mentor, recipient of Community Service Award 2025.",
                email: "shillah.naigaga@busa.edu",
                phone: "+256 785 123 461"
            }
        ];

        const candidateData = placeholderCandidates.find(c => c.id === parseInt(id));
        
        if (candidateData) {
            setCandidate(candidateData);
        } else {
            setError('Candidate not found');
        }
        
        setLoading(false);
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
            <style jsx>{`
                @media (max-width: 768px) {
                    .profile-container {
                        padding: 16px !important;
                    }
                    .profile-grid {
                        grid-template-columns: 1fr !important;
                        gap: 24px !important;
                        padding: 24px !important;
                    }
                    .candidate-photo {
                        width: 100% !important;
                        max-width: 300px !important;
                        height: 350px !important;
                        margin: 0 auto !important;
                    }
                    .candidate-name {
                        font-size: 32px !important;
                    }
                    .candidate-position {
                        font-size: 20px !important;
                    }
                    .details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .manifesto-section {
                        padding: 20px !important;
                    }
                }
                @media (max-width: 480px) {
                    .profile-container {
                        padding: 12px !important;
                    }
                    .profile-grid {
                        padding: 16px !important;
                        gap: 20px !important;
                    }
                    .candidate-photo {
                        height: 280px !important;
                    }
                    .candidate-name {
                        font-size: 24px !important;
                    }
                    .candidate-position {
                        font-size: 18px !important;
                    }
                    .manifesto-section {
                        padding: 16px !important;
                    }
                }
            `}</style>

            {/* Back Button */}
            <div className="profile-container" style={{ padding: '20px 48px 0 48px' }}>
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
            <div className="profile-container" style={{ padding: '20px 48px' }}>
                <div className="profile-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                                className="candidate-photo"
                                src={`https://busa-voting-portal.onrender.com${candidate.photo_url}`}
                                alt={candidate.name}
                                style={{
                                    width: '100%',
                                    maxWidth: '320px',
                                    height: '400px',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    borderRadius: '24px',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="candidate-photo" style={{
                                width: '100%',
                                maxWidth: '320px',
                                height: '400px',
                                background: 'linear-gradient(135deg, #002F6C 0%, #1A4A7A 100%)',
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '96px',
                                fontWeight: '800',
                                color: 'white',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                margin: '0 auto'
                            }}>
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <div style={{ marginBottom: '32px' }}>
                            <h1 className="candidate-name" style={{
                                fontSize: '48px',
                                fontWeight: '800',
                                color: 'black',
                                margin: '0 0 8px 0',
                                letterSpacing: '-1px',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto',
                                maxWidth: '100%'
                            }}>
                                {candidate.name}
                            </h1>
                            <p className="candidate-position" style={{
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
                        <div className="details-grid" style={{
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
                                <div className="manifesto-section" style={{
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