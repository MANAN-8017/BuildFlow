import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api.js";
import "./Auth.css";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();    
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {  
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch(API.login, {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                });
            const data = await response.json();
            console.log("LOGIN STATUS:", response.status);
            console.log("LOGIN RESPONSE:", data);
            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed"
                );
            }
            await login(data.token);
            console.log("TOKEN SAVED:", localStorage.getItem("token"));
            navigate("/");
        } catch (error){
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/BuildFlow.png" alt="BuildFlow" />
                </div>
                <div className="auth-header">
                    <h1> Welcome Back </h1>
                    <p> Sign in to continue managing your construction materials. </p>
                </div>
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label> Email Address </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="auth-group">
                        <label> Password </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <div className="auth-footer">
                    <span> Don't have an account? </span>
                    <Link to="/register"> Create Account </Link>
                </div>
            </div>
        </div>
    );
}
export default Login;