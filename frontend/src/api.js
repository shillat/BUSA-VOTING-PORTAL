// BUSA Voting System API Integration
// This file provides a centralized way to communicate with the backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // If body is FormData, don't set Content-Type (browser will do it with boundary)
  if (options.body && !(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Not JSON, probably HTML error
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server returned ${response.status} ${response.statusText}. The system might be under maintenance.`);
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  // Admin login
  adminLogin: async (adminId, password) => {
    const data = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ admin_id: adminId, password }),
    });

    // Clear any existing session data first
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('voterInfo');

    // Store token and admin info
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('adminInfo', JSON.stringify(data.admin));

    return data;
  },

  // Voter login
  voterLogin: async (regNo, voterId) => {
    const data = await apiRequest('/voter/login', {
      method: 'POST',
      body: JSON.stringify({ reg_no: regNo, voter_id: voterId }),
    });

    // Clear any existing session data first
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('voterInfo');

    // Store token and voter info
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('voterInfo', JSON.stringify(data.voter));

    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('voterInfo');
  },

  // Get current user info
  getCurrentUser: () => {
    const adminInfo = localStorage.getItem('adminInfo');
    const voterInfo = localStorage.getItem('voterInfo');

    if (adminInfo) {
      try {
        return { ...JSON.parse(adminInfo), type: 'admin' };
      } catch (e) {
        localStorage.removeItem('adminInfo');
      }
    }

    if (voterInfo) {
      try {
        return { ...JSON.parse(voterInfo), type: 'voter' };
      } catch (e) {
        localStorage.removeItem('voterInfo');
      }
    }
    return null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// Voter Registration APIs
export const voterAPI = {
  // Register new voter
  register: async (formData) => {
    let bodyData;
    if (formData instanceof FormData) {
      bodyData = formData;
    } else {
      bodyData = new FormData();
      Object.keys(formData).forEach(key => {
        bodyData.append(key, formData[key]);
      });
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      body: bodyData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  // Get pending registrations (admin only)
  getPendingRegistrations: async () => {
    return await apiRequest('/admin/verify');
  },

  // Approve registration (admin only)
  approveRegistration: async (id) => {
    return await apiRequest(`/admin/approve/${id}`, {
      method: 'POST',
    });
  },

  // Reject registration (admin only)
  rejectRegistration: async (id, reason) => {
    return await apiRequest(`/admin/reject/${id}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  // Check registration status
  checkStatus: async (regNo) => {
    return await apiRequest(`/voter/status/${encodeURIComponent(regNo)}`);
  },
  // Get personal security logs
  getSecurityLogs: async () => {
    return await apiRequest('/voter/security-logs');
  }
};

// Election Management APIs
export const electionAPI = {
  // Create new election (admin only)
  create: async (electionData) => {
    return await apiRequest('/elections', {
      method: 'POST',
      body: JSON.stringify(electionData),
    });
  },

  // Get all elections
  getAll: async () => {
    return await apiRequest('/elections');
  },

  // Get active elections
  getActive: async () => {
    return await apiRequest('/elections/active');
  },

  // Update election status (admin only)
  updateStatus: async (id, status) => {
    return await apiRequest(`/elections/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get election results
  getResults: async (id) => {
    return await apiRequest(`/elections/${id}/results`);
  },

  // Get live tally
  getLiveTally: async (id) => {
    return await apiRequest(`/elections/${id}/live-tally`);
  },
  // Get global tally stats
  getGlobalTally: async () => {
    return await apiRequest('/global-tally');
  },

  // Delete election (admin only)
  delete: async (id) => {
    return await apiRequest(`/elections/${id}`, {
      method: 'DELETE',
    });
  },
};

// Candidate Management APIs
export const candidateAPI = {
  // Get all candidates across all elections
  getAll: async () => {
    return await apiRequest('/candidates');
  },

  // Get single candidate by ID
  getById: async (id) => {
    return await apiRequest(`/candidates/${id}`);
  },

  // Add candidate to election (admin only)
  create: async (candidateData) => {
    // If candidateData is FormData, we need to extract election_id
    let electionId;
    if (candidateData instanceof FormData) {
      electionId = candidateData.get('election_id');
    } else {
      electionId = candidateData.election_id;
    }

    return await apiRequest(`/elections/${electionId}/candidates`, {
      method: 'POST',
      body: candidateData,
    });
  },

  // Get candidates for election
  getByElection: async (electionId) => {
    return await apiRequest(`/elections/${electionId}/candidates`);
  },

  // Update candidate (admin only)
  update: async (id, candidateData) => {
    return await apiRequest(`/candidates/${id}`, {
      method: 'PUT',
      body: candidateData,
    });
  },

  // Delete candidate (admin only)
  delete: async (id) => {
    return await apiRequest(`/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Voting APIs
export const votingAPI = {
  // Cast vote
  castVote: async (electionId, candidateId) => {
    return await apiRequest('/vote', {
      method: 'POST',
      body: JSON.stringify({ election_id: electionId, candidate_id: candidateId }),
    });
  },

  // Check if voter has already voted in election
  hasVoted: async (electionId) => {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser || currentUser.type !== 'voter') {
        return false;
      }

      // This would require a new backend endpoint to check voting status
      // For now, we'll assume the backend handles this check during voting
      return false;
    } catch (error) {
      return false;
    }
  },
};

// Ratings and Reviews APIs
export const ratingsAPI = {
  // Submit rating
  submitRating: async (rating, feedback) => {
    return await apiRequest('/ratings', {
      method: 'POST',
      body: JSON.stringify({ rating, feedback }),
    });
  },

  // Submit review
  submitReview: async (electionId, candidateId, reviewText) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({ 
        election_id: electionId, 
        candidate_id: candidateId, 
        review_text: reviewText 
      }),
    });
  },
};

