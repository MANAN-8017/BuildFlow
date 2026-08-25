import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const userId = "CURRENT_USER_ID";

  useEffect(() => {
    fetch(`${API.orders}/${userId}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="orders-page">

      <div className="store-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your construction material orders</p>
        </div>
      </div>

      <div className="orders-list">

        {orders.map((order) => (
          <div className="order-card" key={order._id}>

            <div>
              <span>Order ID</span>
              <h3>#{order._id}</h3>
            </div>

            <div>
              <span>Status</span>
              <strong className="order-status">
                {order.status}
              </strong>
            </div>

            <div>
              <span>Total</span>
              <strong>₹{order.totalAmount}</strong>
            </div>

            <Link
              to={`/orders/${order._id}`}
              className="btn-secondary"
            >
              View Order
            </Link>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Orders;