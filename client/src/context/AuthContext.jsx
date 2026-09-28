import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const login = async (token) => {
        localStorage.setItem("token", token);
        const loggedInUser = await fetchUser();

        if (loggedInUser) {
            await fetchCart();
        }

        return loggedInUser;
    };

    const fetchUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            return null;
        }

        try {
            const response = await fetch(API.me, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                localStorage.removeItem("token");
                setUser(null);
                setCart(null);
                setProducts([]);
                return null;
            }

            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token");
            setUser(null);
            setCart(null);
            setProducts([]);
            return null;
        }
    };

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setCart(null);
            setProducts([]);
            return null;
        }

        try {
            const response = await fetch(API.cart, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setCart(null);
                setProducts([]);
                return null;
            }

            const currentCart = data.cart;
            setCart(currentCart);

            const productIds = currentCart?.products?.map(
                (item) => item.productId
            ) || [];

            await fetchProduct(productIds);

            return currentCart;
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart(null);
            setProducts([]);
            return null;
        }
    };

    const fetchProduct = async (productIds = []) => {
        if (!productIds.length) {
            setProducts([]);
            return [];
        }

        try {
            const uniqueProductIds = [...new Set(productIds)];

            const productResults = await Promise.all(
                uniqueProductIds.map(async (productId) => {
                    const response = await fetch(
                        `${API.products}/${productId}`
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            `Failed to fetch product ${productId}`
                        );
                    }

                    return data;
                })
            );

            setProducts(productResults);
            return productResults;
        } catch (error) {
            console.error("Failed to fetch cart products:", error);
            setProducts([]);
            return [];
        }
    };

    const updateCart = async (updatedProducts) => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please login to manage your cart.");
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
                data.message || "Failed to update cart."
            );
        }

        await fetchCart();

        return data.cart;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setCart(null);
        setProducts([]);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const loggedInUser = await fetchUser();

                if (loggedInUser) {
                    await fetchCart();
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const productMap = products.reduce((map, product) => {
        if (product?.productId) {
            map[product.productId] = product;
        }

        return map;
    }, {});

    const cartItems = (cart?.products || []).map((cartItem) => ({
        ...cartItem,
        product: productMap[cartItem.productId] || null
    }));

    const cartCount = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    return (
        <AuthContext.Provider
            value={{
                login,
                fetchUser,
                fetchCart,
                fetchProduct,
                updateCart,
                logout,
                user,
                cart,
                cartItems,
                cartCount,
                products,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}