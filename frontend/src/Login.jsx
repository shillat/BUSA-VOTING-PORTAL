import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { authAPI, utils } from './api';
import Navbar from './Navbar';
import Footer from './Footer';
import busaLogo from './assets/busaLogo.jpg';

const Login = () => {
  const [loginType, setLoginType] = useState('voter');
  const [formData, setFormData] = useState({
    adminId: '',
    regNo: '',
    password: '',
    voterId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Detect admin login from URL
  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setLoginType('admin');
    } else {
      setLoginType('voter');
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginType === 'admin') {
        await authAPI.adminLogin(formData.adminId, formData.password);
        utils.showToast('Admin login successful', false);
        navigate('/admin/dashboard');
      } else {
        await authAPI.voterLogin(formData.regNo, formData.voterId);
        utils.showToast('Voter login successful', false);
        navigate('/voter/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      utils.showToast(err.message || 'Login failed', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '80px 0' }}>
        <div className="card" style={{ width: '480px', maxWidth: '100%', textAlign: 'center', padding: '40px' }}>
          <div style={{
            margin: '0 auto 20px',
            textAlign: 'center'
          }}>
            <img
              src={busaLogo}
              alt="BUSA Logo"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                objectFit: 'contain'
              }}
            />
          </div>

          <h2 style={{ fontSize: '24px', color: 'black', marginBottom: '30px', fontWeight: '800' }}>
            {loginType === 'admin' ? 'ADMIN LOGIN' : 'VOTER LOGIN'}
          </h2>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            {loginType === 'admin' ? (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', fontSize: '18px', color: 'black', marginBottom: '8px' }}>
                  ADMIN ID
                </label>
                <input
                  type="text"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleChange}
                  placeholder="Enter your Admin ID"
                  required
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '18px', color: 'black', marginBottom: '8px' }}>
                    REGISTRATION NUMBER
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="24/XXX/BU/X/XXXX"
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '18px', color: 'black', marginBottom: '8px' }}>
                    VOTER ID
                  </label>
                  <input
                    type="text"
                    name="voterId"
                    value={formData.voterId}
                    onChange={handleChange}
                    placeholder="Enter your unique Voter ID (e.g. VID-XXXXXX)"
                    required
                  />
                </div>
              </>
            )}

            {loginType === 'admin' && (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '18px', color: 'black', marginBottom: '8px' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div style={{ textAlign: 'right', marginBottom: '30px' }}>
                  <a href="#" style={{ color: '#002F6C', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
                    Forgotten Password?
                  </a>
                </div>
              </>
            )}

            {error && (
              <div style={{
                color: '#B13E3E',
                backgroundColor: '#FEE',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #FCC',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '0',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          {loginType === 'voter' && (
            <p style={{ marginTop: '25px', fontSize: '14px', color: 'black' }}>
              Not registered yet? <Link to="/register" style={{ color: '#002F6C', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
