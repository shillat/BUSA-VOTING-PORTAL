import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Download,
  FileUp,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react';
import AdminTopNavbar from './AdminTopNavbar';
import Footer from './Footer';
import { studentAPI, utils } from './api';

const emptyStudent = {
  reg_no: '',
  name: '',
  email: '',
  type: 'Regular',
  is_registered_sem: true,
  expected_grad_year: '',
  campus: 'main',
  department: ''
};

const departments = [
  ['CI', 'Computing and Informatics'],
  ['Business', 'Business Administration'],
  ['RS', 'Religious Studies'],
  ['EDS', 'Education in Sciences'],
  ['EDA', 'Education in Arts'],
  ['Health', 'Health Sciences'],
  ['NaturalSciences', 'Natural Sciences']
];

const normalizeStudent = (student) => ({
  ...student,
  is_registered_sem: student.is_registered_sem === true || student.is_registered_sem === 1
});

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
};

const parseStudentCsv = (text) => {
  const rows = text.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
  if (rows.length < 2) return [];

  const headers = parseCsvLine(rows[0]).map((header) => header.toLowerCase().trim());
  return rows.slice(1).map((row) => {
    const values = parseCsvLine(row);
    const item = {};

    headers.forEach((header, index) => {
      item[header] = values[index] || '';
    });

    return {
      reg_no: item.reg_no || item.registration_number || item.registration_no || item.regno,
      name: item.name || item.full_name || item.student_name,
      email: item.email || item.email_address,
      type: item.type || item.student_type || 'Regular',
      is_registered_sem: item.is_registered_sem || item.registered || item.registered_current_semester || item.current_semester,
      expected_grad_year: item.expected_grad_year || item.graduation_year || item.year_of_study,
      campus: item.campus || 'main',
      department: item.department || item.faculty || ''
    };
  });
};

