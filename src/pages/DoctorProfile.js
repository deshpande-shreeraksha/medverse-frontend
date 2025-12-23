import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useLocation } from 'react-router-dom';
import api, { getApiUrl } from '../api';
import { Form, Button, Card, Alert, Spinner, Image, Row, Col } from 'react-bootstrap';

const DoctorProfile = () => {
    const { setUser } = useContext(AuthContext);
    const location = useLocation();
    const isNewDoctor = location.state?.isNewDoctor || false;
    const [showWelcome, setShowWelcome] = useState(isNewDoctor);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        specialization: '',
        location: '',
        bio: '',
        profilePictureUrl: '',
        qualifications: '',
        consultationFee: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const MAX_BIO_LENGTH = 500;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/doctor/profile');
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'profilePicture') {
            const file = e.target.files[0];
            if (file) {
                setProfilePictureFile(file);
                setProfile({ ...profile, profilePictureUrl: URL.createObjectURL(file) });
            }
        } else {
            setProfile({ ...profile, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const formData = new FormData();
            formData.append('firstName', profile.firstName);
            formData.append('lastName', profile.lastName);
            formData.append('specialization', profile.specialization);
            formData.append('bio', profile.bio);
            formData.append('consultationFee', profile.consultationFee);
            formData.append('qualifications', profile.qualifications);
            formData.append('location', profile.location);
            if (profilePictureFile) {
                formData.append('profilePicture', profilePictureFile);
            }

            const { data } = await api.put('/doctor/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfile(data);
            setSuccess('Profile updated successfully!');

            // Update global user context and local storage so Navbar/Dashboard reflect changes immediately
            if (setUser) setUser(data);
            localStorage.setItem('authUser', JSON.stringify(data));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    return (
        <Card className="shadow-sm">
            <Card.Header as="h4">Manage Profile</Card.Header>
            <Card.Body>
                {showWelcome && (
                    <Alert variant="success" onClose={() => setShowWelcome(false)} dismissible>
                        <Alert.Heading>Welcome to Medverse, Doctor!</Alert.Heading>
                        <p>Your account has been created successfully. Please fill in your professional details below to complete your profile and start accepting appointments.</p>
                    </Alert>
                )}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={4} className="text-center">
                            <Image
                                src={profile.profilePictureUrl ? (profile.profilePictureUrl.startsWith('blob:') ? profile.profilePictureUrl : getApiUrl(profile.profilePictureUrl)) : 'https://via.placeholder.com/150'}
                                roundedCircle
                                fluid
                                style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                            />
                            <Form.Group controlId="formProfilePicture" className="mb-3">
                                <Form.Label>Change Profile Picture</Form.Label>
                                <Form.Control type="file" name="profilePicture" onChange={handleChange} accept="image/*" />
                            </Form.Group>
                        </Col>
                        <Col md={8}>
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" value={profile.firstName || ''} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" value={profile.lastName || ''} onChange={handleChange} required />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={profile.email || ''} readOnly />
                                <Form.Text className="text-muted">Email address cannot be changed.</Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formSpecialization">
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control type="text" name="specialization" value={profile.specialization || ''} onChange={handleChange} placeholder="e.g., Cardiology" />
                    </Form.Group>

                            <Form.Group className="mb-3" controlId="formLocation">
                                <Form.Label>Location / Clinic</Form.Label>
                                <Form.Control type="text" name="location" value={profile.location || ''} onChange={handleChange} placeholder="e.g., MedVerse Hospital, Mumbai" />
                            </Form.Group>

                    <Form.Group className="mb-3" controlId="formConsultationFee">
                        <Form.Label>Consultation Fee (₹)</Form.Label>
                        <Form.Control type="number" name="consultationFee" value={profile.consultationFee || ''} onChange={handleChange} placeholder="e.g., 500" min="0" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formQualifications">
                        <Form.Label>Qualifications</Form.Label>
                        <Form.Control as="textarea" rows={2} name="qualifications" value={profile.qualifications || ''} onChange={handleChange} placeholder="e.g., MBBS, MD (Cardiology)" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={3} name="bio" value={profile.bio || ''} onChange={handleChange} placeholder="A short bio about your professional experience." maxLength={MAX_BIO_LENGTH} />
                        <Form.Text className="text-muted text-end d-block">
                            {profile.bio?.length || 0} / {MAX_BIO_LENGTH}
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={saving} className="w-100">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DoctorProfile;