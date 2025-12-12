import React, { useEffect, useState } from 'react';
import { adminListAudits } from '../api';
import AuthErrorBanner from './AuthErrorBanner';

const AdminAuditList = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  const fetchAudits = async (p = 1) => {
    setLoading(true);
    try {
      const res = await adminListAudits({ page: p, limit, action: filter });
      setAudits(res.data.audits || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || p);
      setError(null);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Failed to load audits';
      setError(status ? `${status} — ${msg}` : msg);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAudits(1); }, []);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading) return <div>Loading audits...</div>;

  return (
    <div>
      <AuthErrorBanner message={error} />
      {error && !String(error).startsWith('401') && <div className="text-danger mb-2">{error}</div>}
      <div className="d-flex mb-3">
        <input className="form-control me-2" placeholder="Filter by action (e.g. appointment.cancel)" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="btn btn-sm btn-primary" onClick={() => fetchAudits(1)}>Apply</button>
      </div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Time</th>
            <th>Action</th>
            <th>Actor</th>
            <th>Target</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {audits.map(a => (
            <tr key={a._id}>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td>{a.action}</td>
              <td>{a.actorEmail || a.actorId}</td>
              <td>{a.targetType} {a.targetId}</td>
              <td style={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{JSON.stringify(a.details)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <div>Showing {audits.length} of {total}</div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => fetchAudits(page - 1)}>Prev</button>
          <span className="me-2">Page {page} / {totalPages}</span>
          <button className="btn btn-sm btn-outline-secondary" disabled={page >= totalPages} onClick={() => fetchAudits(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditList;
