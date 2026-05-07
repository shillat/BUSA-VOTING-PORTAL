import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const url = editingStudent ? `/api/students/${editingStudent.reg_no}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
        resetForm();
        fetchStudents();
      } else {
        alert(result.error || 'Operation failed');
      }
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
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/students/${regNo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Student deleted successfully!');
        fetchStudents();
      } else {
        alert(result.error || 'Delete failed');
      }
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
          align-items: center;
          margin-bottom: 32px;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1A2C3E;
          margin: 0;
        }
        
        .add-student-btn {
          background: #002F6C;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .add-student-btn:hover {
          background: #003D8F;
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
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Manage University Students</h1>
            <button className="add-student-btn" onClick={() => setShowAddForm(true)}>
              + Add New Student
            </button>
          </div>

          {/* Students Grid */}
          {students.length === 0 ? (
            <div className="empty-state">
              <h3>No students found</h3>
              <p>Add your first university student to get started</p>
            </div>
          ) : (
            <div className="students-grid">
              {students.map((student) => (
                <div key={student.reg_no} className="student-card">
                  <div className="student-header">
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p><strong>Reg No:</strong> {student.reg_no}</p>
                      <p><strong>Email:</strong> {student.email}</p>
                      <p><strong>Campus:</strong> {student.campus}</p>
                      <p><strong>Graduation Year:</strong> {student.expected_grad_year}</p>
                      {student.department && <p><strong>Department:</strong> {student.department}</p>}
                    </div>
                    <div className="student-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(student)}>
                        Edit
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(student.reg_no)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className={`student-type ${student.type === 'Regular' ? 'type-regular' : 'type-in-service'}`}>
                    {student.type}
                  </div>
                </div>
              ))}
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
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                  />
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
