import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      address: {
        ...form.address,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(API.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      console.log("Registration response:", data);

      navigate("/login");

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <img src="/BuildFlow.png" alt="BuildFlow"/> </div>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>
            Create your BuildFlow account and start
            managing your construction procurement.
          </p>
        </div>
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-row">
            <div className="auth-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-divider"> Delivery Address </div>
          <div className="auth-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              placeholder="Enter street address"
              value={form.address.street}
              onChange={handleAddressChange}
            />
          </div>
          <div className="auth-row">
            <div className="auth-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.address.city}
                onChange={handleAddressChange}
              />
            </div>
            <div className="auth-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.address.state}
                onChange={handleAddressChange}
              />
            </div>
          </div>
          <div className="auth-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.address.pincode}
              onChange={handleAddressChange}
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"} 
          </button>
        </form>
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login"> Sign In </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;