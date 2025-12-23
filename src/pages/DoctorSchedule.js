import React, { useState, useEffect } from 'react';
import api from '../api';
import { Table, Spinner, Alert, Pagination, Card, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import MedicalRecords from './MedicalRecords';

const DoctorSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    const fetchAppointments = async (page) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/doctor/appointments?page=${page}&search=${activeSearch}`);
            setAppointments(data.appointments || []);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(currentPage);
    }, [currentPage, activeSearch]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to page 1 on new search
        setActiveSearch(searchTerm);
    };

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        const action = newStatus === 'Scheduled' ? 'confirm' : 'reject';
        try {
            await api.patch(`/appointments/${appointmentId}/${action}`);
            fetchAppointments(currentPage); // Re-fetch to show updated status
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} appointment.`);
        }
    };

    const handleViewHistory = (patientId) => {
        setSelectedPatientId(patientId);
        setShowHistoryModal(true);
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

    const renderContent = () => {
        if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        if (appointments.length === 0) return <Alert variant="info">You have no appointments.</Alert>;

        return (
            <>
                <Form onSubmit={handleSearch} className="mb-3">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search patient by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="primary" type="submit">Search</Button>
                    </InputGroup>
                </Form>

                <Table striped bordered hover responsive>
                    <thead className="table-light">
                        <tr>
                            <th>Date & Time</th>
                            <th>Patient Name</th>
                            <th>Patient Email</th>
                            <th>Mode</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(apt => (
                            <tr key={apt._id}>
                                <td>{new Date(apt.startAt).toLocaleString()}</td>
                                <td>{apt.userId ? `${apt.userId.firstName} ${apt.userId.lastName}` : 'N/A'}</td>
                                <td>{apt.userId ? apt.userId.email : 'N/A'}</td>
                                <td>{apt.mode}</td>
                                <td><span className={`badge bg-${getStatusVariant(apt.status)}`}>{apt.status}</span></td>
                                <td>
                                    {apt.status === 'Pending' && (
                                        <>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleUpdateStatus(apt._id, 'Scheduled')}>
                                                Confirm
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {apt.status === 'Scheduled' && (
                                        <Button variant="outline-danger" size="sm" onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}>
                                            Cancel
                                        </Button>
                                    )}
                                    {apt.userId && (
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="ms-2 text-white" 
                                            onClick={() => handleViewHistory(apt.userId._id)}
                                        >
                                            History
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center">
                    {[...Array(totalPages).keys()].map(num => (
                        <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => handlePageChange(num + 1)}>
                            {num + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>

                <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="xl">
                    <MedicalRecords 
                        isModal={true} 
                        onHide={() => setShowHistoryModal(false)} 
                        patientId={selectedPatientId} 
                    />
                </Modal>
            </>
        );
    };

    return (
        <Card className="shadow-sm">
            <Card.Header as="h4">Your Appointment Schedule</Card.Header>
            <Card.Body>
                {renderContent()}
            </Card.Body>
        </Card>
    );
};

export default DoctorSchedule;