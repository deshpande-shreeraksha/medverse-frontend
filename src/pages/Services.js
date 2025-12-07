import React from "react";
import ServiceCard from "../components/ServiceCard";

const Services = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Explore Our Services</h2>
      <p className="text-center mb-5">
        MedVerse offers a wide range of medical specialties to serve every patient with excellence.
      </p>
      <div className="row">
        <div className="col-md-4 mb-4">
          <ServiceCard title="Cardiology" icon="❤️" desc="Advanced heart care facilities." />
        </div>
        <div className="col-md-4 mb-4">
          <ServiceCard title="Orthopaedics" icon="🦴" desc="Bone and joint treatments." />
        </div>
        <div className="col-md-4 mb-4">
          <ServiceCard title="Neurology" icon="🧠" desc="Brain and nerve care." />
        </div>
        <div className="col-md-4 mb-4">
          <ServiceCard title="Oncology" icon="🎗️" desc="Compassionate cancer care." />
        </div>
        <div className="col-md-4 mb-4">
          <ServiceCard title="Paediatrics" icon="🧒" desc="Child care from newborns to teens." />
        </div>
        <div className="col-md-4 mb-4">
          <ServiceCard title="Gynaecology" icon="👩‍⚕️" desc="Women's health and maternity." />
        </div>
      </div>
    </div>
  );
};

export default Services;
