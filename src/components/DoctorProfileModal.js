import React from "react";
import { Modal, Button, Image } from "react-bootstrap";

const DoctorProfileModal = ({ doctor, show, onHide, onBookAppointment }) => {
  if (!doctor) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {doctor.name} - <span className="text-muted">{doctor.title}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4 text-center">
            {doctor.image && (
              <Image
                src={doctor.image}
                roundedCircle
                fluid
                className="mb-3 shadow-sm"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
            <h4>{doctor.specialization}</h4>
            <p className="text-muted">{doctor.location}</p>
          </div>
          <div className="col-md-8">
            <h5>About Dr. {doctor.name.split(" ").pop()}</h5>
            <p>{doctor.about}</p>
            <hr />
            <h5>Qualifications</h5>
            <p>{doctor.qualifications}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onBookAppointment(doctor)}>
          Book Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorProfileModal;