import React, { useState } from 'react';
import { adminListAppointments, adminExportAppointments } from '../api';
import AuthErrorBanner from './AuthErrorBanner';

// Helper to convert array of objects to CSV
const toCSV = (rows) => {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const lines = [keys.join(',')];
  for (const r of rows) {
    const vals = keys.map(k => {
      const v = r[k] == null ? '' : String(r[k]).replace(/"/g, '""');
      return '"' + v + '"';
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
};

const AdminReportsForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      // request server-side export as blob
      const res = await adminExportAppointments(params);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments_${startDate || 'all'}_${endDate || 'all'}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err.message || 'Export failed (server).';
      setError(status ? `${status} — ${msg}` : msg);
      // fallback alert
      alert(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-3">
      <AuthErrorBanner message={error} />
      {error && !String(error).startsWith('401') && <div className="text-danger mb-2">{error}</div>}
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Start date</label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">End date</label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary" onClick={handleExport} disabled={loading}>{loading ? 'Exporting...' : 'Export CSV'}</button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsForm;