// Admin Dashboard APIs
export const adminAPI = {
  // Get all voters
  getVoters: async () => {
    return await apiRequest('/admin/voters');
  },

  // Get voter statistics
  getVoterStats: async () => {
    return await apiRequest('/admin/voter-stats');
  },

  // Get security logs
  getSecurityLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/admin/security-logs?${params}`);
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    return await apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  // Get ratings statistics
  getRatingsStats: async () => {
    return await apiRequest('/admin/ratings-stats');
  },

  // Get recent reviews
  getRecentReviews: async () => {
    return await apiRequest('/admin/recent-reviews');
  },

  // Download voters PDF
  downloadVotersPDF: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/voters-pdf`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download PDF');
    }

    return response.blob();
  },
};

// Public APIs
export const publicAPI = {
  // Get announcements
  getAnnouncements: async () => {
    return await apiRequest('/announcements');
  },
};

// Guidelines API
export const guidelineAPI = {
  getAll: async (published = null) => {
    let endpoint = '/guidelines';
    if (published !== null) {
      endpoint += `?published=${published}`;
    }
    return await apiRequest(endpoint);
  },
  create: async (data) => {
    return await apiRequest('/admin/guidelines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id, data) => {
    return await apiRequest(`/admin/guidelines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id) => {
    return await apiRequest(`/admin/guidelines/${id}`, {
      method: 'DELETE',
    });
  }
};

// Election Calendar API
export const calendarAPI = {
  getAll: async (published = null) => {
    let endpoint = '/calendar';
    if (published !== null) {
      endpoint += `?published=${published}`;
    }
    return await apiRequest(endpoint);
  },
  create: async (data) => {
    return await apiRequest('/admin/calendar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id, data) => {
    return await apiRequest(`/admin/calendar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id) => {
    return await apiRequest(`/admin/calendar/${id}`, {
      method: 'DELETE',
    });
  }
};

// Announcement APIs (Unified)
export const announcementAPI = {
  getAll: async () => {
    return await apiRequest('/announcements');
  },
  create: async (data) => {
    return await apiRequest('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  delete: async (id) => {
    return await apiRequest(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  }
};

// Utility functions
export const utils = {
  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleString();
  },

  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
  },

  // Validate registration number format
  validateRegNumber: (regNo) => {
    const regex = /^\d{2}\/[A-Z0-9]{2,5}\/[A-Z]{2,4}\/[A-Z0-9]{1,3}\/\w{2,10}$/i;
    return regex.test(regNo.trim());
  },

  // Show toast message (for frontend integration)
  showToast: (message, isError = false) => {
    // This would integrate with your existing toast system
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#B13E3E' : '#1E5A3C';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '60px';
    toast.style.fontSize = '14px';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '1000';
    toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },
};

export default {
  authAPI,
  voterAPI,
  electionAPI,
  candidateAPI,
  votingAPI,
  ratingsAPI,
  adminAPI,
  publicAPI,
  announcementAPI,
  guidelineAPI,
  calendarAPI,
  utils,
};
