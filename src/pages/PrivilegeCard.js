// In PrivilegeCard.js
import React, { useState, useRef, useContext } from "react";
import * as htmlToImage from 'html-to-image';
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";

const PrivilegeCard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    familyMembers: "",
    idProof: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedCard, setSubmittedCard] = useState(null);
  const [submittedEmails, setSubmittedEmails] = useState([]);
  const cardRef = useRef(null);
  const { token } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "idProof") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear validation error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Check if the email has already been used in this session
    if (submittedEmails.includes(formData.email)) {
      setErrors({ email: "This email address has already been used to apply for a card in this session." });
      return;
    }

    // --- Validation ---
    const newErrors = {};
    if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }
    const familyMemberCount = parseInt(formData.familyMembers, 10);
    if (isNaN(familyMemberCount) || familyMemberCount > 4 || familyMemberCount < 0) {
      newErrors.familyMembers = "Family members must be a number between 0 and 4.";
    }
    if (!formData.idProof) {
      newErrors.idProof = "ID Proof is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // --- End Validation ---

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("familyMembers", formData.familyMembers);
    if (formData.idProof) {
      formDataToSend.append("idProof", formData.idProof);
    }

    try {
      const res = await fetch(getApiUrl("/api/privilege-card"), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await res.json();
      if (!res.ok) {
        // The backend should ideally verify the name on the ID proof.
        // If it fails, it could send back an error like this.
        if (result.error?.includes("name on the ID does not match")) {
          setErrors({ general: "Submission Unsuccessful: The name on the ID proof does not match the name provided." });
        } else {
          const msg = result.errors?.join("\n") || result.error || "Submission failed";
          setErrors({ general: msg });
        }
      } else {
        setSubmittedCard({
          name: formData.name,
          email: formData.email,
          familyMembers: formData.familyMembers,
          idProof: formData.idProof.name, // Save the file name
          id: result.applicationId,
          createdAt: new Date().toISOString(),
        });
        setSubmittedEmails([...submittedEmails, formData.email]);
        setFormData({ name: "", email: "", familyMembers: "", idProof: null });
      }
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (cardRef.current === null) {
      return;
    }

    htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `MedVerse-Privilege-Card-${submittedCard.id.slice(-8)}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
        setErrors({ general: "Could not download the card. Please try again." });
      });
  };

  // Add this new function to render the privilege card
  const renderPrivilegeCard = () => (
    <div className="card mt-4 shadow-lg" style={{ maxWidth: "400px" }} ref={cardRef}>
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">MedVerse Privilege Card</h4>
      </div>
      <div className="card-body">
        <div className="text-center mb-4">
          <div className="bg-light p-3 rounded-circle d-inline-block">
            <i className="bi bi-person-badge fs-1 text-primary"></i>
          </div>
        </div>
        <h5 className="card-title">{submittedCard.name}</h5>
        <p className="card-text">
          <small className="text-muted">Card #: {submittedCard.id.slice(-8).toUpperCase()}</small>
        </p>
        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item">
            <i className="bi bi-envelope me-2"></i> {submittedCard.email}
          </li>
          <li className="list-group-item">
            <i className="bi bi-people me-2"></i> Family Members: {submittedCard.familyMembers}
          </li>
          <li className="list-group-item">
            <i className="bi bi-file-earmark-person me-2"></i> ID Proof: {submittedCard.idProof}
          </li>
          <li className="list-group-item">
            <i className="bi bi-calendar-check me-2"></i> Issued:{" "}
            {new Date(submittedCard.createdAt).toLocaleDateString()}
          </li>
        </ul>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
           <button 
            className="btn btn-success mb-2 mb-sm-0"
            onClick={handleDownload}
          >
            <i className="bi bi-download me-2"></i>Download Card
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setSubmittedCard(null)}
          >
            Apply for Another Card
          </button>

        </div>
      </div>
      <div className="card-footer text-muted small">
        Valid until {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
      </div>
    </div>
  );

  if (submittedCard) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Application Submitted Successfully!</h4>
              <p>Your MedVerse Privilege Card has been created.</p>
            </div>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
            {renderPrivilegeCard()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">MedVerse Privilege Card</h2>
      <div className="card bg-light border-0 p-4 mb-5">
        <p className="lead">
          Unlock exclusive healthcare benefits, savings, and priority services
          across our network.
        </p>
        <hr />
        <h5>What is the Privilege Card?</h5>
        <p>
          The MedVerse Privilege Card is a membership program designed to
          provide you and your family with affordable and accessible healthcare.
          Cardholders receive special discounts on consultations, lab tests, and
          other medical services.
        </p>
        <h5>Who is eligible?</h5>
        <p>
          Any registered member of MedVerse can apply for a Privilege Card. You
          can include up to four additional family members under a single card
          to extend the benefits to your loved ones.
        </p>
      </div>

      <h3 className="mt-4 mb-3">Apply for Your Card</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="familyMembers" className="form-label">Number of Family Members (0-4)</label>
          <input type="number" className={`form-control ${errors.familyMembers ? 'is-invalid' : ''}`} id="familyMembers" name="familyMembers" value={formData.familyMembers} onChange={handleInputChange} min="0" max="4" required />
          {errors.familyMembers && <div className="invalid-feedback">{errors.familyMembers}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="idProof" className="form-label">ID Proof (e.g., Aadhar, PAN)</label>
          <input type="file" className={`form-control ${errors.idProof ? 'is-invalid' : ''}`} id="idProof" name="idProof" onChange={handleInputChange} accept="image/*,.pdf" required />
          {errors.idProof && <div className="invalid-feedback">{errors.idProof}</div>}
        </div>

        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !formData.name || !formData.email || !formData.familyMembers || !formData.idProof}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivilegeCard;