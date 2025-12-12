import React, { useState, useEffect } from 'react';
import api from '../api';
import { Table, Spinner, Alert, Pagination, Card } from 'react-bootstrap';

const DoctorSchedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAppointments = async (page) => {
            setLoading(true);
            try {
                const { data } = await api.get(`/doctor/appointments?page=${page}`);
                setAppointments(data.appointments || []);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError('Failed to load appointments.');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments(currentPage);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                <Table striped bordered hover responsive>
                    <thead className="table-light">
                        <tr>
                            <th>Date & Time</th>
                            <th>Patient Name</th>
                            <th>Patient Email</th>
                            <th>Mode</th>
                            <th>Status</th>
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
            </>
        );
    };

    return (
        <div className="container my-5">
            <Card className="shadow-sm">
                <Card.Header as="h2">Full Appointment Schedule</Card.Header>
                <Card.Body>
                    {renderContent()}
                </Card.Body>
            </Card>
        </div>
    );
};

export default DoctorSchedule;