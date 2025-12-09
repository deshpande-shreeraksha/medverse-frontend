import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { AuthContext } from "../AuthContext";
import "../styles/labtests.css";

const LabTests = () => {
  const navigate = useNavigate();
  const detailsCardRef = useRef(null);
  const { token } = useContext(AuthContext);
  const [labTests, setLabTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const authToken = token || localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetchLabTests();
  }, [authToken, navigate]);

  const fetchLabTests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lab-tests", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLabTests(data);
      }
    } catch (err) {
      console.error("Failed to fetch lab tests:", err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success";
      case "Normal":
        return "bg-info";
      case "Abnormal":
        return "bg-danger";
      case "Pending":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const handleViewDetails = (test) => {
    setSelectedTest(test);
    setShowDetails(true);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleDownload = () => {
    if (detailsCardRef.current === null) {
      return;
    }

    htmlToImage.toPng(detailsCardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Lab-Test-${selectedTest.testName.replace(" ", "-")}-${selectedTest._id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Download failed:", err);
      });
  };

  return (
    <div className="container my-5">
      <div className="lab-tests-header mb-5">
        <div>
          <h1 className="display-5 fw-bold text-primary">Lab Tests & Results</h1>
          <p className="text-muted fs-5">View and manage your laboratory test results</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          ← Back to Dashboard
        </button>
      </div>

      {selectedTest && showDetails ? (
        <div className="test-details-card" ref={detailsCardRef}>
          <div className="card-header-custom">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2>{selectedTest.testName}</h2>
                <p className="mb-0">
                  Test Date: {selectedTest.testDate} | Result Date: {selectedTest.resultDate}
                </p>
              </div>
              <button 
                className="btn btn-close"
                onClick={() => setShowDetails(false)}
              ></button>
            </div>
          </div>

          <div className="card-body-custom">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="fw-bold text-muted">Status</h6>
                <span className={`badge ${getStatusBadgeClass(selectedTest.status)} fs-6`}>
                  {selectedTest.status}
                </span>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold text-muted">Normal Range</h6>
                <p>{selectedTest.normalRange || "N/A"}</p>
              </div>
            </div>

            <hr />

            <div className="mb-4">
              <h6 className="fw-bold text-muted">Result</h6>
              <p className="fs-5">{selectedTest.result || "Pending"}</p>
            </div>

            {selectedTest.notes && (
              <div className="mb-4">
                <h6 className="fw-bold text-muted">Doctor's Notes</h6>
                <p>{selectedTest.notes}</p>
              </div>
            )}

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-success w-100"
                onClick={handleDownload}
              >
                Download Record
              </button>
              <button className="btn btn-outline-primary w-100" onClick={() => setShowDetails(false)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></> // No message needed when details are closed
      )}

      {labTests.length > 0 ? (
        <div className="tests-grid mt-5">
          {labTests.map((test) => (
            <div key={test._id} className="test-card">
              <div className="test-card-header">
                <h5>{test.testName}</h5>
                <span className={`badge ${getStatusBadgeClass(test.status)}`}>
                  {test.status}
                </span>
              </div>
              <div className="test-card-body">
                <div className="test-info">
                  <p className="text-muted mb-2">
                    <strong>Date:</strong> {test.testDate}
                  </p>
                  {test.result && (
                    <p className="text-muted mb-2">
                      <strong>Result:</strong> {test.result}
                    </p>
                  )}
                  {test.normalRange && (
                    <p className="text-muted mb-2">
                      <strong>Normal Range:</strong> {test.normalRange}
                    </p>
                  )}
                </div>
                <button
                  className="btn btn-sm btn-primary w-100 mt-3"
                  onClick={() => handleViewDetails(test)}
                >
                  {selectedTest?._id === test._id && showDetails ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center py-5">
          <h5>No lab tests found</h5>
          <p className="mb-0">Your lab test results will appear here once they are available.</p>
        </div>
      ) }

    </div>
  );
};

export default LabTests;
