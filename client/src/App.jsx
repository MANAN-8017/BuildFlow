import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import NavbarLayout from "./layouts/NavbarLayout.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Payment from "./pages/Payment.jsx";
import Orders from "./pages/Orders.jsx";
import Products from "./pages/Products.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Estimation from "./pages/Estimation.jsx";
import Profile from "./pages/Profile.jsx";
import EstimationDetails from "./pages/EstimationDetails.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<NavbarLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/payment/:orderId" element={<Payment />} />
                        <Route path="/orders" element={<Orders />}/>
                        <Route path="/orders/:orderId" element={<OrderDetails />} />
                        <Route path="/estimation" element={<Estimation />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/estimation/:estimationId" element={<EstimationDetails />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;