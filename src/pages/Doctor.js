import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { doctorsData } from "../data/doctors";
import { AuthContext } from "../AuthContext";
import DoctorProfileModal from "../components/DoctorProfileModal";

const Doctor = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // State for modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        {doctorsData.map((doc) => (
          <div className="col-md-4 mb-4" key={doc.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">{doc.name}</Card.Title>
                <p className="mb-1"><strong>Doctor ID:</strong> {doc.id} <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => { navigator.clipboard?.writeText(String(doc.id)); }}>{'Copy ID'}</button></p>
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
