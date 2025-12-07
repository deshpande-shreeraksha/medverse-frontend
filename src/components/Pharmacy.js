import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { medicinesData } from "./medicines";
import "./pharmacy.css";

const Pharmacy = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const addToCart = (medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id);
      if (existingItem) {
        // Increment quantity if item is already in cart
        return prevCart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (medicineId, quantity) => {
    const numQuantity = Number(quantity);
    if (numQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart((prevCart) => prevCart.filter((item) => item.id !== medicineId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === medicineId ? { ...item, quantity: numQuantity } : item
        )
      );
    }
  };

  const handleBooking = () => {
    if (cart.length === 0) {
      setMessage({ type: "danger", text: "Your cart is empty." });
      return;
    }
    // In a real app, you would send this to a backend.
    console.log("Booking successful:", cart);
    setMessage({
      type: "success",
      text: "✅ Your medicine order has been placed successfully!",
    });
    setCart([]); // Clear the cart
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  const filteredMedicines = medicinesData.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container my-5">
      <div className="pharmacy-header mb-5">
        <div>
          <h1 className="display-5 fw-bold text-primary">Online Pharmacy</h1>
          <p className="text-muted fs-5">
            Order your medicines and have them delivered to your doorstep.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row">
        {/* Medicine List */}
        <div className="col-md-8">
          <h4 className="fw-bold mb-3">Available Medicines</h4>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search for medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="medicine-grid">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((med) => (
                <div key={med.id} className="card medicine-card">
                  <div className="card-body">
                    <h5 className="card-title">{med.name}</h5>
                    <p className="card-text text-muted">{med.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">₹{med.price.toFixed(2)}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(med)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No medicines found matching your search.</p>
            )}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="col-md-4">
          <div className="cart-card sticky-top">
            <h4 className="fw-bold mb-3">Your Cart</h4>
            {cart.length > 0 ? (
              <>
                <ul className="list-group mb-3">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="my-0">{item.name}</h6>
                        <small className="text-muted">
                          ₹{item.price.toFixed(2)} each
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          className="form-control form-control-sm quantity-input"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, e.target.value)
                          }
                          min="0"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={handleBooking}
                >
                  Book Medicines
                </button>
              </>
            ) : (
              <div className="alert alert-light text-center">
                Your cart is empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;