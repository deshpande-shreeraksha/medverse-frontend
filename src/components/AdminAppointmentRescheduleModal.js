import React, { useState, useEffect } from 'react';
import { adminRescheduleAppointment } from '../api';

const AdminAppointmentRescheduleModal = ({ appointment, onClose, onSaved }) => {
  const [datetime, setDatetime] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment && appointment.startAt) {
      // convert ISO to local datetime-local value
      const d = new Date(appointment.startAt);
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISO = new Date(d - tzOffset).toISOString().slice(0,16);
      setDatetime(localISO);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const iso = new Date(datetime).toISOString();
      const res = await adminRescheduleAppointment(appointment._id, { startAt: iso });
      if (onSaved) onSaved(res.data.appointment);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Reschedule failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reschedule Appointment</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">New date & time</label>
                <input type="datetime-local" className="form-control" value={datetime} onChange={e => setDatetime(e.target.value)} required />
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

export default AdminAppointmentRescheduleModal;
