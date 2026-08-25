import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function Checkout() {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    const response = await fetch(API.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "CURRENT_USER_ID",
        address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate(`/payment/${data._id}`);
    }
  };

  return (
    <div className="checkout-page">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className="checkout-card">

        <h2>Delivery Address</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={address.name}
              onChange={handleChange}
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={address.address}
              onChange={handleChange}
              placeholder="Complete address"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              value={address.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              name="state"
              value={address.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>
            <input
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          className="btn-primary checkout-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>

      </div>
    </div>
  );
}

export default Checkout;