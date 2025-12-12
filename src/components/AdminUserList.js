import React, { useEffect, useState } from 'react';
import { adminListUsers, adminDeleteUser, adminUpdateUser } from '../api';
import AdminUserEditModal from './AdminUserEditModal';
import AuthErrorBanner from './AuthErrorBanner';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const params = { limit, page: p };
      if (roleFilter) params.role = roleFilter;
      if (searchTerm) params.search = searchTerm;
      const res = await adminListUsers(params);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Failed to load users';
      setError(status ? `${status} — ${msg}` : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(page); }, []);
  useEffect(() => { fetchUsers(1); }, [roleFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(id);
      fetchUsers(page);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Delete failed';
      alert(status ? `${status} — ${msg}` : msg);
    }
  };

  const openEdit = (user) => setEditing(user);

  const handleSaved = (updatedUser) => {
    if (!updatedUser) return;
    setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'patient' ? 'doctor' : 'patient';
    try {
      const res = await adminUpdateUser(user._id, { role: newRole });
      const updated = res.data.user;
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <AuthErrorBanner message={error} />
      {error && !String(error).startsWith('401') && <div className="text-danger mb-2">{error}</div>}

      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => fetchUsers(page)}>Refresh</button>
      </div>

      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Search name or email" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-sm btn-primary" onClick={() => fetchUsers(1)}>Apply</button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(u)}>Edit</button>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => handleToggleRole(u)}>Toggle Role</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <div>Showing {users.length} of {total}</div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => fetchUsers(page - 1)}>Prev</button>
          <span className="me-2">Page {page} / {totalPages}</span>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => fetchUsers(page + 1)}>Next</button>
        </div>
      </div>

      {editing && (
        <AdminUserEditModal user={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default AdminUserList;
