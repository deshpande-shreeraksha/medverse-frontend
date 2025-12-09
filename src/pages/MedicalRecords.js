import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";
import { Tabs, Tab, Modal } from "react-bootstrap";
import "../styles/medicalrecords.css";

const MedicalRecords = ({ isModal = false, onHide }) => {
  const navigate = useNavigate(); // Always define hooks
  const { token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("prescriptions");

  const authToken = token || localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      if (!isModal) {
        navigate("/login");
      }
      return;
    }
    fetchMedicalRecords();
  }, [authToken, isModal, navigate]);

  const fetchMedicalRecords = async () => {
    try {
      const res = await fetch(getApiUrl("/api/medical-records"), {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch medical records:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (recordType) => {
    switch (recordType) {
      case "Prescription":
        return "💊";
      case "Report":
        return "📋";
      case "Diagnosis":
        return "🩺";
      case "Medical History":
        return "📊";
      default:
        return "📄";
    }
  };

  const getTypeColor = (recordType) => {
    switch (recordType) {
      case "Prescription":
        return "badge-primary";
      case "Report":
        return "badge-info";
      case "Diagnosis":
        return "badge-warning";
      case "Medical History":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const handleBack = () => {
    if (onHide) {
      onHide();
    } else {
      navigate("/dashboard");
    }
  };

  // Helper function to render a list of records for a specific tab
  const renderRecordList = (recordType, emptyMessage) => {
    const filteredRecords = records.filter(r => r.recordType === recordType);

    if (filteredRecords.length === 0) {
      return (
        <div className="alert alert-light text-center py-4 mt-3">
          <p className="mb-0">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="records-grid">
        {filteredRecords.map((record) => (
          <div key={record._id} className="record-card">
            <div className="record-card-icon">{getTypeIcon(record.recordType)}</div>
            <div className="record-card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5>{record.title}</h5>
                <span className={`badge ${getTypeColor(record.recordType)}`}>{record.recordType}</span>
              </div>
              <p className="text-muted mb-2"><strong>Doctor:</strong> {record.doctorName}</p>
              <p className="text-muted mb-3"><strong>Date:</strong> {record.date}</p>
              {record.description && <p className="record-description mb-3">{record.description}</p>}
              <button className="btn btn-sm btn-primary w-100" onClick={() => handleViewDetails(record)}>
                View Full Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabsView = () => {
    return (
      <Tabs id="medical-records-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 nav-pills-custom" fill>
        <Tab eventKey="prescriptions" title="💊 Prescriptions">{renderRecordList("Prescription", "No prescriptions found.")}</Tab>
        <Tab eventKey="reports" title="📑 Reports">{renderRecordList("Report", "No reports found.")}</Tab>
        <Tab eventKey="diagnosis" title="🩺 Diagnosis">{renderRecordList("Diagnosis", "No diagnosis records found.")}</Tab>
        <Tab eventKey="history" title="📜 Medical History">{renderRecordList("Medical History", "No medical history found.")}</Tab>
      </Tabs>
    );
  };

  // Placeholder functions to render specific details for each record type
  const renderPrescriptionDetails = (record) => (
    <div className="mb-4">
      <h6 className="fw-bold text-muted">Medications</h6>
      <p>{record.description || "Details about the prescription."}</p>
      {/* You can map over an array of medications here if available */}
    </div>
  );

  const renderReportDetails = (record) => (
    <div className="mb-4">
      <h6 className="fw-bold text-muted">Report Findings</h6>
      <p>{record.description || "Details about the report."}</p>
      {record.fileUrl && (
        <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-info">
          View Full Report
        </a>
      )}
    </div>
  );

  const renderDiagnosisDetails = (record) => (
    <div className="mb-4">
      <h6 className="fw-bold text-muted">Diagnosis Information</h6>
      <p>{record.description || "Details about the diagnosis."}</p>
    </div>
  );

  const renderHistoryDetails = (record) => (
    <div className="mb-4">
      <h6 className="fw-bold text-muted">Medical History Summary</h6>
      <p>{record.description || "Details about medical history."}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="container my-5">
        <div className="alert alert-info">Loading medical records...</div>
      </div>
    );
  }

  const renderContent = () => {
    const renderRecordSpecificDetails = (record) => {
      switch (record.recordType) {
        case "Prescription":
          return renderPrescriptionDetails(record);
        case "Report":
          return renderReportDetails(record);
        case "Diagnosis":
          return renderDiagnosisDetails(record);
        case "Medical History":
          return renderHistoryDetails(record);
        default:
          return <p>{record.description || "No additional details available."}</p>;
      }
    };

    if (showDetails && selectedRecord) {
      return (
        <div className="record-details-card">
          <div className="card-header-custom">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2>{selectedRecord.title}</h2>
                <p className="mb-2">
                  <span className={`badge ${getTypeColor(selectedRecord.recordType)}`}>
                    {getTypeIcon(selectedRecord.recordType)} {selectedRecord.recordType}
                  </span>
                </p>
                <p className="text-muted mb-0">Doctor: {selectedRecord.doctorName}</p>
              </div>
              <button className="btn btn-close" onClick={() => setShowDetails(false)}></button>
            </div>
          </div>
          <div className="card-body-custom">
            {/* Render details based on record type */}
            {renderRecordSpecificDetails(selectedRecord)}

            {/* Common details like notes */}
            {selectedRecord.notes && (
              <>
                <hr />
                <div className="mb-4">
                  <h6 className="fw-bold text-muted">Additional Notes from Doctor</h6>
                  <p><em>{selectedRecord.notes}</em></p>
                </div>
              </>
            )}
            <button className="btn btn-outline-primary w-100" onClick={() => setShowDetails(false)}>
              Close Details
            </button>
          </div>
        </div>
      );
    }
    return renderTabsView();
  };

  if (isModal) {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title as="h1" className="display-5 fw-bold text-primary" id="medical-records-modal-title">
            Medical Records
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="records-modal-body">
          <p className="text-muted fs-5 mb-4">
            Access your prescriptions, reports, and medical history
          </p>
          {renderContent()}
        </Modal.Body>
      </>
    );
  }

  return (
    <div className="container my-5">
      <div className="records-header mb-5">
        <div>
          <h1 className="display-5 fw-bold text-primary">Medical Records</h1>
          <p className="text-muted fs-5">Access your prescriptions, reports, and medical history</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          ← Back to Dashboard
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default MedicalRecords;
