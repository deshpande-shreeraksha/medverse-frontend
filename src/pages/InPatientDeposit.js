import React from "react";

const InPatientDeposit = () => {
  return (
    <div className="container my-5">
      <h2 className="mb-4">In‑Patient Deposit Details</h2>
      <p>
        To ensure a smooth admission process, patients are required to make an
        initial deposit at the time of admission. This deposit will be adjusted
        against the final bill at discharge.
      </p>

      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">💳 Payment Methods</h5>
              <p className="card-text">
                Deposits can be made via cash, credit/debit card, UPI, or bank transfer.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📑 Required Documents</h5>
              <p className="card-text">
                Please carry a valid government ID, insurance documents (if applicable),
                and admission slip.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">💰 Deposit Amount</h5>
              <p className="card-text">
                The deposit amount varies depending on the treatment type and estimated
                duration of stay. Our billing desk will provide a detailed estimate.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🔄 Refunds & Adjustments</h5>
              <p className="card-text">
                Any excess deposit will be refunded at discharge. If the final bill
                exceeds the deposit, the balance must be cleared before discharge.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-5 mb-3">Sample Deposit Amounts</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Room Type</th>
            <th>Deposit Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>General Ward</td>
            <td>10,000</td>
          </tr>
          <tr>
            <td>ICU</td>
            <td>25,000</td>
          </tr>
          <tr>
            <td>Deluxe Room</td>
            <td>50,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InPatientDeposit;
