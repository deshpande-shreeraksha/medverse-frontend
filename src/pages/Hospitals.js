import React from "react";
import { Link } from "react-router-dom";
import { hospitalsData } from "../data/hospitals";
import "../styles/hospitals.css";

const Hospitals = () => {
  const cities = Object.keys(hospitalsData);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Our Hospital Network</h1>
      <p className="text-center mb-5">
        Explore hospitals across major cities in India
      </p>

      <div className="row">
        {cities.map((city) => (
          <div key={city} className="col-md-4 col-sm-6 mb-4">
            <div className="card city-card">
              <div className="card-body text-center">
                <h5 className="card-title text-capitalize">{city}</h5>
                <p className="card-text">
                  {hospitalsData[city].length} hospital
                  {hospitalsData[city].length > 1 ? "s" : ""} available
                </p>
                <Link to={`/hospitals/${city}`} className="btn btn-primary">
                  View Hospitals
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
