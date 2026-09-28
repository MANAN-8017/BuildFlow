import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import "../styles/global.css";
import "../styles/Payment.css";

function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { user, updateCart } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

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

                setOrder(data);
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
    }, [orderId, navigate]);

    const verifyPayment = async (response) => {
        const token = localStorage.getItem("token");

        const verifyResponse = await fetch(
            `${API.payments}/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpayOrderId:
                        response.razorpay_order_id,

                    razorpayPaymentId:
                        response.razorpay_payment_id,

                    razorpaySignature:
                        response.razorpay_signature,

                    currency: "INR"
                })
            }
        );

        const data = await verifyResponse.json();

        if (!verifyResponse.ok || !data.success) {
            throw new Error(
                data.message ||
                "Payment verification failed."
            );
        }

        return data;
    };

    const startPayment = () => {
        if (!order) {
            toast.error("Order information is not available.");
            return;
        }

        if (!order.razorpayOrderId) {
            toast.error(
                "Razorpay order information is missing."
            );
            return;
        }

        if (!window.Razorpay) {
            toast.error(
                "Razorpay checkout is not loaded."
            );
            return;
        }

        setPaying(true);

        const options = {
            key: "rzp_test_TR8B2ARZDElYTB",
            amount: Math.round(
                Number(order.totalAmount) * 100
            ),
            currency: "INR",
            name: "BuildFlow",
            description: `Order ${order.orderId}`,
            order_id: order.razorpayOrderId,
            prefill: {
                name:
                    order.shippingAddress?.name ||
                    user?.name ||
                    "",

                email:
                    user?.email ||
                    "",

                contact:
                    order.shippingAddress?.phone ||
                    user?.phone ||
                    ""
            },
            notes: {
                orderId: order.orderId
            },
            theme: {
                color: "#171717"
            },
            handler: async (response) => {
                try {
                    const result =
                        await verifyPayment(response);

                    await updateCart([]);

                    toast.success(
                        "Payment successful."
                    );

                    navigate(
                        `/orders/${order.orderId}`,
                        {
                            replace: true,
                            state: {
                                payment: result
                            }
                        }
                    );
                } catch (error) {
                    console.error(
                        "Payment verification failed:",
                        error
                    );

                    toast.error(
                        error.message ||
                        "Payment verification failed."
                    );

                    setPaying(false);
                }
            },
            modal: {
                ondismiss: () => {
                    setPaying(false);
                }
            }
        };

        const razorpay =
            new window.Razorpay(options);

        razorpay.on(
            "payment.failed",
            (response) => {
                console.error(
                    "Payment failed:",
                    response
                );

                toast.error(
                    response.error?.description ||
                    "Payment failed."
                );

                setPaying(false);
            }
        );

        razorpay.open();
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="payment-card">
                    <div className="payment-loader" />

                    <h1>
                        Loading Payment
                    </h1>

                    <p>
                        Preparing your order for secure
                        payment.
                    </p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="payment-page">
                <div className="payment-card">
                    <h1>
                        Payment Unavailable
                    </h1>

                    <p>
                        {error ||
                            "Unable to load this order."}
                    </p>

                    <Link
                        to="/orders"
                        className="payment-action"
                    >
                        View Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-card">
                <div className="payment-logo">
                    BF
                </div>

                <span>
                    ORDER {order.orderId}
                </span>

                <h1>
                    Complete Payment
                </h1>

                <p>
                    Your order has been created.
                    Complete the payment to confirm
                    your construction material order.
                </p>

                <div className="payment-details">
                    <div className="payment-detail-row">
                        <span>
                            Order ID
                        </span>

                        <strong>
                            {order.orderId}
                        </strong>
                    </div>

                    <div className="payment-detail-row">
                        <span>
                            Materials
                        </span>

                        <strong>
                            {order.products?.reduce(
                                (total, item) =>
                                    total +
                                    Number(
                                        item.quantity || 0
                                    ),
                                0
                            )}
                        </strong>
                    </div>

                    <div className="payment-detail-row">
                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹
                            {Number(
                                order.subtotal || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="payment-detail-row">
                        <span>
                            Delivery
                        </span>

                        <strong>
                            ₹
                            {Number(
                                order.deliveryCharge || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="payment-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {Number(
                                order.totalAmount || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>
                </div>

                <button
                    className="payment-action"
                    onClick={startPayment}
                    disabled={paying}
                >
                    {paying
                        ? "Opening Payment..."
                        : `Pay ₹${Number(
                            order.totalAmount || 0
                        ).toLocaleString("en-IN")}`}
                </button>

                <small>
                    Secure payment powered by Razorpay
                </small>
            </div>
        </div>
    );
}

export default Payment;