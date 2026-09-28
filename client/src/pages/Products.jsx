import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/Products.css";

function Products() {
    const { user, cart, fetchCart } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API.products);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch products");
            }

            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setError("Unable to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                product.name?.toLowerCase().includes(searchText) ||
                product.description?.toLowerCase().includes(searchText);

            const matchesStock =
                stockFilter === "all" ||
                (stockFilter === "available" && Number(product.quantity) > 0) ||
                (stockFilter === "out" && Number(product.quantity) === 0);

            return matchesSearch && matchesStock;
        });
    }, [products, search, stockFilter]);

    const getDiscountedPrice = (product) => {
        const price = Number(product.price || 0);
        const discount = Number(product.discount || 0);

        return price - (price * discount) / 100;
    };

    const addToCart = async (product) => {
    if (!user) {
        toast.error("Please login to add products to cart.");
        return;
    }

    if (Number(product.quantity) <= 0) {
        toast.error("This product is out of stock.");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login again.");
            return;
        }

        const currentProducts = cart?.products || [];

        const existingProduct = currentProducts.find(
            (item) => item.productId === product.productId
        );

        let updatedProducts;

        if (existingProduct) {
            if (existingProduct.quantity >= product.quantity) {
                toast.error("You cannot add more than available stock.");
                return;
            }

            updatedProducts = currentProducts.map((item) =>
                item.productId === product.productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            );
        } else {
            updatedProducts = [
                ...currentProducts,
                {
                    productId: product.productId,
                    quantity: 1
                }
            ];
        }

        let response;

        if (!cart?.cartId) {
            response = await fetch(`${API.cart}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    products: updatedProducts
                })
            });
        } else {
            response = await fetch(
                `${API.cart}/${cart.cartId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        products: updatedProducts
                    })
                }
            );
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to add product to cart."
            );
        }

        await fetchCart();

        if (existingProduct) {
            toast.success("Product quantity increased.");
        } else {
            toast.success("Product added to cart.");
        }

    } catch (error) {
        console.error("Add to cart error:", error);

        toast.error(
            error.message || "Failed to add product to cart."
        );
    }
};

    if (loading) {
        return (
            <main className="products-page">
                <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="products-page">

            <section className="products-header">
                <div>
                    <span className="section-label">BUILDFLOW MATERIALS</span>

                    <h1>Construction Materials</h1>

                    <p>
                        Browse construction materials, compare prices,
                        and add the required materials to your cart.
                    </p>
                </div>

                <Link to="/cart" className="view-cart-button">
                    View Cart
                </Link>
            </section>

            <section className="products-controls">

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="all">All Products</option>
                        <option value="available">In Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>

            </section>

            {error && (
                <section className="products-error">
                    <p>{error}</p>

                    <button onClick={fetchProducts}>
                        Try Again
                    </button>
                </section>
                
            )}

            {!error && filteredProducts.length === 0 && (
                <section className="empty-products">
                    <h2>No products found</h2>
                    <p>
                        Try changing your search or filter.
                    </p>
                </section>
            )}

            {!error && filteredProducts.length > 0 && (
                <section className="products-grid">

                    {filteredProducts.map((product) => {
                        const price = Number(product.price || 0);
                        const discount = Number(product.discount || 0);
                        const finalPrice = getDiscountedPrice(product);
                        const stock = Number(product.quantity || 0);

                        return (
                            <article
                                className="product-card"
                                key={product.productId}
                            >

                                <div className="product-image">
                                    <span>
                                        MATERIAL
                                    </span>
                                </div>

                                <div className="product-content">

                                    <div className="product-top">
                                        {stock > 0 ? (
                                            <span className="stock available">
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="stock unavailable">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    <h2>{product.name}</h2>

                                    <p className="product-description">
                                        {product.description ||
                                            "Construction material available through BuildFlow."}
                                    </p>

                                    <div className="product-price">

                                        <div>
                                            <strong>
                                                ₹{finalPrice.toLocaleString("en-IN")}
                                            </strong>

                                            {discount > 0 && (
                                                <span className="original-price">
                                                    ₹{price.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>

                                        {discount > 0 && (
                                            <span className="discount">
                                                {discount}% OFF
                                            </span>
                                        )}

                                    </div>

                                    <div className="product-footer">

                                        <span className="stock-count">
                                            {stock > 0
                                                ? `${stock} available`
                                                : "Currently unavailable"}
                                        </span>

                                        <button
                                            className="add-cart-button"
                                            disabled={stock <= 0}
                                            onClick={() => addToCart(product)}
                                        >
                                            {stock > 0
                                                ? "Add to Cart"
                                                : "Unavailable"}
                                        </button>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </section>
            )}

        </main>
    );
}
export default Products;