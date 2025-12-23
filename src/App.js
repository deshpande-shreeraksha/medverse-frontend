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
import InitialGate from "./components/InitialGate";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAppointments from "./pages/AdminAppointments";
import AdminReports from "./pages/AdminReports";
import AdminAudits from "./pages/AdminAudits";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSchedule from "./pages/DoctorSchedule"; // <-- Add this
import DoctorProfile from "./pages/DoctorProfile";   // <-- Add this
import DoctorAvailability from "./pages/DoctorAvailability";
import StaffDashboard from "./pages/StaffDashboard";
import RoleDashboardRouter from "./pages/RoleDashboardRouter";
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
import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";

import "./styles/theme.css";

function App() {
  return (
    <AuthProvider>
      {/* Navbar is always visible */}
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<InitialGate><Home /></InitialGate>} />
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
          {/* Redirect to appropriate dashboard for the user's role */}
          <Route path="/dashboard" element={<RoleDashboardRouter />} />

          {/* Role-specific dashboards */}
          <Route path="/dashboard/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
          <Route path="/dashboard/admin/users" element={<RoleRoute allowedRoles={["admin"]}><AdminUsers /></RoleRoute>} />
          <Route path="/dashboard/admin/appointments" element={<RoleRoute allowedRoles={["admin"]}><AdminAppointments /></RoleRoute>} />
          <Route path="/dashboard/admin/reports" element={<RoleRoute allowedRoles={["admin"]}><AdminReports /></RoleRoute>} />
          <Route path="/dashboard/admin/audits" element={<RoleRoute allowedRoles={["admin"]}><AdminAudits /></RoleRoute>} />
          <Route path="/dashboard/admin/feedback" element={<RoleRoute allowedRoles={["admin"]}><AdminFeedbacks /></RoleRoute>} />
          <Route path="/dashboard/doctor" element={<RoleRoute allowedRoles={["doctor"]}><DoctorDashboard /></RoleRoute>} />
          <Route path="/doctor/schedule" element={<RoleRoute allowedRoles={["doctor"]}><DoctorSchedule /></RoleRoute>} />
          <Route path="/doctor/profile" element={<RoleRoute allowedRoles={["doctor"]}><DoctorProfile /></RoleRoute>} />
          <Route path="/doctor/availability" element={<RoleRoute allowedRoles={["doctor"]}><DoctorAvailability /></RoleRoute>} />
          <Route path="/dashboard/staff" element={<RoleRoute allowedRoles={["staff"]}><StaffDashboard /></RoleRoute>} />
          <Route path="/dashboard/patient" element={<RoleRoute allowedRoles={["patient"]}><Dashboard /></RoleRoute>} />

          {/* Generic protected pages */}
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
