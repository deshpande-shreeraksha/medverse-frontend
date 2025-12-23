import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get('/admin/feedback');
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Failed to load feedbacks', err);
        setError(err.response?.data?.message || err.message || 'Failed to load feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div className="container my-4">
      <h3>Patient Feedback & Contact Messages</h3>
      {feedbacks.length === 0 ? (
        <div className="mt-3">No messages yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>When</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(f => (
                <tr key={f._id}>
                  <td>{new Date(f.createdAt).toLocaleString()}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.phone}</td>
                  <td>{f.subject}</td>
                  <td style={{ whiteSpace: 'pre-wrap' }}>{f.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
