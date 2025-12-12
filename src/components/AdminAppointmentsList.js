import React, { useEffect, useState } from 'react';
import { adminListAppointments, adminCancelAppointment } from '../api';
import AuthErrorBanner from './AuthErrorBanner';
import AdminAppointmentRescheduleModal from './AdminAppointmentRescheduleModal';

const AdminAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const fetchAppointments = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit };
      if (statusFilter) params.status = statusFilter;
      if (doctorSearch) params.doctor = doctorSearch;
      const res = await adminListAppointments(params);
      setAppointments(res.data.appointments || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
      setError(null);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Failed to load appointments';
      setError(status ? `${status} — ${msg}` : msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(1); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await adminCancelAppointment(id);
      fetchAppointments(page);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Cancel failed';
      setError(status ? `${status} — ${msg}` : msg);
    }
  };

  const openReschedule = (appt) => setEditing(appt);

  const handleRescheduled = (updated) => {
    setAppointments(prev => prev.map(a => a._id === updated._id ? updated : a));
  };

  if (loading) return <div>Loading appointments...</div>;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <AuthErrorBanner message={error} />
      {error && !String(error).startsWith('401') && <div className="text-danger mb-2">{error}</div>}
      <div className="row mb-3 g-2">
        <div className="col-md-4">
          <input className="form-control" placeholder="Search doctor name or id" value={doctorSearch} onChange={e => setDoctorSearch(e.target.value)} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-sm btn-primary" onClick={() => fetchAppointments(1)}>Apply</button>
        </div>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>When</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.userId ? `${a.userId.firstName} ${a.userId.lastName}` : '—'}</td>
              <td>{a.doctorName || a.doctorId || '—'}</td>
              <td>{new Date(a.startAt).toLocaleString()}</td>
              <td>{a.mode}</td>
              <td>{a.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openReschedule(a)}>Reschedule</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleCancel(a._id)} disabled={a.status === 'Cancelled'}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <div>Showing {appointments.length} of {total}</div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => fetchAppointments(page - 1)}>Prev</button>
          <span className="me-2">Page {page} / {totalPages}</span>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => fetchAppointments(page + 1)}>Next</button>
        </div>
      </div>
      {editing && (
        <AdminAppointmentRescheduleModal appointment={editing} onClose={() => setEditing(null)} onSaved={handleRescheduled} />
      )}
    </div>
  );
};

export default AdminAppointmentsList;
