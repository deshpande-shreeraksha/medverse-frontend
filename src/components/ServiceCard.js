import React from "react";

const ServiceCard = ({ title, icon, desc }) => (
  <div className="card shadow-lg border-0 rounded-3 text-center p-4 hover-lift">
    <div className="fs-1">{icon}</div>
    <h5 className="mt-3">{title}</h5>
    <p>{desc}</p>
  </div>
);

export default ServiceCard;
