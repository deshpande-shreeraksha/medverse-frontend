import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";

const DisplayPrivilegeCard = ({ cardData }) => {
  const cardRef = useRef(null);

  const handleDownload = () => {
    if (cardRef.current === null) return;

    htmlToImage
      .toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `MedVerse-Privilege-Card-${cardData._id
          .slice(-8)
          .toUpperCase()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      });
  };

  return (
    <div className="card mt-4 shadow-lg" style={{ maxWidth: "400px", margin: "0 auto" }} ref={cardRef}>
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">MedVerse Privilege Card</h4>
      </div>
      <div className="card-body">
        <div className="text-center mb-4">
          <div className="bg-light p-3 rounded-circle d-inline-block">
            <i className="bi bi-person-badge fs-1 text-primary"></i>
          </div>
        </div>
        <h5 className="card-title">{cardData.name}</h5>
        <p className="card-text">
          <small className="text-muted">
            Card #: {cardData._id.slice(-8).toUpperCase()}
          </small>
        </p>
        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item">
            <i className="bi bi-envelope me-2"></i> {cardData.email}
          </li>
          <li className="list-group-item">
            <i className="bi bi-people me-2"></i> Family Members:{" "}
            {cardData.familyMembers}
          </li>
        </ul>
        <button className="btn btn-success w-100" onClick={handleDownload}>
          <i className="bi bi-download me-2"></i>Download Card
        </button>
      </div>
      <div className="card-footer text-muted small">
        Valid until{" "}
        {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DisplayPrivilegeCard;