import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";
import HeroCarousel from "../components/HeroCarousel";
import ServiceCard from "../components/ServiceCard";
import Counter from "../components/Counter";

const Home = () => {
  const { token, user } = useContext(AuthContext);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Determine logged-in user from context or localStorage (important for post-signup updates)
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem('authUser');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  })();
  
  // determine if the current user is a doctor (from context or persisted auth)
  const isDoctor = (currentUser && currentUser.role === "doctor") || false;

  useEffect(() => {
    const fetchUpcomingAppointment = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl("/api/appointments"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const appointments = await res.json();
          // Find the next upcoming confirmed appointment
          const upcoming = appointments
            .filter(apt => apt.status === "Confirmed")
            .map(apt => ({ ...apt, dateTime: new Date(`${apt.date}T${apt.time}`) }))
            .filter(apt => apt.dateTime > new Date())
            .sort((a, b) => a.dateTime - b.dateTime);

          if (upcoming.length > 0) {
            setUpcomingAppointment(upcoming[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingAppointment();
  }, [token]);

  return (
    <main>
      {/* Hero Banner Carousel - hide for doctors */}
      {!isDoctor && <HeroCarousel />}

      {/* CTA Banner - show signup link or a greeting when logged in */}
      <div className="container my-4">
        <div className="alert alert-primary text-center py-4 shadow-sm" role="alert">
          {currentUser ? (
            <>
              <h4 className="mb-2">Welcome back, {currentUser.firstName} {currentUser.lastName} 👋</h4>
              <p className="mb-3">Good to see you — manage your appointments and records from your dashboard.</p>
              <NavLink to="/dashboard" className="btn btn-dark btn-lg">Go to Dashboard</NavLink>
            </>
          ) : (
            <>
              <h4 className="mb-2">Join MedVerse — sign up and book your first appointment</h4>
              <p className="mb-3">Create your free account and manage appointments, tests and reports from one place.</p>
              <NavLink to="/signup" className="btn btn-success btn-lg">Create free account</NavLink>
            </>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Specialities</h2>
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

      {/* Counters Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">At a Glance</h2>
        <div className="row">
          <div className="col-md-3 mb-4"><Counter end={10500} label="Beds" icon="🛏️" /></div>
          <div className="col-md-3 mb-4"><Counter end={1918} label="Doctors" icon="👨‍⚕️" /></div>
          <div className="col-md-3 mb-4"><Counter end={2797} label="Cities Served" icon="🌍" /></div>
          <div className="col-md-3 mb-4"><Counter end={15000000} label="Lives Touched" icon="💖" /></div>
        </div>
      </div>

      {/* Appointment Preview */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Your Upcoming Appointment</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-center shadow-lg p-4">
              {token ? ( // Only show appointment details if logged in
                loading ? (
                  <p>Loading your appointments...</p>
                ) : upcomingAppointment ? (
                  <>
                    <h5 className="card-title">📅 {upcomingAppointment.doctorName}</h5>
                    <p className="card-text">
                      {new Date(upcomingAppointment.dateTime).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </>
                ) : (
                  <p className="card-text">You have no upcoming appointments.</p>
                )
              ) : ( // If not logged in
                <p className="card-text">Please sign in to view your appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
