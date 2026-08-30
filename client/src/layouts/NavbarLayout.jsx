import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function NavbarLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default NavbarLayout;