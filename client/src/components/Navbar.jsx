import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const { user, cartCount, loading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const closeMenu = () => { setMenuOpen(false); };

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        setMenuOpen(false);
        navigate("/");
    };
    if (loading){
        return (
            <header className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand" >
                        <img src="/BuildFlow.png" alt="BuildFlow" />
                        <div className="brand-text">
                            <strong> BuildFlow </strong>
                            <span> Construction Platform </span>
                        </div>
                    </Link>
                </div>
            </header>
        );
    }

    const userName = user?.name || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    return(
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <img src="/BuildFlow.png" alt="BuildFlow"/>
                    <div className="brand-text">
                        <strong> BuildFlow </strong>
                        <span> Construction Platform </span>
                    </div>
                </Link>
                <nav className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" }> Home </NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" }> Products </NavLink>
                    <NavLink to="/estimation" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" }> Estimation </NavLink>
                    
                    <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active cart-link" : "nav-link cart-link" }>
                        Cart
                        {cartCount > 0 && (
                            <span className="cart-count">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link" } > Orders </NavLink>
                </nav>

                <div className="navbar-actions">
                    {!user ? (
                        <>
                            <Link to="/login" className="login-link" > Login </Link>
                            <Link to="/register" className="register-button" > Get Started </Link>
                        </>
                    ):(
                        <div className="profile-wrapper">
                            <button type="button" className="profile-button" onClick={() => setProfileOpen( previous => !previous )} >
                                
                                <div className="profile-avatar"> {userInitial} </div>
                                <span className="profile-name"> {userName} </span>
                                <span className="profile-arrow"> {profileOpen? "↑": "↓"} </span>

                            </button>

                            {profileOpen && (
                                <div className="profile-menu">

                                    <Link to="/profile" onClick={() => setProfileOpen(false) } > Profile </Link>
                                    <Link to="/orders" onClick={() => setProfileOpen(false) } > My Orders</Link>
                                    <Link to="/cart" onClick={() => setProfileOpen(false) } > 
                                        Cart {cartCount > 0 && ` (${cartCount})`}
                                    </Link>

                                    <div className="profile-divider" />
                                    <button type="button" onClick={handleLogout} > Logout </button>
                                </div>
                            )}
                        </div>
                    )}
                    <button type="button" className="menu-button" onClick={() => setMenuOpen(previous => !previous)} aria-label="Toggle navigation" >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="mobile-menu">

                    <NavLink to="/" onClick={closeMenu}> Home </NavLink>
                    <NavLink to="/products" onClick={closeMenu}> Products </NavLink>
                    <NavLink to="/estimation" onClick={closeMenu}> Estimation </NavLink>
                    
                    <NavLink to="/cart" onClick={closeMenu} >
                        Cart
                        {cartCount > 0 && (<span className="cart-count">{cartCount}</span>)}
                    </NavLink>

                    <NavLink to="/orders" onClick={closeMenu}> Orders </NavLink>

                <div className="mobile-divider" />
                    {!user ? (
                        <>
                            <Link to="/login" onClick={closeMenu} > Login </Link>
                            <Link to="/register" className="mobile-register" onClick={closeMenu}> Get Started </Link>
                        </>
                    ):(
                        <>
                            <Link to="/profile" onClick={closeMenu} > Profile </Link>
                            <button type="button" onClick={handleLogout} > Logout </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
export default Navbar;