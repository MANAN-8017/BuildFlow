import { createContext, useContext, useEffect, useState } from "react";

import API from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (token) => {
        localStorage.setItem("token", token);

        const loggedInUser = await fetchUser();

        if (loggedInUser) {
            console.log("Logged in successfully!");
            setLoading(true);
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

            if (!response.ok || !data.success){
                localStorage.removeItem("token");

                setUser(null);
                setCart(null);

                return null;
            }
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Failed to fetch user:", error);

            localStorage.removeItem("token");

            setUser(null);
            setCart(null);

            return null;
        }
    };

    const fetchCart = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            setCart(null);
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
                return null;
            }

            setCart(data.cart);

            const productIds = data.cart?.products?.map(item => item.productId) || null;
            fetchProduct(productIds);
            
            return data.cart;
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCart(null);
            return null;
        }
        
    };
    
    const fetchProduct = async (productIds) => {
        try{
            if(productIds == []){
                console.error("Failed to fetch productId:");
                setProducts([]);
                return [];
            }

            const products = await Promise.all(
                productIds.map(async (productId) => {
                    const response = await fetch(`${API.products}/${productId}`);
                    const data = await response.json();
                    return data;
                })
            );
        
                console.log("PRODUCT IS HERE", products);
                setProducts(products);
                return products;
            } catch(error){
                console.error("Failed to fetch product:", error);
                setProducts([]);
                return [];
            }
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
            
            if (!token){
                setLoading(false);
                return;
            }
            try{
                const loggedInUser = await fetchUser();
                if (loggedInUser) {
                    await fetchCart();
                }
            } finally{
                setLoading(false);
            }
        };

        initializeAuth();
        
    }, []);
    
    const cartItems = cart?.products || [];
    const cartCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const productName = products?.map(item => item.name) || [];
    
    return (
        <AuthContext.Provider
            value={{
                login,
                fetchUser,
                fetchCart,
                fetchProduct,
                logout,
                user,
                cart,
                cartItems,
                cartCount,
                productName
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}