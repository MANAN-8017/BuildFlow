import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/global.css";
import "../styles/Cart.css";

function Cart() {
    const {
        user,
        cartItems,
        cartCount,
        updateCart,
        loading
    } = useAuth();

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

    const delivery = subtotal > 0 ? 100 : 0;
    const total = subtotal + delivery;

    const changeQuantity = async (productId, change) => {
        const currentItem = cartItems.find(
            (item) => item.productId === productId
        );

        if (!currentItem) return;

        const currentQuantity = Number(currentItem.quantity);
        const newQuantity = currentQuantity + change;

        if (newQuantity < 1) {
            await removeItem(productId);
            return;
        }

        const availableStock = Number(
            currentItem.product?.quantity || 0
        );

        if (newQuantity > availableStock) {
            toast.error(`Only ${availableStock} units available.`);
            return;
        }

        try {
            const updatedProducts = cartItems.map((item) => ({
                productId: item.productId,
                quantity:
                    item.productId === productId
                        ? newQuantity
                        : Number(item.quantity)
            }));

            await updateCart(updatedProducts);
            toast.success("Cart updated.");
        } catch (error) {
            console.error("Quantity update failed:", error);
            toast.error(
                error.message || "Failed to update cart."
            );
        }
    };

    const removeItem = async (productId) => {
        try {
            const updatedProducts = cartItems
                .filter((item) => item.productId !== productId)
                .map((item) => ({
                    productId: item.productId,
                    quantity: Number(item.quantity)
                }));

            await updateCart(updatedProducts);
            toast.success("Product removed from cart.");
        } catch (error) {
            console.error("Remove item failed:", error);
            toast.error(
                error.message || "Failed to remove product."
            );
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>PROCUREMENT</span>
                    <h1>Shopping Cart</h1>
                    <p>Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page">
                <div className="page-header">
                    <span>PROCUREMENT</span>
                    <h1>Shopping Cart</h1>
                    <p>Please login to view your personal cart.</p>
                </div>

                <div className="empty-cart">
                    <h3>Login required</h3>
                    <p>
                        Your cart is connected to your BuildFlow
                        account.
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

    return (
        <div className="page">
            <div className="page-header">
                <span>PROCUREMENT</span>
                <h1>Shopping Cart</h1>
                <p>
                    Review your construction materials before
                    proceeding to checkout.
                </p>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    <div className="cart-items-header">
                        <h2>Selected Materials</h2>
                        <span>
                            {cartCount}{" "}
                            {cartCount === 1 ? "item" : "items"}
                        </span>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <h3>Your cart is empty</h3>
                            <p>
                                Add construction materials to
                                start your procurement.
                            </p>

                            <Link
                                to="/products"
                                className="continue-shopping"
                            >
                                Browse Materials →
                            </Link>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const product = item.product;
                            const price = getProductPrice(product);
                            const itemTotal =
                                price * Number(item.quantity);

                            return (
                                <div
                                    className="cart-item"
                                    key={item.productId}
                                >
                                    <div className="material-placeholder">
                                        {product?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "M"}
                                    </div>

                                    <div className="material-info">
                                        <span>
                                            CONSTRUCTION MATERIAL
                                        </span>

                                        <h3>
                                            {product
                                                ? product.name
                                                : "Product unavailable"}
                                        </h3>

                                        {product ? (
                                            <p>
                                                ₹
                                                {price.toLocaleString(
                                                    "en-IN"
                                                )}{" "}
                                                / unit
                                            </p>
                                        ) : (
                                            <p>
                                                Product information
                                                unavailable
                                            </p>
                                        )}
                                    </div>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(
                                                    item.productId,
                                                    -1
                                                )
                                            }
                                            disabled={!product}
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(
                                                    item.productId,
                                                    1
                                                )
                                            }
                                            disabled={!product}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        <strong>
                                            ₹
                                            {itemTotal.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() =>
                                                removeItem(
                                                    item.productId
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <Link
                        to="/products"
                        className="continue-shopping"
                    >
                        ← Continue Browsing Materials
                    </Link>
                </div>

                <div className="order-summary">
                    <span>ORDER SUMMARY</span>

                    <h2>Procurement Total</h2>

                    <div className="summary-row">
                        <span>Materials</span>
                        <strong>
                            ₹
                            {subtotal.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Delivery</span>
                        <strong>
                            ₹
                            {delivery.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total</span>
                        <strong>
                            ₹
                            {total.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    {cartItems.length > 0 ? (
                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Proceed to Checkout →
                        </Link>
                    ) : (
                        <Link
                            to="/products"
                            className="checkout-button"
                        >
                            Browse Materials →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart;