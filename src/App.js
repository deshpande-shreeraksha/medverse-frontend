import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

// Pages
import AuthCard from "./pages/AuthCard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Hospitals from "./pages/Hospitals";
import HospitalCity from "./pages/HospitalCity";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import MedicalRecords from "./pages/MedicalRecords";
import LabTests from "./pages/LabTests";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import InternationalPatients from "./pages/InternationalPatients"; // ✅ Added
import InPatientDeposit from "./pages/InPatientDeposit";
import Doctor from "./pages/Doctor";
import PrivilegeCard from "./pages/PrivilegeCard";
import Pharmacy from "./components/Pharmacy";


// Components
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";

import "./styles/theme.css";

function App() {
  return (
    <AuthProvider>
      {/* Navbar is always visible */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthCard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:city" element={<HospitalCity />} />
        <Route path="/international-patients" element={<InternationalPatients />} /> {/* ✅ New route */}
        <Route path="/inpatient-deposit" element={<InPatientDeposit />} />
<Route path="/doctors" element={<Doctor />} />
        <Route path="/privilege-card" element={<PrivilegeCard />} />
        <Route path="/pharmacy" element={<Pharmacy />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Doctor portal removed */}
          <Route path="/book-appointment" element={<BookAppointment />} /> {/* For generic booking */}
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} /> {/* For specific doctor */}
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        {/* Fallback route for 404 */}
        <Route
          path="*"
          element={<h2 className="text-center mt-5">404 - Page Not Found</h2>}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
