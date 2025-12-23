import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner } from "react-bootstrap";
import { AuthContext } from "../AuthContext";
import DoctorProfileModal from "../components/DoctorProfileModal";
import { getApiUrl } from "../api";

const Doctor = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // State for modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(getApiUrl("/api/doctors"));
        const data = await res.json();
        const mappedDoctors = data.map(doc => ({
          id: doc._id,
          name: `Dr. ${doc.firstName} ${doc.lastName}`,
          title: doc.specialization,
          specialization: doc.specialization || "General Physician",
          location: doc.location || "MedVerse Hospital",
          about: doc.bio || "No biography available.",
          qualifications: doc.qualifications,
          image: doc.profilePictureUrl ? getApiUrl(doc.profilePictureUrl) : "https://via.placeholder.com/150",
          consultationFee: doc.consultationFee
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    const appointmentPath = `/book-appointment/${doctor.id}`;

    if (token) {
      // If logged in, navigate to the booking page
      navigate(appointmentPath, {
        state: {
          doctorName: doctor.name,
          specialization: doctor.specialization,
        },
      });
    } else {
      // If not logged in, redirect to login, preserving the destination
      navigate(`/login?redirect=${encodeURIComponent(appointmentPath)}`, {
        // Also pass the state, so it can be restored after login
        state: {
          doctorName: doctor.name,
          specialization: doctor.specialization,
        },
      });
    }
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-primary fw-bold">Our Doctors</h2>
      <div className="row">
        {doctors.map((doc) => (
          <div className="col-md-4 mb-4" key={doc.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">{doc.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{doc.title}</Card.Subtitle>
                <p className="mb-1"><strong>📍 Location:</strong> {doc.location}</p>
                <p className="mb-1"><strong>About:</strong> {doc.about}</p>
                <p className="mb-1"><strong>🎓 Qualification:</strong> {doc.qualifications}</p>

                {/* Specialization Badge */}
                <div className="mb-3">
                  <span className="badge bg-info">{doc.specialization}</span>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="primary" 
                    onClick={() => handleBookAppointment(doc)}
                  >
                    Book Appointment
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleViewProfile(doc)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <DoctorProfileModal
        show={showModal}
        doctor={selectedDoctor}
        onHide={() => setShowModal(false)}
        onBookAppointment={handleBookAppointment}
      />
    </div>
  );
};

export default Doctor;
