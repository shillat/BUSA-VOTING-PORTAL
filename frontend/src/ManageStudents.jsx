import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    reg_no: '',
    name: '',
    email: '',
    type: 'Regular',
    is_registered_sem: false,
    expected_grad_year: '',
    campus: 'main',
    department: ''
  });

  useEffect(() => {
    // Use placeholder data instead of API call
    const placeholderStudents = [
      {
        reg_no: '24/BCC/BU/R/0001',
        name: 'John Smith',
        email: 'john.smith@busa.edu',
        type: 'Regular',
        is_registered_sem: true,
        expected_grad_year: 2028,
        campus: 'main',
        department: 'CI'
      },
      {
        reg_no: '24/BED/BU/R/0002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@busa.edu',
        type: 'Regular',
        is_registered_sem: true,
        expected_grad_year: 2027,
        campus: 'main',
        department: 'EDA'
      },
      {
        reg_no: '23/BBA/BU/I/0003',
        name: 'Michael Brown',
        email: 'michael.brown@busa.edu',
        type: 'In-service',
        is_registered_sem: false,
        expected_grad_year: 2026,
        campus: 'kampala',
        department: 'Business'
      }
    ];
    
    setStudents(placeholderStudents);
    setFilteredStudents(placeholderStudents);
    setLoading(false);
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.reg_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Placeholder functionality - simulate adding/editing without API calls
    try {
      if (editingStudent) {
        // Update existing student
        setStudents(prev => prev.map(student => 
          student.reg_no === editingStudent.reg_no 
            ? { ...formData, reg_no: editingStudent.reg_no }
            : student
        ));
        alert('Voter updated successfully!');
      } else {
        // Add new student
        const newStudent = { ...formData, reg_no: formData.reg_no };
        setStudents(prev => [...prev, newStudent]);
        alert('Voter added successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      reg_no: student.reg_no,
      name: student.name,
      email: student.email,
      type: student.type,
      is_registered_sem: student.is_registered_sem,
      expected_grad_year: student.expected_grad_year,
      campus: student.campus,
      department: student.department || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (regNo) => {
    if (!confirm('Are you sure you want to delete this voter?')) return;
    
    // Placeholder functionality - simulate deletion without API calls
    try {
      setStudents(prev => prev.filter(student => student.reg_no !== regNo));
      alert('Voter deleted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      reg_no: '',
      name: '',
      email: '',
      type: 'Regular',
      is_registered_sem: false,
      expected_grad_year: '',
      campus: 'main',
      department: ''
    });
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading students...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .manage-students-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
        }
        
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 48px 20px 48px;
          border-bottom: 1px solid #EFF3F8;
          background: white;
        }
        
        .logo-area {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .portal-title {
          font-weight: 700;
          font-size: 20px;
          letter-spacing: -0.3px;
          color: #0B2B44;
          background: #F8FAFE;
          padding: 6px 20px;
          border-radius: 40px;
        }
        
        .back-link {
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 500;
          color: #2A6F8F;
          border-bottom: 1px dashed #B9D4E3;
          padding-bottom: 2px;
          cursor: pointer;
        }
        
        .main-content {
          padding: 40px 48px 60px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 32px 48px 24px 48px;
          gap: 24px;
        }
        
        .page-header > div {
          flex: 1;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #1A2C3E;
          margin: 0 0 16px 0;
        }
        
        .search-container {
          position: relative;
          max-width: 400px;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 45px;
          border: 2px solid #E2E9F2;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          border-color: #002F6C;
          box-shadow: 0 0 0 3px rgba(0, 47, 108, 0.1);
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #64748B;
        }
        
        .add-student-btn {
          background: #002F6C;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .add-student-btn:hover {
          background: #0A4175;
          transform: translateY(-2px);
        }
        
        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          margin: 0 48px 48px 48px;
        }
        
        .voters-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .voters-table th {
          background: #F8FAFE;
          padding: 16px;
          text-align: left;
          font-weight: 700;
          font-size: 14px;
          color: #1A2C3E;
          border-bottom: 2px solid #EDF2F7;
        }
        
        .voters-table td {
          padding: 16px;
          border-bottom: 1px solid #F0F4F9;
          font-size: 14px;
          color: #374151;
        }
        
        .voters-table tbody tr:hover {
          background: #F8FAFE;
        }
        
        .voters-table tbody tr:last-child td {
          border-bottom: none;
        }
        
        .type-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        
        .type-regular {
          background: #E8F0FE;
          color: #002F6C;
        }
        
        .type-in-service {
          background: #FEF3C7;
          color: #92400E;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .edit-btn {
          background: #002F6C;
          color: white;
        }
        
        .edit-btn:hover {
          background: #0A4175;
        }
        
        .delete-btn {
          background: #DC2626;
          color: white;
        }
        
        .delete-btn:hover {
          background: #B91C1C;
        }
        
        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        
        .student-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #E8EDF4;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .student-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .student-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        
        .student-info h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1A2C3E;
          margin: 0 0 8px 0;
        }
        
        .student-info p {
          font-size: 14px;
          color: #64748B;
          margin: 4px 0;
        }
        
        .student-type {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .type-regular {
          background: #E8F5E9;
          color: #2E7D32;
        }
        
        .type-in-service {
          background: #FFF3E0;
          color: #F57C00;
        }
        
        .student-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .edit-btn {
          background: #EFF3F8;
          color: #2A6F8F;
        }
        
        .edit-btn:hover {
          background: #E2E8F0;
        }
        
        .delete-btn {
          background: #FFEBEE;
          color: #D32F2F;
        }
        
        .delete-btn:hover {
          background: #FFCDD2;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1A2C3E;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748B;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .close-btn:hover {
          background: #F1F5F9;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #002F6C;
          box-shadow: 0 0 0 3px rgba(0, 47, 108, 0.1);
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .checkbox-group input[type="checkbox"] {
          width: auto;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        
        .btn-submit {
          background: #002F6C;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        
        .btn-cancel {
          background: #F1F5F9;
          color: #64748B;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-state h3 {
          font-size: 24px;
          color: #64748B;
          margin-bottom: 12px;
        }
        
        .empty-state p {
          font-size: 16px;
          color: #94A3B8;
        }
        
        @media (max-width: 768px) {
          .top-header {
            padding: 20px 24px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .main-content {
            padding: 32px 24px;
          }
          
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .students-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .student-card {
            padding: 20px;
          }
          
          .modal-content {
            padding: 24px;
            margin: 20px;
          }
        }
      `}</style>

      <div className="manage-students-container">
        {/* Header */}
        <div className="top-header">
          <div className="logo-area">
            <LogoMark size={48} radius={14} />
            <div className="portal-title">BUSA ONLINE VOTING PORTAL</div>
          </div>
          <button className="back-link" onClick={() => navigate('/admin-dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Page Header with Search and Add Button */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Voters</h1>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by name, registration number, email, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon">🔍</div>
              </div>
            </div>
            <button className="add-student-btn" onClick={() => setShowAddForm(true)}>
              + Add New Voter
            </button>
          </div>

          {/* Students Table */}
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <h3>{searchTerm ? 'No voters found matching your search' : 'No voters found'}</h3>
              <p>{searchTerm ? 'Try adjusting your search terms' : 'Add your first voter to get started'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="voters-table">
                <thead>
                  <tr>
                    <th>Registration Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Campus</th>
                    <th>Department</th>
                    <th>Graduation Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.reg_no}>
                      <td>{student.reg_no}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`type-badge ${student.type === 'Regular' ? 'type-regular' : 'type-in-service'}`}>
                          {student.type}
                        </span>
                      </td>
                      <td>{student.campus}</td>
                      <td>{student.department || '-'}</td>
                      <td>{student.expected_grad_year}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit-btn" onClick={() => handleEdit(student)}>
                            Edit
                          </button>
                          <button className="action-btn delete-btn" onClick={() => handleDelete(student.reg_no)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Student Modal */}
        {showAddForm && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Registration Number *</label>
                  <input
                    type="text"
                    name="reg_no"
                    value={formData.reg_no}
                    onChange={handleInputChange}
                    placeholder="e.g., 25/BSE/BU/R/0010"
                    required
                    disabled={!!editingStudent}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Student's full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@busa.edu"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Student Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="Regular">Regular</option>
                    <option value="In-Service">In-Service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Expected Graduation Year *</label>
                  <input
                    type="number"
                    name="expected_grad_year"
                    value={formData.expected_grad_year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2028"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Campus *</label>
                  <select name="campus" value={formData.campus} onChange={handleInputChange} required>
                    <option value="main">Main Campus</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department *</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} required>
                    <option value="">Select Department</option>
                    <option value="CI">Computing And Informatics</option>
                    <option value="Business">Business Administration</option>
                    <option value="RS">Religious Studies</option>
                    <option value="EDS">Education In Sciences</option>
                    <option value="EDA">Education In Arts</option>
                    <option value="Health">Health Sciences</option>
                    <option value="NaturalSciences">Natural Sciences</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      name="is_registered_sem"
                      checked={formData.is_registered_sem}
                      onChange={handleInputChange}
                    />
                    <label>Registered for Current Semester</label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageStudents;
