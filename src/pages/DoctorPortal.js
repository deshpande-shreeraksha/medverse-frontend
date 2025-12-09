import React from "react";
import { useNavigate } from "react-router-dom";

// Doctor portal removed: provide a lightweight placeholder that redirects to the dashboard.
const DoctorPortal = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const t = setTimeout(() => navigate("/dashboard"), 400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="container my-5">
      <div className="alert alert-info">Doctor Portal has been removed. Redirecting to your dashboard...</div>
    </div>
  );
};

export default DoctorPortal;
