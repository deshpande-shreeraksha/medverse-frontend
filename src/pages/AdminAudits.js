import React from 'react';
import AdminAuditList from '../components/AdminAuditList';

const AdminAudits = () => {
  return (
    <div className="container my-4">
      <h2 className="h4 mb-3">Admin Audit Log</h2>
      <p className="text-muted">Recent admin actions (cancellations, reschedules, exports).</p>
      <AdminAuditList />
    </div>
  );
};

export default AdminAudits;
