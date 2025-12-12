import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api, { getApiUrl } from '../api';
import { Card, Row, Col, Table, Button, Spinner, Alert, Image } from 'react-bootstrap';

const DoctorDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      setLoading(true);
      setError('');
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await api.get(`/appointments/doctor-schedule?date=${today}`);
        setSchedule(res.data || []);
      } catch (err) {
        setError('Failed to load your schedule. Please try again later.');
        console.error("Error fetching doctor's schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSchedule();
  }, [token]);

  const handleConfirm = async (appointmentId) => {
    setConfirmingId(appointmentId);
    try {
      const res = await api.patch(`/appointments/${appointmentId}/confirm`);
      if (res.data) {
        // Update the schedule state to reflect the change
        setSchedule(prevSchedule =>
          prevSchedule.map(apt =>
            apt._id === appointmentId ? { ...apt, status: 'Scheduled' } : apt
          )
        );
      }
    } catch (err) {
      console.error('Failed to confirm appointment', err);
      setError('Could not confirm the appointment. Please try again.');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleReject = async (appointmentId) => {
    // Optional: Add a confirmation step
    if (!window.confirm("Are you sure you want to reject this appointment?")) {
      return;
    }
    setRejectingId(appointmentId);
    try {
      const res = await api.patch(`/appointments/${appointmentId}/reject`);
      if (res.data) {
        setSchedule(prevSchedule =>
          prevSchedule.map(apt =>
            apt._id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
          )
        );
      }
    } catch (err) {
      console.error('Failed to reject appointment', err);
      setError('Could not reject the appointment. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const renderSchedule = () => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading Today's Schedule...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (schedule.length === 0) {
      return <Alert variant="info">You have no appointments scheduled for today.</Alert>;
    }

    return (
      <Table striped bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Time</th>
            <th>Patient Name</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map(apt => (
            <tr key={apt._id}>
              <td>{new Date(apt.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{apt.userId ? `${apt.userId.firstName} ${apt.userId.lastName}` : 'N/A'}</td>
              <td>{apt.mode}</td>
              <td>
                <span className={`badge bg-${getStatusVariant(apt.status)}`}>{apt.status}</span>
              </td>
              <td>
                {apt.status === 'Pending' && (
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleConfirm(apt._id)}
                      disabled={confirmingId === apt._id || rejectingId === apt._id}>
                      {confirmingId === apt._id ? '...' : 'Confirm'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(apt._id)}
                      disabled={rejectingId === apt._id || confirmingId === apt._id}
                    >
                      {rejectingId === apt._id ? '...' : 'Reject'}
                    </Button>
                  </div>
                )}
                {apt.status === 'Scheduled' && (
                  <Button variant="info" size="sm">Start Consult</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="container my-5">
      <Row className="align-items-center mb-5">
        <Col xs="auto">
          <Image
            src={user?.profilePictureUrl ? getApiUrl(user.profilePictureUrl) : 'https://via.placeholder.com/100'}
            roundedCircle
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
        </Col>
        <Col>
          <h1 className="display-5 fw-bold text-primary mb-1">Doctor Dashboard</h1>
          <p className="text-muted fs-5 mb-0">
            Welcome back, Dr. {user?.lastName || 'Doctor'}!
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="fs-1 fw-bold text-primary">{schedule.length}</Card.Title>
              <Card.Text className="text-muted">Appointments Today</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8} className="d-flex align-items-center">
            <div className="w-100">
                <h5 className="fw-bold">Quick Actions</h5>
                <Button as={Link} to="/doctor/schedule" variant="primary" className="me-2">View Full Schedule</Button>
                <Button as={Link} to="/doctor/profile" variant="outline-secondary" className="me-2">Manage Profile</Button>
                <Button as={Link} to="/doctor/availability" variant="outline-info">Set Availability</Button>
            </div>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header as="h5">Today's Appointments</Card.Header>
        <Card.Body>{renderSchedule()}</Card.Body>
      </Card>
    </div>
  );
};

export default DoctorDashboard;