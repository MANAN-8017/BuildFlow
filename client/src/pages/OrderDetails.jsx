import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${API.orders}/${id}`)
      .then((response) => response.json())
      .then((data) => setOrder(data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!order) {
    return <div className="loading">Loading order...</div>;
  }

  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="order-details">

      <h1>Track Order</h1>

      <p>
        Order ID: <strong>#{order._id}</strong>
      </p>

      <div className="tracking">

        {statuses.map((status, index) => (
          <div
            key={status}
            className={
              index <= currentIndex
                ? "tracking-step completed"
                : "tracking-step"
            }
          >

            <div className="tracking-circle">
              {index <= currentIndex ? "✓" : index + 1}
            </div>

            <span>{status}</span>

          </div>
        ))}

      </div>

      <div className="order-info">

        <h2>Order Information</h2>

        <p>
          Status: <strong>{order.status}</strong>
        </p>

        <p>
          Total: <strong>₹{order.totalAmount}</strong>
        </p>

      </div>

    </div>
  );
}

export default OrderDetails;