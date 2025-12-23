import React, { useState, useEffect } from 'react';
import { adminUpdateUser } from '../api';

const AdminUserEditModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'patient',
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminUpdateUser(user._id, form);
      const updated = res.data?.user || null;
      if (onSaved) onSaved(updated);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">First name</label>
                <input name="firstName" className="form-control" value={form.firstName} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Last name</label>
                <input name="lastName" className="form-control" value={form.lastName} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Role</label>
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="patient">patient</option>
                  <option value="doctor">doctor</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEditModal;
