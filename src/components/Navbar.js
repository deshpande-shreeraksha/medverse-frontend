// src/components/Navbar.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import logo from "../assets/medverse-logo.png";
import "../styles/navbar.css"; // custom styles

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, setToken, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("userName");
    if (setToken) setToken(null);
    if (setUser) setUser(null);
    navigate("/login");
  };

  const handleAccessLabReports = () => {
    if (token || localStorage.getItem("authToken")) {
      navigate("/lab-tests");
    } else {
      navigate("/login");
    }
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : localStorage.getItem("userName");

  const getDashboardRoute = () => {
    let role = user?.role;
    if (!role) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("authUser"));
        role = storedUser?.role;
      } catch (error) {
        // ignore
      }
    }
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'doctor') return '/dashboard/doctor';
    return '/dashboard';
  };

  return (
    <>
      {/* 🔹 Upper Utility Bar */}
      <div className="bg-light border-bottom">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center py-2">
            
            {/* Left: Logo + Slogan */}
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <img src={logo} alt="MedVerse Logo" style={{ height: "40px" }} />
              <span className="fw-bold text-danger ms-2">LIFE’S ON</span>
            </div>

            {/* Right: Utility Actions */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleAccessLabReports}
              >
                Access Lab Reports
              </button>

              <span 
                className="text-primary fw-bold" 
                style={{ cursor: "pointer" }}
                onClick={() => window.location.href="/contact"}
              >
                📞 Call Us
              </span>

              <span 
                className="text-danger fw-bold" 
                style={{ cursor: "pointer" }}
                onClick={() => window.location.href="tel:108"}
              >
                🚨 Emergency
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          {/* Brand */}
          <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src={logo} alt="MedVerse Logo" style={{ height: "40px", marginRight: "10px" }} />
            MedVerse
          </NavLink>

          {/* Hamburger for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              
              <li className="nav-item">
                <NavLink className="nav-link" to="/doctors">Doctors</NavLink>
              </li>

              {/* Hospitals Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link p-0"
                  type="button"
                  id="hospitalDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hospitals
                </button>
                <ul className="dropdown-menu" aria-labelledby="hospitalDropdown">
                  <li><NavLink className="dropdown-item" to="/hospitals/bengaluru">Bengaluru</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/mysuru">Mysuru</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/mangaluru">Mangaluru</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/goa">Goa</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/delhi">Delhi</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/gurugram">Gurugram</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/pune">Pune</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/kolkata">Kolkata</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/jaipur">Jaipur</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/hospitals/vijayawada">Vijayawada</NavLink></li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/pharmacy">Pharmacy</NavLink>
              </li>

              {/* Patient Services Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link p-0"
                  type="button"
                  id="patientDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Patient Services
                </button>
                <ul className="dropdown-menu" aria-labelledby="patientDropdown">
                  
                  <li><NavLink className="dropdown-item" to="/services">Centre of Excellence</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/inpatient-deposit">In‑Patient Deposit</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/pharmacy">Pharmacy</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/international-patients">International Patients</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/privilege-card">Privilege Card</NavLink></li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">Contact</NavLink>
              </li>

              {/* 🔹 Auth Section */}
              {token || localStorage.getItem("authToken") ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to={getDashboardRoute()}>Dashboard</NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light btn-sm ms-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/signup">Sign Up</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
