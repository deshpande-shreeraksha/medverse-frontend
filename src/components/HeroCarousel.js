// src/components/HeroCarousel.js
import React from "react";
import { Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import banner1 from "../assets/medverse-bg.jpg"; // replace with your images
import banner2 from "../assets/hospital-bg.jpg";
import banner3 from "../assets/patient-care-bg.jpg";

const HeroCarousel = () => {
  return (
    <Carousel fade interval={4000}>
      {/* Slide 1 */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner1}
          alt="Find Doctor Banner"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption className='centered'>
          <h3 className="fw-bold">Find the Right Specialist</h3>
          <p>Search doctors by specialty and location.</p>
          <NavLink to="/doctors" className="btn btn-primary">
             Find Doctor
          </NavLink>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 2 */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner2}
          alt="Book Appointment Banner"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption className="centered">
          <h3 className="fw-bold">Book Your Appointment</h3>
          <p>Choose your doctor and specialization.</p>
          <NavLink to="/book-appointment" className="btn btn-danger">
             Book Now
          </NavLink>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 3 */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={banner3}
          alt="Hospital Network Banner"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption className="centered">
          <h3 className="fw-bold">Our Hospital Network</h3>
          <p>Explore hospitals across major cities.</p>
          <NavLink to="/hospitals" className="btn btn-success">
             View Hospitals
          </NavLink>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HeroCarousel;
