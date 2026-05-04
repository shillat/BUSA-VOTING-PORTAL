import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, calendarAPI, utils } from './api';
import Footer from './Footer';
import AdminTopNavbar from './AdminTopNavbar';

const ManageElectionCalendar = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(authAPI.getCurrentUser());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        event_type: 'Registration',
        location: '',
        is_published: false
    });

    const eventTypes = ['Registration', 'Verification', 'Voting', 'Tally', 'Results', 'Other'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await calendarAPI.getAll();
            setEvents(data);
        } catch (err) {
            utils.showToast('Failed to load calendar events', true);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.event_date || !formData.event_type) {
            utils.showToast('⚠️ Please fill in all required fields', true);
            return;
        }

        try {
            if (editingId) {
                await calendarAPI.update(editingId, formData);
                utils.showToast('✓ Calendar event updated successfully', false);
            } else {
                await calendarAPI.create(formData);
                utils.showToast('✓ Calendar event created successfully', false);
            }

            setFormData({
                title: '',
                description: '',
                event_date: '',
                event_type: 'Registration',
                location: '',
                is_published: false
            });
            setEditingId(null);
            fetchEvents();
        } catch (err) {
            utils.showToast(err.message || 'Failed to save event', true);
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description || '',
            event_date: event.event_date.split('T')[0], // Format for datetime-local input
            event_type: event.event_type,
            location: event.location || '',
            is_published: event.is_published === 1
        });
        setEditingId(event.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await calendarAPI.delete(id);
                utils.showToast('✓ Calendar event deleted', false);
                fetchEvents();
            } catch (err) {
                utils.showToast('Failed to delete event', true);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            event_date: '',
            event_type: 'Registration',
            location: '',
            is_published: false
        });
        setEditingId(null);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="portal-container" style={{ width: '100%', maxWidth: '1280px', background: '#F3FAFF', minHeight: '100vh', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <AdminTopNavbar />

            <div className="dashboard-layout" style={{ display: 'flex', gap: '32px', padding: '28px 40px 32px 40px', flex: '1' }}>
                {/* Sidebar */}
                <div className="sidebar" style={{ width: '260px', flexShrink: '0', background: '#FFFFFF', borderRadius: '24px', padding: '20px 0', border: '1px solid #E2EAF2', height: 'fit-content' }}>
                    <div className="sidebar-header" style={{ padding: '0 20px 16px 20px', borderBottom: '1px solid #EEF3F8' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black', margin: 0 }}>Dashboard</h2>
                        <div className="sidebar-welcome" style={{ fontSize: '13px', color: 'black', marginTop: '6px' }}>Welcome Admin</div>
                    </div>
                    <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Dashboard</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/database'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Voter Database</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/elections'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Elections</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/candidates'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Manage Candidates</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/calendar'); }} className="sidebar-link active" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#002F6C', background: '#E8F0FE', borderLeft: '3px solid #002F6C' }}>Election Calendar</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/guidelines'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Guidelines</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/announcements'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Announcements</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/security'); }} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: 'black' }}>Security Log</a>
                        <a href="#" onClick={handleLogout} className="sidebar-link logout-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px 12px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', color: '#C62828', marginTop: '28px', borderTop: '1px solid #EEF3F8' }}>Logout</a>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'black', margin: '0 0 20px 0' }}>Election Calendar</h1>

                    {/* Form Section */}
                    <div className="form-card" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2EAF2', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'black', marginBottom: '20px' }}>{editingId ? 'Edit Event' : 'Add New Event'}</h3>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'black', display: 'block', marginBottom: '6px' }}>Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Voter Registration Opens"
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E9F2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'black', display: 'block', marginBottom: '6px' }}>Event Type *</label>
                                    <select
                                        name="event_type"
                                        value={formData.event_type}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E9F2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                                    >
                                        {eventTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'black', display: 'block', marginBottom: '6px' }}>Event Date *</label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        value={formData.event_date}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E9F2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'black', display: 'block', marginBottom: '6px' }}>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Main Hall, Online"
                                        style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E9F2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'black', display: 'block', marginBottom: '6px' }}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Additional details about the event..."
                                    rows="4"
                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E9F2', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleInputChange}
                                    id="publish_check"
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="publish_check" style={{ fontSize: '14px', fontWeight: '500', color: 'black', cursor: 'pointer' }}>Publish this event (visible to students)</label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        style={{ padding: '12px 28px', background: '#F0F4F9', border: '1px solid #E2E9F2', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    style={{ padding: '12px 28px', background: '#002F6C', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    {editingId ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Events List */}
                    <div className="events-list" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2EAF2', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'black', marginBottom: '20px' }}>Calendar Events</h3>

                        {loading ? (
                            <p style={{ color: 'black' }}>Loading events...</p>
                        ) : events.length === 0 ? (
                            <p style={{ color: 'black' }}>No calendar events created yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {events.map(event => (
                                    <div key={event.id} style={{ background: '#F8FAFE', border: '1px solid #E9EDF2', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: '1' }}>
                                            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'black', margin: '0 0 4px 0' }}>{event.title}</h4>
                                            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 6px 0' }}>
                                                <strong>{event.event_type}</strong> • {new Date(event.event_date).toLocaleDateString()} {event.location && `• ${event.location}`}
                                            </p>
                                            {event.description && <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>{event.description}</p>}
                                            <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: event.is_published ? '#E9F7EF' : '#FFF3E0', color: event.is_published ? '#1E7B48' : '#E65100' }}>
                                                {event.is_published ? '✓ Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                style={{ padding: '8px 16px', background: '#E3F2FD', border: '1px solid #90CAF9', color: '#002F6C', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                style={{ padding: '8px 16px', background: '#FFEBEE', border: '1px solid #EF9A9A', color: '#C62828', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ManageElectionCalendar;
