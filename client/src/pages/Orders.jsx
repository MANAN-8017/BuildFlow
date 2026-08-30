import { Link } from "react-router-dom";
import "../styles/global.css";
import "./Orders.css";

function Orders() {
  const orders = [
    {
      id: "BF-1024",
      date: "26 Aug 2026",
      items: "Cement, Steel, Sand",
      count: 7,
      total: 12500,
      status: "Paid",
    },
    {
      id: "BF-1019",
      date: "21 Aug 2026",
      items: "Bricks, Cement",
      count: 4,
      total: 6800,
      status: "Delivered",
    },
  ];
  return (
    <div className="page">
      <div className="page-header">
        <span>PROCUREMENT</span>
        <h1>Orders</h1>
        <p>Track and manage your construction material orders.</p>
      </div>
      <div className="orders-container">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-main">
              <div className="order-id">
                <span>ORDER</span>
                <strong>#{order.id}</strong>
              </div>
              <div className="order-date">{order.date}</div>
              <div className="order-materials">
                <strong>{order.items}</strong>
                <span>{order.count} items</span>
              </div>
              <div className="order-price">
                <span>Total</span>
                <strong>₹{order.total.toLocaleString("en-IN")}</strong>
              </div>
              <span className={`order-status ${order.status.toLowerCase()}`} > {order.status}
              </span>
              <Link to={`/orders/${order.id}`} className="order-view" > View → </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Orders;