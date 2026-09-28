import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import "../styles/global.css";
import "../styles/Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const {
        user,
        cartItems,
        loading
    } = useAuth();

    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [placingOrder, setPlacingOrder] = useState(false);

    const getProductPrice = (product) => {
        if (!product) return 0;

        const price = Number(product.price || 0);
        const discount = Number(product.discount || 0);

        return price - (price * discount) / 100;
    };

    const subtotal = cartItems.reduce((total, item) => {
        const price = getProductPrice(item.product);
        const quantity = Number(item.quantity || 0);

        return total + price * quantity;
    }, 0);

    const deliveryCharge = subtotal > 0 ? 100 : 0;
    const total = subtotal + deliveryCharge;

    const handleChange = (field, value) => {
        setShippingAddress((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const validateAddress = () => {
        const {
            name,
            phone,
            address,
            city,
            state,
            pincode
        } = shippingAddress;

        if (
            !name.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim()
        ) {
            toast.error("Please fill all delivery details.");
            return false;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            toast.error("Enter a valid 10-digit phone number.");
            return false;
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            toast.error("Enter a valid 6-digit pincode.");
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to continue.");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            navigate("/cart");
            return;
        }

        if (!validateAddress()) {
            return;
        }

        const invalidProduct = cartItems.find(
            (item) => !item.product
        );

        if (invalidProduct) {
            toast.error(
                "Some product information could not be loaded."
            );
            return;
        }

        try {
            setPlacingOrder(true);

            const products = cartItems.map((item) => {
                const unitPrice = getProductPrice(item.product);
                const quantity = Number(item.quantity);

                return {
                    productId: item.productId,
                    quantity,
                    unitPrice,
                    totalPrice: unitPrice * quantity
                };
            });

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API.orders}/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        products,
                        shippingAddress,
                        subtotal,
                        deliveryCharge,
                        totalAmount: total,
                        currency: "INR"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to create order."
                );
            }

            toast.success("Order created successfully.");

            navigate(`/payment/${data.order.orderId}`);
        } catch (error) {
            console.error(
                "Order creation failed:",
                error
            );

            toast.error(
                error.message || "Failed to create order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>CHECKOUT</span>
                    <h1>Complete Your Order</h1>
                    <p>Loading your checkout...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>CHECKOUT</span>
                    <h1>Complete Your Order</h1>
                    <p>
                        Please login before proceeding to checkout.
                    </p>
                </div>

                <div className="empty-cart">
                    <h3>Login required</h3>

                    <p>
                        Your checkout is connected to your
                        BuildFlow account.
                    </p>

                    <Link
                        to="/login"
                        className="checkout-button"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>CHECKOUT</span>
                    <h1>Complete Your Order</h1>
                    <p>
                        Your cart is currently empty.
                    </p>
                </div>

                <div className="empty-cart">
                    <h3>No materials selected</h3>

                    <p>
                        Add construction materials to
                        continue with checkout.
                    </p>

                    <Link
                        to="/products"
                        className="checkout-button"
                    >
                        Browse Materials
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <span>CHECKOUT</span>

                <h1>Complete Your Order</h1>

                <p>
                    Provide your delivery details and review
                    your procurement before payment.
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
                                    Where should we deliver
                                    your materials?
                                </p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>

                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={
                                        shippingAddress.name
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>

                                <input
                                    type="tel"
                                    placeholder="10 digit phone number"
                                    value={
                                        shippingAddress.phone
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group full">
                                <label>Address</label>

                                <textarea
                                    placeholder="Enter delivery address"
                                    rows="4"
                                    value={
                                        shippingAddress.address
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>City</label>

                                <input
                                    type="text"
                                    placeholder="City"
                                    value={
                                        shippingAddress.city
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>State</label>

                                <input
                                    type="text"
                                    placeholder="State"
                                    value={
                                        shippingAddress.state
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "state",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Pincode</label>

                                <input
                                    type="text"
                                    placeholder="6 digit pincode"
                                    value={
                                        shippingAddress.pincode
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "pincode",
                                            e.target.value
                                        )
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
                                    Verify your materials
                                    and quantities.
                                </p>
                            </div>
                        </div>

                        {cartItems.map((item) => {
                            const product = item.product;
                            const price =
                                getProductPrice(product);

                            const quantity =
                                Number(item.quantity);

                            const itemTotal =
                                price * quantity;

                            return (
                                <div
                                    className="review-item"
                                    key={item.productId}
                                >
                                    <div>
                                        <span>
                                            {product.name}
                                        </span>

                                        <small>
                                            ₹
                                            {price.toLocaleString(
                                                "en-IN"
                                            )}
                                            {" × "}
                                            {quantity}
                                        </small>
                                    </div>

                                    <strong>
                                        ₹
                                        {itemTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
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

                        <strong>
                            ₹
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>

                        <strong>
                            ₹
                            {deliveryCharge.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <button
                        className="payment-button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder
                            ? "Creating Order..."
                            : "Continue to Payment →"}
                    </button>

                    <Link
                        to="/cart"
                        className="back-cart"
                    >
                        ← Back to Cart
                    </Link>

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