const ManageStudents = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(emptyStudent);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getAll();
      setStudents(data.map(normalizeStudent));
    } catch (error) {
      utils.showToast(error.message || 'Failed to load admin student list', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch = !term || [
        student.reg_no,
        student.name,
        student.email,
        student.type,
        student.campus,
        student.department
      ].some((value) => String(value || '').toLowerCase().includes(term));

      const matchesType = typeFilter === 'all' || student.type === typeFilter;
      const matchesStatus = statusFilter === 'all'
        || (statusFilter === 'registered' && student.is_registered_sem)
        || (statusFilter === 'not_registered' && !student.is_registered_sem);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [students, searchTerm, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: students.length,
    regular: students.filter((student) => student.type === 'Regular').length,
    inService: students.filter((student) => student.type === 'In-Service').length,
    registered: students.filter((student) => student.is_registered_sem).length
  }), [students]);

  const openCreateForm = () => {
    setEditingStudent(null);
    setFormData(emptyStudent);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingStudent(student);
    setFormData({
      reg_no: student.reg_no,
      name: student.name,
      email: student.email,
      type: student.type,
      is_registered_sem: !!student.is_registered_sem,
      expected_grad_year: student.expected_grad_year || '',
      campus: student.campus || 'main',
      department: student.department || ''
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormData(emptyStudent);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.reg_no, formData);
        utils.showToast('Student record updated', false);
      } else {
        await studentAPI.create(formData);
        utils.showToast('Student added to the validation list', false);
      }

      closeForm();
      await fetchStudents();
    } catch (error) {
      utils.showToast(error.message || 'Could not save student record', true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    if (!confirm(`Remove ${student.name} from the admin validation list?`)) return;

    try {
      await studentAPI.delete(student.reg_no);
      utils.showToast('Student removed from admin list', false);
      await fetchStudents();
    } catch (error) {
      utils.showToast(error.message || 'Could not delete student', true);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      const parsed = parseStudentCsv(text);

      if (parsed.length === 0) {
        throw new Error('The CSV needs a header row and at least one student row.');
      }

      const response = await studentAPI.bulkImport(parsed);
      utils.showToast(response.message || 'Student list imported', false);
      await fetchStudents();
    } catch (error) {
      utils.showToast(error.message || 'Could not import CSV list', true);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = [
      'reg_no,name,email,type,is_registered_sem,expected_grad_year,campus,department',
      '24/BSE/BU/R/0008,Atukwatse Blessing,student@example.com,Regular,true,2027,main,CI',
      '24/BTH/BU/H/0003,Naigaga Shillah,student2@example.com,In-Service,false,2027,virtual,RS'
    ].join('\n');
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'busa-student-list-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="portal-container student-admin-page">
      <style>{`
        .student-admin-page {
          width: 100%;
          max-width: 1280px;
          min-height: 100vh;
          margin: 0 auto;
          background: #F5F8FB;
          font-family: 'Inter', sans-serif;
        }

        .student-admin-shell {
          padding: 28px 40px 40px;
        }

        .student-admin-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .student-admin-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #0B5C79;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .student-admin-heading h1 {
          margin: 0;
          color: #102033;
          font-size: 30px;
          font-weight: 850;
        }

        .student-admin-heading p {
          margin: 8px 0 0;
          color: #516173;
          max-width: 720px;
          line-height: 1.55;
          font-size: 14px;
        }

        .student-action-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .student-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #D8E2EC;
          background: #FFFFFF;
          color: #102033;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .student-btn:hover {
          border-color: #8FB0C5;
          transform: translateY(-1px);
        }

        .student-btn-primary {
          background: #003B73;
          border-color: #003B73;
          color: #FFFFFF;
        }

        .student-btn-danger {
          color: #B42318;
          background: #FFF7F6;
          border-color: #FED7D2;
        }

        .student-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
        }

        .student-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .student-stat {
          background: #FFFFFF;
          border: 1px solid #DFE8F1;
          border-radius: 8px;
          padding: 16px;
        }

        .student-stat span {
          color: #607086;
          font-size: 12px;
          font-weight: 750;
        }

        .student-stat strong {
          display: block;
          margin-top: 6px;
          color: #12263A;
          font-size: 28px;
          line-height: 1;
        }

        .student-toolbar {
          display: grid;
          grid-template-columns: minmax(280px, 1fr) 170px 190px auto;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #DFE8F1;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 18px;
          align-items: center;
        }

        .student-search {
          position: relative;
        }

        .student-search svg {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #607086;
        }

        .student-search input,
        .student-toolbar select,
        .student-form-field input,
        .student-form-field select {
          width: 100%;
          min-height: 42px;
          border: 1px solid #D8E2EC;
          border-radius: 8px;
          background: #FFFFFF;
          color: #12263A;
          font-size: 14px;
          padding: 0 12px;
        }

        .student-search input {
          padding-left: 40px;
        }

        .student-upload-panel {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
          background: #EBF5FA;
          border: 1px solid #CDE2EC;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 18px;
        }

        .student-upload-panel h2 {
          margin: 0 0 4px;
          color: #102033;
          font-size: 16px;
        }

        .student-upload-panel p {
          margin: 0;
          color: #516173;
          font-size: 13px;
          line-height: 1.45;
        }

        .student-table-wrap {
          background: #FFFFFF;
          border: 1px solid #DFE8F1;
          border-radius: 8px;
          overflow: auto;
        }

        .student-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
        }

        .student-table th {
          background: #F7FAFD;
          color: #4B5F73;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0;
          text-align: left;
          text-transform: uppercase;
          padding: 12px 14px;
          border-bottom: 1px solid #DFE8F1;
        }

        .student-table td {
          padding: 14px;
          border-bottom: 1px solid #EDF2F7;
          color: #203244;
          font-size: 13px;
          vertical-align: middle;
        }

        .student-table tr:last-child td {
          border-bottom: none;
        }

        .student-name-cell strong {
          display: block;
          color: #12263A;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .student-name-cell span {
          color: #66788A;
          font-size: 12px;
        }

        .student-chip {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          border-radius: 999px;
          padding: 0 10px;
          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;
        }

        .student-chip-regular {
          background: #E7F4EE;
          color: #146C43;
        }

        .student-chip-service {
          background: #FFF1D8;
          color: #9A5B00;
        }

        .student-chip-registered {
          background: #E7F4EE;
          color: #146C43;
        }

        .student-chip-not-registered {
          background: #FDECEC;
          color: #B42318;
        }

        .student-table-actions {
          display: flex;
          gap: 8px;
        }

        .student-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid #D8E2EC;
          border-radius: 8px;
          background: #FFFFFF;
          color: #28445D;
          cursor: pointer;
        }

        .student-icon-btn-danger {
          color: #B42318;
          border-color: #FED7D2;
          background: #FFF7F6;
        }

        .student-empty {
          padding: 56px 24px;
          text-align: center;
          color: #607086;
        }

        .student-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 24, 38, 0.52);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 1000;
        }

        .student-modal {
          width: min(760px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #FFFFFF;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(8, 18, 31, 0.24);
        }

        .student-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          padding: 22px 24px;
          border-bottom: 1px solid #E6EDF4;
        }

        .student-modal-header h2 {
          margin: 0;
          color: #102033;
          font-size: 20px;
        }

        .student-modal-header p {
          margin: 5px 0 0;
          color: #66788A;
          font-size: 13px;
        }

        .student-form {
          padding: 24px;
        }

        .student-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .student-form-field label {
          display: block;
          margin-bottom: 7px;
          color: #34485B;
          font-size: 12px;
          font-weight: 800;
        }

        .student-form-check {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding: 13px 14px;
          border: 1px solid #D8E2EC;
          border-radius: 8px;
          background: #F8FBFD;
        }

        .student-form-check input {
          width: 18px;
          height: 18px;
        }

        .student-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 22px;
        }

        @media (max-width: 900px) {
          .student-admin-shell {
            padding: 20px 16px 28px;
          }

          .student-admin-heading,
          .student-upload-panel {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: stretch;
          }

          .student-action-row {
            justify-content: flex-start;
          }

          .student-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .student-toolbar {
            grid-template-columns: 1fr;
          }

          .student-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminTopNavbar />

      <main className="student-admin-shell">
        <section className="student-admin-heading">
          <div>
            <div className="student-admin-kicker">
              <Database size={16} />
              Admin student master list
            </div>
            <h1>Manage Voter Eligibility</h1>
            <p>
              Upload or maintain the official student list here. The voter registration validator checks this admin-managed list before approving a student.
            </p>
          </div>
          <div className="student-action-row">
            <button className="student-btn" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <button className="student-btn student-btn-primary" onClick={openCreateForm}>
              <Plus size={16} />
              Add Student
            </button>
          </div>
        </section>

        <section className="student-stats-grid" aria-label="Student list summary">
          <div className="student-stat"><span>Total on admin list</span><strong>{stats.total}</strong></div>
          <div className="student-stat"><span>Regular students</span><strong>{stats.regular}</strong></div>
          <div className="student-stat"><span>In-service students</span><strong>{stats.inService}</strong></div>
          <div className="student-stat"><span>Current semester</span><strong>{stats.registered}</strong></div>
        </section>

        <section className="student-upload-panel">
          <UploadCloud size={34} color="#0B5C79" />
          <div>
            <h2>Upload student list</h2>
            <p>Use CSV columns: reg_no, name, email, type, is_registered_sem, expected_grad_year, campus, department. Existing registration numbers are updated.</p>
          </div>
          <div className="student-action-row">
            <button className="student-btn" onClick={downloadTemplate}>
              <Download size={16} />
              Template
            </button>
            <button className="student-btn student-btn-primary" onClick={() => fileInputRef.current?.click()} disabled={importing}>
              <FileUp size={16} />
              {importing ? 'Importing...' : 'Import CSV'}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleCsvUpload} hidden />
          </div>
        </section>

        <section className="student-toolbar">
          <div className="student-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search by name, reg number, email, campus, department..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by student type">
            <option value="all">All student types</option>
            <option value="Regular">Regular</option>
            <option value="In-Service">In-Service</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by semester status">
            <option value="all">All semester statuses</option>
            <option value="registered">Current semester</option>
            <option value="not_registered">Not current semester</option>
          </select>
          <button className="student-btn" onClick={fetchStudents} disabled={loading}>
            Refresh
          </button>
        </section>

        <section className="student-table-wrap">
          {loading ? (
            <div className="student-empty">Loading the admin student list...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="student-empty">
              No student records match the current filters.
            </div>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Registration No.</th>
                  <th>Type</th>
                  <th>Campus</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Grad Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.reg_no}>
                    <td className="student-name-cell">
                      <strong>{student.name}</strong>
                      <span>{student.email}</span>
                    </td>
                    <td>{student.reg_no}</td>
                    <td>
                      <span className={`student-chip ${student.type === 'Regular' ? 'student-chip-regular' : 'student-chip-service'}`}>
                        {student.type}
                      </span>
                    </td>
                    <td>{student.campus || '-'}</td>
                    <td>{student.department || '-'}</td>
                    <td>
                      <span className={`student-chip ${student.is_registered_sem ? 'student-chip-registered' : 'student-chip-not-registered'}`}>
                        {student.is_registered_sem ? 'Current' : 'Not current'}
                      </span>
                    </td>
                    <td>{student.expected_grad_year || '-'}</td>
                    <td>
                      <div className="student-table-actions">
                        <button className="student-icon-btn" onClick={() => openEditForm(student)} title="Edit student">
                          <Pencil size={15} />
                        </button>
                        <button className="student-icon-btn student-icon-btn-danger" onClick={() => handleDelete(student)} title="Delete student">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {showForm && (
        <div className="student-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <div className="student-modal">
            <div className="student-modal-header">
              <div>
                <h2>{editingStudent ? 'Edit student record' : 'Add student to validation list'}</h2>
                <p>{editingStudent ? 'Update the student details used during voter validation.' : 'Create one official eligibility record for voter validation.'}</p>
              </div>
              <button className="student-icon-btn" onClick={closeForm} title="Close">
                <X size={18} />
              </button>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
              <div className="student-form-grid">
                <div className="student-form-field">
                  <label htmlFor="reg_no">Registration number</label>
                  <input id="reg_no" name="reg_no" value={formData.reg_no} onChange={handleInputChange} disabled={!!editingStudent} required />
                </div>
                <div className="student-form-field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="student-form-field">
                  <label htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="student-form-field">
                  <label htmlFor="type">Student type</label>
                  <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                    <option value="Regular">Regular</option>
                    <option value="In-Service">In-Service</option>
                  </select>
                </div>
                <div className="student-form-field">
                  <label htmlFor="expected_grad_year">Expected graduation year</label>
                  <input id="expected_grad_year" name="expected_grad_year" type="number" min="2020" max="2035" value={formData.expected_grad_year} onChange={handleInputChange} required />
                </div>
                <div className="student-form-field">
                  <label htmlFor="campus">Campus</label>
                  <select id="campus" name="campus" value={formData.campus} onChange={handleInputChange} required>
                    <option value="main">Main campus</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>
                <div className="student-form-field">
                  <label htmlFor="department">Department</label>
                  <select id="department" name="department" value={formData.department} onChange={handleInputChange} required>
                    <option value="">Select department</option>
                    {departments.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="student-form-check">
                <input type="checkbox" name="is_registered_sem" checked={formData.is_registered_sem} onChange={handleInputChange} />
                <span><CheckCircle2 size={16} /> Registered for the current semester/session</span>
              </label>

              <div className="student-form-actions">
                <button type="button" className="student-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="student-btn student-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ManageStudents;
