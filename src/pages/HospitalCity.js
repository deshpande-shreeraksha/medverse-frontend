import React from "react";
import { useParams } from "react-router-dom";
import { hospitalsData } from "../data/hospitals";

const HospitalCity = () => {
  const { city } = useParams();
  const hospitals = hospitalsData[city] || [];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-capitalize">Hospitals in {city}</h2>
      <div className="row">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{hospital.name}</h5>
                <p className="card-text">{hospital.description}</p>
                <p className="card-text">
                  <strong>Address:</strong> {hospital.address}
                </p>
                <p className="card-text">
                  <strong>Contact:</strong> {hospital.contact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalCity;
