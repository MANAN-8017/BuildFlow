import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/global.css";
import "./Cart.css";

function Cart() {
    const { cartItems, cartCount, productName } = useAuth();

    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );

    const delivery = subtotal > 0 ? 100 : 0;
    const total = subtotal + delivery;

    return (
        <div className="page">
            <div className="page-header">
                <span> PROCUREMENT </span>
                <h1> Shopping Cart </h1>
                <p>
                    Review your construction materials
                    before proceeding to checkout.
                </p>
            </div>
            <div className="cart-layout">
                <div className="cart-items">
                    <div className="cart-items-header">
                        <h2> Selected Materials </h2>
                        <span> {cartCount} items </span>
                    </div>
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <h3> Your cart is empty </h3>
                            <p>
                                Add construction materials
                                to start your procurement.
                            </p>
                            <Link to="/products" className="continue-shopping" > Browse Materials → </Link>
                        </div>
                    ):(
                        cartItems.map((item) => (
                            <div className="cart-item" key={ item.productId || item._id } >
                                <div className="material-placeholder">
                                    {item.category ?.charAt(0) ?.toUpperCase()}
                                </div>
                                <div className="material-info">
                                    <span> {item.category} </span>
                                    <h3> {productName[0]} </h3>
                                    <p>₹{Number(item.price || 0).toLocaleString("en-IN")}{" / "}{item.unit}</p>
                                </div>
                                <div className="quantity-control">
                                    <button type="button" > − </button>
                                    <span> {item.quantity} </span>
                                    <button type="button" > + </button>
                                </div>
                                <div className="item-total">
                                    <strong>₹{(Number(item.price || 0) *Number(item.quantity || 0)).toLocaleString("en-IN")}</strong>
                                    <button type="button" className="remove-btn"> Remove </button>
                                </div>
                            </div>
                        ))
                    )}
                    <Link to="/products" className="continue-shopping"> ← Continue Browsing Materials </Link>
                </div>
                <div className="order-summary">
                    <span> ORDER SUMMARY </span>
                    <h2> Procurement Total </h2>
                    <div className="summary-row">
                        <span> Materials </span>
                        <strong> ₹ {subtotal.toLocaleString( "en-IN" )} </strong>
                    </div>
                    <div className="summary-row">
                        <span> Delivery </span>
                        <strong> ₹ {delivery.toLocaleString( "en-IN" )} </strong>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-total">
                        <span> Total </span>
                        <strong> ₹ {total.toLocaleString( "en-IN" )} </strong>
                    </div>
                    <Link to="/checkout" className="checkout-button" > Proceed to Checkout → </Link>
                </div>
            </div>
        </div>
    );
}
export default Cart;