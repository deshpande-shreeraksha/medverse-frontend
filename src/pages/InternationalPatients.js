import React from "react";

const InternationalPatients = () => {
  return (
    <div className="container my-5">
      <h2 className="mb-4">International Patients</h2>
      <p>
        At MedVerse, we understand the unique needs of patients traveling from abroad
        for medical care. Our dedicated International Patient Services team ensures
        that your journey — from the first inquiry to post-treatment follow-up — is
        smooth, safe, and comfortable.
      </p>

      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🌍 Visa Assistance</h5>
              <p className="card-text">
                Help with medical visa documentation and embassy coordination.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🏨 Travel & Accommodation</h5>
              <p className="card-text">
                Airport pickup, hotel booking, and local transport.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🩺 Dedicated Care Managers</h5>
              <p className="card-text">
                Personalized guidance throughout your treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🗣️ Language Support</h5>
              <p className="card-text">
                Translators for Hindi, English, and other major languages.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">💳 Cost Estimates</h5>
              <p className="card-text">
                Transparent treatment packages before arrival.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📞 24/7 Helpline</h5>
              <p className="card-text">
                Assistance for emergencies and queries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalPatients;
