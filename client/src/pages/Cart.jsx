import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function Cart() {
  const [cart, setCart] = useState(null);

  const userId = "CURRENT_USER_ID";

  useEffect(() => {
    fetch(`${API.cart}/${userId}`)
      .then((response) => response.json())
      .then((data) => setCart(data))
      .catch((error) => console.error(error));
  }, []);

  if (!cart) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div className="cart-page">

      <div className="store-header">
        <div>
          <h1>Your Cart</h1>
          <p>Review your construction materials</p>
        </div>
      </div>

      <div className="cart-layout">

        <div className="cart-items">

          {cart.items?.map((item) => (
            <div className="cart-item" key={item._id}>

              <div className="cart-product-image">
                📦
              </div>

              <div className="cart-product-info">
                <h3>{item.product?.name}</h3>

                <p>
                  ₹{item.product?.price}
                </p>

                <span>
                  Quantity: {item.quantity}
                </span>
              </div>

              <strong>
                ₹{item.product?.price * item.quantity}
              </strong>

            </div>
          ))}

        </div>

        <div className="order-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{cart.total || 0}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>₹0</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cart.total || 0}</strong>
          </div>

          <Link
            to="/checkout"
            className="btn-primary checkout-btn"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Cart;