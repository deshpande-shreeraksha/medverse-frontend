import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';

const DoctorAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const { data } = await api.get('/doctor/availability');
                // Ensure the data is sorted by a standard week order
                const weekOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const sortedData = data.sort((a, b) => weekOrder.indexOf(a.day) - weekOrder.indexOf(b.day));
                setAvailability(sortedData);
            } catch (err) {
                setError('Failed to load availability schedule.');
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const handleToggle = (day) => {
        setAvailability(prev =>
            prev.map(item =>
                item.day === day ? { ...item, isAvailable: !item.isAvailable } : item
            )
        );
    };

    const handleTimeChange = (day, field, value) => {
        setAvailability(prev =>
            prev.map(item =>
                item.day === day ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await api.put('/doctor/availability', { availability });
            setSuccess('Availability updated successfully!');
        } catch (err) {
            setError('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    return (
        <Card className="shadow-sm">
            <Card.Header as="h4">Manage Weekly Availability</Card.Header>
            <Card.Body>
                <p className="text-muted">Set your standard working hours for each day. This will determine the slots available for booking.</p>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {availability.map(({ day, isAvailable, startTime, endTime }) => (
                        <Card key={day} className={`mb-3 ${!isAvailable ? 'bg-light' : ''}`}>
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <Form.Check
                                            type="switch"
                                            id={`switch-${day}`}
                                            label={day}
                                            checked={isAvailable}
                                            onChange={() => handleToggle(day)}
                                            className="fw-bold fs-5"
                                        />
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Label>Start Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                                                disabled={!isAvailable}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group>
                                            <Form.Label>End Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                                                disabled={!isAvailable}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button variant="primary" type="submit" disabled={saving} className="w-100 mt-3">
                        {saving ? 'Saving...' : 'Save Availability'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DoctorAvailability;