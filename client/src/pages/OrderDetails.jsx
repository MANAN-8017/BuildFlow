import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import "../styles/global.css";
import "../styles/OrderDetails.css";

function OrderDetails() {
    const { orderId } = useParams();
    const { user } = useAuth();

    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!user?.userId || !orderId) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API.orders}/${orderId}`,
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
                        "Failed to fetch order."
                    );
                }

                if (data.userId !== user.userId) {
                    throw new Error(
                        "You are not authorized to view this order."
                    );
                }

                if (data.paymentStatus !== "captured") {
                    throw new Error(
                        "This order is not a completed order."
                    );
                }

                setOrder(data);

                const productIds = [
                    ...new Set(
                        data.products?.map(
                            (item) => item.productId
                        ) || []
                    )
                ];

                const productResults =
                    await Promise.all(
                        productIds.map(
                            async (productId) => {
                                try {
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
                                } catch {
                                    return null;
                                }
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
            } catch (error) {
                console.error(
                    "Failed to fetch order:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, user]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    if (loading) {
        return (
            <div className="page">
                <div className="order-details-loading">
                    Loading order details...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="page">
                <div className="order-details-error">
                    <span>ORDER</span>

                    <h1>Order not available</h1>

                    <p>
                        {error ||
                            "Unable to load this order."}
                    </p>

                    <Link
                        to="/orders"
                        className="order-details-button"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="order-details-page">
                <Link
                    to="/orders"
                    className="back-orders"
                >
                    ← Back to Orders
                </Link>

                <div className="order-details-header">
                    <div>
                        <span>ORDER DETAILS</span>

                        <h1>
                            #{order.orderId}
                        </h1>

                        <p>
                            Placed on{" "}
                            {formatDate(
                                order.createdAt
                            )}{" "}
                            at{" "}
                            {formatTime(
                                order.createdAt
                            )}
                        </p>
                    </div>

                    <div className="order-details-status">
                        <span className="paid-status">
                            Paid
                        </span>

                        <span className="order-status-text">
                            {order.orderStatus
                                .charAt(0)
                                .toUpperCase() +
                                order.orderStatus.slice(1)}
                        </span>
                    </div>
                </div>

                <div className="order-details-grid">
                    <div className="order-details-main">
                        <div className="details-card">
                            <div className="details-card-header">
                                <span>
                                    MATERIALS
                                </span>

                                <h2>
                                    Ordered Items
                                </h2>
                            </div>

                            <div className="order-items">
                                {order.products.map(
                                    (item) => {
                                        const product =
                                            products[
                                                item.productId
                                            ];

                                        return (
                                            <div
                                                className="order-item"
                                                key={
                                                    item.productId
                                                }
                                            >
                                                <div className="order-item-image">
                                                    {product?.image ? (
                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                        />
                                                    ) : (
                                                        <span>
                                                            MATERIAL
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="order-item-info">
                                                    <strong>
                                                        {product?.name ||
                                                            item.productId}
                                                    </strong>

                                                    <span>
                                                        {item.quantity}{" "}
                                                        × ₹
                                                        {Number(
                                                            item.unitPrice
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>
                                                </div>

                                                <strong className="order-item-total">
                                                    ₹
                                                    {Number(
                                                        item.totalPrice
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="details-card">
                            <div className="details-card-header">
                                <span>
                                    DELIVERY
                                </span>

                                <h2>
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="shipping-details">
                                <strong>
                                    {
                                        order
                                            .shippingAddress
                                            .name
                                    }
                                </strong>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            .address
                                    }
                                </p>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            .city
                                    }
                                    ,{" "}
                                    {
                                        order
                                            .shippingAddress
                                            .state
                                    }{" "}
                                    -{" "}
                                    {
                                        order
                                            .shippingAddress
                                            .pincode
                                    }
                                </p>

                                <p>
                                    Phone:{" "}
                                    {
                                        order
                                            .shippingAddress
                                            .phone
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-details-sidebar">
                        <div className="details-card summary-card">
                            <div className="details-card-header">
                                <span>
                                    PAYMENT
                                </span>

                                <h2>
                                    Order Summary
                                </h2>
                            </div>

                            <div className="summary-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        order.subtotal
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="summary-row">
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        order.deliveryCharge
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-total">
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

                            <div className="payment-confirmed">
                                Payment completed
                            </div>
                        </div>

                        <div className="details-card">
                            <div className="details-card-header">
                                <span>
                                    ORDER
                                </span>

                                <h2>
                                    Order Status
                                </h2>
                            </div>

                            <div className="order-status-details">
                                <div className="status-line">
                                    <span className="status-dot completed"></span>

                                    <div>
                                        <strong>
                                            Order Placed
                                        </strong>

                                        <span>
                                            Your order has been placed successfully.
                                        </span>
                                    </div>
                                </div>

                                <div className="status-line">
                                    <span
                                        className={`status-dot ${
                                            [
                                                "processing",
                                                "shipped",
                                                "delivered"
                                            ].includes(order.orderStatus)
                                                ? "completed"
                                                : ""
                                        }`}
                                    ></span>

                                    <div>
                                        <strong>
                                            Processing
                                        </strong>

                                        <span>
                                            Your order is being processed.
                                        </span>
                                    </div>
                                </div>

                                <div className="status-line">
                                    <span
                                        className={`status-dot ${
                                            [
                                                "shipped",
                                                "delivered"
                                            ].includes(order.orderStatus)
                                                ? "completed"
                                                : ""
                                        }`}
                                    ></span>

                                    <div>
                                        <strong>
                                            Shipped
                                        </strong>

                                        <span>
                                            Your order has been shipped.
                                        </span>
                                    </div>
                                </div>

                                <div className="status-line">
                                    <span
                                        className={`status-dot ${
                                            order.orderStatus ===
                                            "delivered"
                                                ? "completed"
                                                : ""
                                        }`}
                                    ></span>

                                    <div>
                                        <strong>
                                            Delivered
                                        </strong>

                                        <span>
                                            {order.orderStatus ===
                                            "delivered"
                                                ? "Order delivered successfully."
                                                : "Expected within 2 days."}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;