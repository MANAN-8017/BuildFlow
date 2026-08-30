import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const URL = "http://localhost:8000/api";
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [cart, setCart] = useState(null);
  const subtotal = Number(cart?.totalAmount || 0);
  const deliveryCharge = subtotal > 0 ? 100 : 0;
  const total = subtotal + deliveryCharge;

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const response = await fetch(
        `${URL}/cart/user/USER-001`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load cart"
        );
      }
      setCart(data.cart || data);
    } catch (error) {
      console.error("Cart loading failed:", error);
    }
  };
  fetchCart();
}, []);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        `${URL}/orders/user/USER-001`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            shippingAddress
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create order"
        );
      }
      console.log("Order created:", data);
      const orderId = data.order.orderId;
      console.log("BuildFlow Order ID:", orderId);
      navigate(`/payment/${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };
  
  return (
    <div className="page">

      <div className="page-header">
        <span>CHECKOUT</span>
        <h1>Complete Your Order</h1>
        <p>
          Provide your delivery details and review your
          procurement before payment.
        </p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <div className="form-section">
            <div className="section-title">
              <span>01</span>
              <div>
                <h2>Delivery Information</h2>
                <p>
                  Where should we deliver your materials?
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      name: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group full">
                <label>Address</label>
                <textarea placeholder="Enter delivery address" rows="4" />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={shippingAddress.pincode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      pincode: e.target.value
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="section-title">
              <span>02</span>
              <div>
                <h2>Order Review</h2>
                <p>
                  Verify your materials and quantities.
                </p>
              </div>
            </div>

      {cart?.products?.map((item) => {
          const itemTotal = item.price * item.quantity;
            return (
              <div className="review-item" key={item.productId} >
                <div>
                  <span>{item.name}</span>
                  <small>₹{item.price.toLocaleString("en-IN")}{" × "}{item.quantity}</small>
                </div>
                <strong>₹{itemTotal.toLocaleString("en-IN")}</strong>
              </div>
              );
           })}
          </div>
        </div>
        <div className="checkout-summary">
          <span>PAYMENT SUMMARY</span>
          <h2>Order Total</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>₹100</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button className="payment-button" onClick={handlePlaceOrder}> Continue to Payment →
          </button>
          <Link to="/cart" className="back-cart"> ← Back to Cart </Link>
          <div className="secure-note">
            Razorpay Test Mode
            <br />
            No real payment will be processed.
          </div>
        </div>
      </div>
    </div>
  );
}
export default Checkout;