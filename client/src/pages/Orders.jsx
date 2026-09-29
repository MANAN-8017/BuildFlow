import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import "../styles/global.css";
import "../styles/Orders.css";

function Orders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.userId) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API.orders}/user/${user.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch orders."
                    );
                }

                const completedOrders = data.filter(
                    (order) =>
                        order.paymentStatus ===
                        "captured"
                );

                setOrders(completedOrders);

                const productIds = [
                    ...new Set(
                        completedOrders.flatMap(
                            (order) =>
                                order.products?.map(
                                    (item) =>
                                        item.productId
                                ) || []
                        )
                    )
                ];

                if (productIds.length > 0) {
                    const productResults =
                        await Promise.all(
                            productIds.map(
                                async (productId) => {
                                    const productResponse =
                                        await fetch(
                                            `${API.products}/${productId}`
                                        );

                                    if (
                                        !productResponse.ok
                                    ) {
                                        return null;
                                    }

                                    return productResponse.json();
                                }
                            )
                        );

                    const productMap = {};

                    productResults.forEach(
                        (product) => {
                            if (product?.productId) {
                                productMap[
                                    product.productId
                                ] = product;
                            }
                        }
                    );

                    setProducts(productMap);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch orders:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getProductNames = (order) => {
        const names =
            order.products?.map((item) => {
                return (
                    products[item.productId]?.name ||
                    item.productId
                );
            }) || [];

        return names.join(", ");
    };

    const getItemCount = (order) => {
        return (
            order.products?.reduce(
                (total, item) =>
                    total +
                    Number(item.quantity || 0),
                0
            ) || 0
        );
    };

    if (loading) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>PROCUREMENT</span>

                    <h1>Orders</h1>

                    <p>
                        Loading your completed orders...
                    </p>
                </div>

                <div className="orders-loading">
                    Loading orders...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>PROCUREMENT</span>

                    <h1>Orders</h1>

                    <p>
                        Please login to view your orders.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>PROCUREMENT</span>

                    <h1>Orders</h1>

                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <span>PROCUREMENT</span>

                <h1>Orders</h1>

                <p>
                    Track and manage your completed
                    construction material orders.
                </p>
            </div>

            <div className="orders-container">
                {orders.length === 0 ? (
                    <div className="orders-empty">
                        <h2>
                            No completed orders
                        </h2>

                        <p>
                            Your completed orders will
                            appear here after payment is
                            successfully captured.
                        </p>

                        <Link
                            to="/products"
                            className="orders-shop-button"
                        >
                            Browse Materials
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            className="order-card"
                            key={order.orderId}
                        >
                            <div className="order-main">
                                <div className="order-id">
                                    <span>
                                        ORDER
                                    </span>

                                    <strong>
                                        #{order.orderId}
                                    </strong>
                                </div>

                                <div className="order-date">
                                    {formatDate(
                                        order.createdAt
                                    )}
                                </div>

                                <div className="order-materials">
                                    <strong>
                                        {getProductNames(
                                            order
                                        )}
                                    </strong>

                                    <span>
                                        {getItemCount(
                                            order
                                        )}{" "}
                                        items
                                    </span>
                                </div>

                                <div className="order-price">
                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div className="order-statuses">
                                    <span className="payment-status">
                                        Payment: Paid
                                    </span>

                                    <span
                                        className={`order-status ${order.orderStatus}`}
                                    >
                                        Order:{" "}
                                        {order.orderStatus.charAt(0).toUpperCase() +
                                            order.orderStatus.slice(1)}
                                    </span>
                                </div>

                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="order-view"
                                >
                                    View →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Orders;